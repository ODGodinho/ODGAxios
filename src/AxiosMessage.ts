import { Exception } from "@odg/exception";
import {
    type RequestOptionsParametersInterface,
    type InterceptorsInterface,
    type RequestInterface,
    type ResponseInterface,
    type MessageInterface,
    ODGMessage,
} from "@odg/message";
import axios, {
    type AxiosRequestConfig,
    type AxiosInterceptorManager,
    type RawAxiosResponseHeaders,
    type AxiosInstance,
    type AxiosResponse,
} from "axios";

import { AxiosInterceptorRequest } from "./interceptors/AxiosInterceptorRequest";
import { AxiosInterceptorResponse } from "./interceptors/AxiosInterceptorResponse";
import { AxiosParser } from "./parser/AxiosParser";
import { AxiosRequestParser } from "./parser/AxiosRequestParser";
import { AxiosResponseParser } from "./parser/AxiosResponseParser";

export class AxiosMessage<
    RequestData,
    ResponseData,
> extends ODGMessage implements MessageInterface<RequestData, ResponseData> {

    public readonly interceptors!: Readonly<InterceptorsInterface<RequestData, ResponseData>>;

    protected readonly client: AxiosInstance;

    protected readonly requestParser = AxiosRequestParser;

    protected readonly responseParser = AxiosResponseParser;

    public constructor(options?: RequestOptionsParametersInterface<RequestData>) {
        super();
        this.client = axios.create(options && this.requestParser.parseMessageToLibrary(options));

        this.interceptors = Object.freeze({
            request: new AxiosInterceptorRequest<RequestData>(
                this.client.interceptors.request as AxiosInterceptorManager<AxiosRequestConfig<RequestData>>,
            ),
            response: new AxiosInterceptorResponse<RequestData, ResponseData>(
                this.client.interceptors.response,
            ),
        });
    }

    public setDefaultOptions(config?: Partial<RequestOptionsParametersInterface<RequestData>>): this {
        const defaults = this.requestParser.parseMessageToLibrary({
            ...config,
            headers: AxiosParser.parseHeaders(config?.headers),
        });

        for (const [ key, value ] of Object.entries(defaults)) {
            this.client.defaults[key as keyof AxiosRequestConfig] = value as unknown;
        }

        return this;
    }

    public getDefaultOptions(): Partial<RequestInterface<RequestData>> {
        const config = this.client.defaults;

        return this.requestParser.parseLibraryToMessage<RequestData>({
            ...config,
            headers: AxiosParser.parseHeaders(config.headers) as unknown as RawAxiosResponseHeaders,
        });
    }

    /**
     * Request Abstract
     *
     * @template {any} RequestD Request Data
     * @template {any} ResponseD Response Data
     * @param {RequestOptionsParametersInterface<RequestD>} options Opções de requisição
     * @returns {Promise<ResponseInterface<RequestD, ResponseD>>}
     */
    public async request<
        RequestD = RequestData,
        ResponseD = ResponseData,
    >(
        options: RequestOptionsParametersInterface<RequestD>,
    ): Promise<ResponseInterface<RequestD, ResponseD>> {
        try {
            const response = await this.client.request<ResponseD, AxiosResponse<ResponseD, RequestD>, RequestD>(
                this.requestParser.parseMessageToLibrary(options),
            );

            return this.responseParser.parseLibraryToMessage(response);
        } catch (error: unknown) {
            // eslint-disable-next-line no-throw-literal
            throw Exception.parse(error)!;
        }
    }

}
