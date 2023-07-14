import { Exception } from "@odg/exception";
import {
    type InterceptorManager,
    type RequestInterface,
    type ResponseInterface,
    type MessageInterface,
    type DefaultMessageConstructor,
    MessageException,
} from "@odg/message";
import axios, {
    type AxiosInstance,
    type AxiosResponse,
} from "axios";

import { AxiosInterceptorRequest } from "./interceptors/AxiosInterceptorRequest";
import { AxiosInterceptorResponse } from "./interceptors/AxiosInterceptorResponse";
import { AxiosParser } from "./parser/AxiosParser";
import { AxiosRequestParser } from "./parser/AxiosRequestParser";
import { AxiosResponseParser } from "./parser/AxiosResponseParser";

export class AxiosMessage<RequestData, ResponseData> implements MessageInterface<RequestData, ResponseData> {

    public readonly interceptors!: {
        request: InterceptorManager<RequestInterface<RequestData>>;
        response: InterceptorManager<ResponseInterface<RequestData, ResponseData>>;
    };

    private readonly client: AxiosInstance;

    public constructor(config?: DefaultMessageConstructor<RequestData>) {
        this.client = axios.create(config && AxiosRequestParser.parseMessageToLibrary(config));

        this.interceptors = {
            request: new AxiosInterceptorRequest<RequestData>(
                this.client.interceptors.request,
            ),
            response: new AxiosInterceptorResponse<RequestData, ResponseData>(
                this.client.interceptors.response,
            ),
        };
    }

    /**
     * Request Abstract
     *
     * @template {any} RequestD Request Data
     * @template {any} ResponseD Response Data
     * @param {RequestInterface<RequestD>} options Opções de requisição
     * @returns {Promise<ResponseInterface<RequestD, ResponseD>>}
     */
    public async request<
        RequestD = RequestData,
        ResponseD = ResponseData,
    >(options: RequestInterface<RequestD>): Promise<ResponseInterface<RequestD, ResponseD>> {
        try {
            const response = await this.client.request<ResponseD, AxiosResponse<ResponseD, RequestD>, RequestD>(
                AxiosRequestParser.parseMessageToLibrary(options),
            );

            return await this.parseResponseData(response);
        } catch (error: unknown) {
            throw await this.requestException(error);
        }
    }

    /**
     * Cast Response axios To ResponseInterface
     *
     * @template {any} RequestD Data Request
     * @template {any} ResponseD Data Response
     * @param {AxiosResponse<ResponseD, RequestD>} response axios Response Object
     * @returns {Promise<ResponseInterface<RequestD, ResponseD>>}
     */
    public async parseResponseData<RequestD, ResponseD>(
        response: AxiosResponse<ResponseD, RequestD>,
    ): Promise<ResponseInterface<RequestD, ResponseD>> {
        return {
            data: response.data,
            status: response.status,
            headers: AxiosParser.parseHeaders(response.headers),
            request: {
                ...response.config,
                headers: AxiosParser.parseHeaders(response.config.headers),
            },
        };
    }

    /**
     * Request Exception parse MessageException
     *
     * @param {unknown} error Error Exception
     * @throws {MessageException} Convert Message Exception class
     * @returns {Promise<Error>}
     */
    private async requestException(error: unknown): Promise<Error> {
        const exceptionConverted = Exception.parse(error);
        if (!exceptionConverted) return error as Error;

        const requestParser = axios.isAxiosError(error) && error.config
            ? await AxiosRequestParser.parseLibraryToMessage(error.config)
            : undefined;

        const responseParser = axios.isAxiosError(error) && "response" in error && error.response
            ? await AxiosResponseParser.parseLibraryToMessage(error.response)
            : undefined;

        const exception = new MessageException(
            exceptionConverted.message,
            exceptionConverted.preview,
            undefined,
            requestParser,
            responseParser,
        );
        Object.defineProperty(exception, "isAxiosError", {
            configurable: true,
            enumerable: false,
            value: axios.isAxiosError(error),
            writable: true,
        });

        return exception;
    }

}
