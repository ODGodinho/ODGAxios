import http from "node:http";

import { type ResponseInterface } from "@odg/message";
import {
    type InternalAxiosRequestConfig, type RawAxiosResponseHeaders, type AxiosResponse, type AxiosResponseHeaders,
} from "axios";

import { AxiosParser } from "./AxiosParser";
import { AxiosRequestParser } from "./AxiosRequestParser";

export class AxiosResponseParser {

    /**
     * Cast ResponseInterface To AxiosResponse
     *
     * @template {any} RequestD Data Request
     * @template {any} ResponseD Data Response
     * @param {ResponseInterface<RequestD, ResponseD>} response axios Response Object
     * @returns {Promise<AxiosResponse<ResponseD, RequestD>>}
     */
    public static async parseMessageToLibrary<RequestD, ResponseD>(
        response: ResponseInterface<RequestD, ResponseD>,
    ): Promise<AxiosResponse<ResponseD, RequestD>> {
        return {
            data: response.data,
            status: response.status,
            statusText: http.STATUS_CODES[response.status] ?? "Unknown Status Code",
            headers: AxiosParser.parseHeaders(response.headers) as unknown as AxiosResponseHeaders,
            config: AxiosRequestParser.parseMessageToLibrary({
                ...response.request,
            }) as InternalAxiosRequestConfig<RequestD>,
        };
    }

    /**
     * Cast AxiosResponse axios To ResponseInterface
     *
     * @template {any} RequestD Data Request
     * @template {any} ResponseD Data Response
     * @param {AxiosResponse<ResponseD, RequestD>} response axios Response Object
     * @returns {Promise<ResponseInterface<RequestD, ResponseD>>}
     */
    public static async parseLibraryToMessage<RequestD, ResponseD>(
        response: AxiosResponse<ResponseD, RequestD>,
    ): Promise<ResponseInterface<RequestD, ResponseD>> {
        return {
            data: response.data,
            status: response.status,
            headers: AxiosParser.parseHeaders(response.headers),
            request: await AxiosRequestParser.parseLibraryToMessage<RequestD>({
                ...response.config,
                headers: AxiosParser.parseHeaders(response.config.headers) as unknown as RawAxiosResponseHeaders,
            }),
        };
    }

}
