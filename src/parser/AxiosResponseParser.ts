import http from "node:http";

import { MessageResponse } from "@odg/message";
import {
    type InternalAxiosRequestConfig, type RawAxiosResponseHeaders, type AxiosResponse, type AxiosResponseHeaders,
} from "axios";

import { AxiosParser } from "./AxiosParser";
import { AxiosRequestParser } from "./AxiosRequestParser";

export class AxiosResponseParser {

    protected static requestParser = AxiosRequestParser;

    /**
     * Cast MessageResponse To AxiosResponse
     *
     * @template {any} RequestD Data Request
     * @template {any} ResponseD Data Response
     * @param {MessageResponse<RequestD, ResponseD>} message axios Response Object
     * @returns {AxiosResponse<ResponseD, RequestD>}
     */
    public static parseMessageToLibrary<RequestD, ResponseD>(
        message: MessageResponse<RequestD, ResponseD>,
    ): AxiosResponse<ResponseD, RequestD> {
        return {
            data: message.response.data,
            status: message.response.status,
            statusText: http.STATUS_CODES[message.response.status] ?? "Unknown Status Code",
            headers: AxiosParser.parseHeaders(message.response.headers) as unknown as AxiosResponseHeaders,
            config: this.requestParser.parseMessageToLibrary({
                ...message.request,
                endTime: Date.now(),
            }) as InternalAxiosRequestConfig<RequestD>,
            ...Object.fromEntries(Object.entries(message).filter(([ key ]) => String(key).startsWith("$"))),
        };
    }

    /**
     * Cast AxiosResponse axios To MessageResponse
     *
     * @template {any} RequestD Data Request
     * @template {any} ResponseD Data Response
     * @param {AxiosResponse<ResponseD, RequestD>} response axios Response Object
     * @returns {MessageResponse<RequestD, ResponseD>}
     */
    public static parseLibraryToMessage<RequestD, ResponseD>(
        response: AxiosResponse<ResponseD, RequestD>,
    ): MessageResponse<RequestD, ResponseD> {
        const responseParser = {
            data: response.data,
            status: response.status,
            headers: AxiosParser.parseHeaders(response.headers),
            ...Object.fromEntries(Object.entries(response).filter(([ key ]) => String(key).startsWith("$"))),
        };

        return new MessageResponse(
            typeof response.config === "undefined"
                ? {}
                : this.requestParser.parseLibraryToMessage<RequestD>({
                    ...response.config,
                    endTime: Date.now(),
                    headers: AxiosParser.parseHeaders(response.config.headers) as unknown as RawAxiosResponseHeaders,
                }),
            responseParser,
        );
    }

}
