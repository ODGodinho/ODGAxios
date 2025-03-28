import { type ParametersInterface, type RequestInterface } from "@odg/message";

import { type AxiosRequestConfigExtra } from "../interfaces/AxiosInterfaceExtra";

import { AxiosParser } from "./AxiosParser";

export class AxiosRequestParser {

    /**
     * Parse MessageInterface to Axios
     *
     * @template {any} RequestD Dados Request Axios
     * @template {Record<string, unknown>} ExtraData Dados Request Axios extras
     * @param {Partial<RequestInterface<RequestD, ExtraData>>} options Dados Request
     * @returns {AxiosRequestConfigExtra<RequestD>}
     */
    public static parseMessageToLibrary<RequestD, ExtraData extends Record<string, unknown> = Record<string, unknown>>(
        options: Partial<RequestInterface<RequestD, ExtraData>>,
    ): AxiosRequestConfigExtra<RequestD> {
        return Object.fromEntries(Object.entries({
            url: options.url,
            baseURL: options.baseURL,
            method: options.method,
            headers: options.headers,
            params: options.params,
            data: options.data,
            timeout: options.timeout,
            responseType: options.responseType,
            maxContentLength: options.maxContentLength,
            validateStatus: options.validateStatus,
            maxBodyLength: options.maxBodyLength,
            maxRedirects: options.maxRedirects,
            socketPath: options.socketPath,
            proxy: options.proxy,
            signal: options.signal,
            startTime: options.startTime ?? Date.now(),
            endTime: options.endTime,
            timestamps: options.endTime && options.startTime ? options.endTime - options.startTime : undefined,
            extras: options.extras,
            ...Object.fromEntries(Object.entries(options).filter(([ key ]) => String(key).startsWith("$"))),
        } as AxiosRequestConfigExtra<RequestD>).filter(([ , value ]) => value !== undefined));
    }

    /**
     * Parse Request Axios configuration
     *
     * @template {any} RequestD Dados Request Axios
     * @param {AxiosRequestConfigExtra<RequestD>} options Dados Request
     * @returns {RequestInterface<RequestD>}
     */
    public static parseLibraryToMessage<RequestD>(
        options: AxiosRequestConfigExtra<RequestD>,
    ): RequestInterface<RequestD> {
        return Object.fromEntries(
            Object.entries({
                url: options.url,
                baseURL: options.baseURL,
                method: options.method,
                headers: AxiosParser.parseHeaders(options.headers),
                params: options.params as ParametersInterface,
                data: options.data,
                timeout: options.timeout,
                responseType: options.responseType,
                maxContentLength: options.maxContentLength,
                validateStatus: options.validateStatus,
                maxBodyLength: options.maxBodyLength,
                maxRedirects: options.maxRedirects,
                socketPath: options.socketPath,
                proxy: options.proxy,
                signal: options.signal,
                startTime: options.startTime ?? Date.now(),
                endTime: options.endTime,
                timestamps: options.endTime && options.startTime ? options.endTime - options.startTime : undefined,
                extras: options.extras,
                ...Object.fromEntries(Object.entries(options).filter(([ key ]) => String(key).startsWith("$"))),
            } as RequestInterface<RequestD>).filter(([ , value ]) => value !== undefined),
        ) as RequestInterface<RequestD>;
    }

}
