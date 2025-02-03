import { Exception } from "@odg/exception";
import {
    type InterceptorManager,
    type RequestInterface,
    type ResponseInterface,
    type MessageInterface,
} from "@odg/message";
import axios, {
    type AxiosRequestConfig,
    type AxiosInterceptorManager,
    type RawAxiosResponseHeaders,
    type AxiosInstance,
    type AxiosResponse,
} from "axios";

import { AxiosParser } from "./parser/AxiosParser";

import { AxiosInterceptorRequest } from "./interceptors/AxiosInterceptorRequest";
import { AxiosInterceptorResponse } from "./interceptors/AxiosInterceptorResponse";
import { AxiosRequestParser } from "./parser/AxiosRequestParser";
import { AxiosResponseParser } from "./parser/AxiosResponseParser";

export class AxiosMessage<RequestData, ResponseData> implements MessageInterface<RequestData, ResponseData> {

    public readonly interceptors!: {
        request: InterceptorManager<RequestInterface<RequestData>>;
        response: InterceptorManager<ResponseInterface<RequestData, ResponseData>>;
    };

    private readonly client: AxiosInstance;

    public constructor(config?: RequestInterface<RequestData>) {
        this.client = axios.create(config && AxiosRequestParser.parseMessageToLibrary(config));

        this.interceptors = {
            request: new AxiosInterceptorRequest<RequestData>(
                this.client.interceptors.request as AxiosInterceptorManager<AxiosRequestConfig<RequestData>>,
            ),
            response: new AxiosInterceptorResponse<RequestData, ResponseData>(
                this.client.interceptors.response,
            ),
        };
    }

    public setDefaultOptions(config?: RequestInterface<RequestData>): this {
        const defaults = AxiosRequestParser.parseMessageToLibrary({
            ...config,
            headers: AxiosParser.parseHeaders(config?.headers),
        });

        for (const [ key, value ] of Object.entries(defaults)) {
            this.client.defaults[key as keyof AxiosRequestConfig] = value as unknown;
        }

        return this;
    }

    public getDefaultOptions(): RequestInterface<RequestData> {
        const config = this.client.defaults;

        return AxiosRequestParser.parseLibraryToMessage<RequestData>({
            ...config,
            headers: AxiosParser.parseHeaders(config.headers) as unknown as RawAxiosResponseHeaders,
        });
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

            return AxiosResponseParser.parseLibraryToMessage(response);
        } catch (error: unknown) {
            // eslint-disable-next-line no-throw-literal
            throw Exception.parse(error)!;
        }
    }

}
