import { Exception } from "@odg/exception";
import {
    type InterceptorManager,
    type RequestInterface,
    type ResponseInterface,
    type MessageInterface,
    type DefaultMessageConstructor,
} from "@odg/message";
import axios, {
    type AxiosInstance,
    type AxiosResponse,
} from "axios";

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

            return AxiosResponseParser.parseLibraryToMessage(response);
        } catch (error: unknown) {
            throw Exception.parse(error) as Error;
        }
    }

}
