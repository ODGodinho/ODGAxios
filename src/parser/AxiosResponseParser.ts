import http from "node:http";

import { type ResponseInterface } from "@odg/message";
import {
    type InternalAxiosRequestConfig, type RawAxiosResponseHeaders, type AxiosResponse, type AxiosResponseHeaders,
} from "axios";

import { AxiosParser } from "./AxiosParser";
import { AxiosRequestParser } from "./AxiosRequestParser";

export class AxiosResponseParser {

    protected static requestParser = AxiosRequestParser;

    /**
     * Cast ResponseInterface To AxiosResponse
     *
     * @template {any} RequestD Data Request
     * @template {any} ResponseD Data Response
     * @param {ResponseInterface<RequestD, ResponseD>} response axios Response Object
     * @returns {AxiosResponse<ResponseD, RequestD>}
     */
    public static parseMessageToLibrary<RequestD, ResponseD>(
        response: ResponseInterface<RequestD, ResponseD>,
    ): AxiosResponse<ResponseD, RequestD> {
        return {
            data: response.data,
            status: response.status,
            statusText: http.STATUS_CODES[response.status] ?? "Unknown Status Code",
            headers: AxiosParser.parseHeaders(response.headers) as unknown as AxiosResponseHeaders,
            config: this.requestParser.parseMessageToLibrary({
                ...response.request,
                endTime: Date.now(),
            }) as InternalAxiosRequestConfig<RequestD>,
            ...Object.fromEntries(Object.entries(response).filter(([ key ]) => String(key).startsWith("$"))),
        };
    }

    /**
     * Cast AxiosResponse axios To ResponseInterface
     *
     * @template {any} RequestD Data Request
     * @template {any} ResponseD Data Response
     * @param {AxiosResponse<ResponseD, RequestD>} response axios Response Object
     * @returns {ResponseInterface<RequestD, ResponseD>}
     */
    public static parseLibraryToMessage<RequestD, ResponseD>(
        response: AxiosResponse<ResponseD, RequestD>,
    ): ResponseInterface<RequestD, ResponseD> {
        return {
            data: response.data,
            status: response.status,
            headers: AxiosParser.parseHeaders(response.headers),
            request: typeof response.config === "undefined"
                ? {}
                : this.requestParser.parseLibraryToMessage<RequestD>({
                    ...response.config,
                    endTime: Date.now(),
                    headers: AxiosParser.parseHeaders(response.config.headers) as unknown as RawAxiosResponseHeaders,
                }),
            ...Object.fromEntries(Object.entries(response).filter(([ key ]) => String(key).startsWith("$"))),
        };
    }

}
