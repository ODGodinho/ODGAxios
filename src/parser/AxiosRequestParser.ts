import { type ParametersInterface, type RequestInterface } from "@odg/message";
import { type AxiosRequestConfig } from "axios";

import { AxiosParser } from "./AxiosParser";

export class AxiosRequestParser {

    /**
     * Parse MessageInterface to Axios
     *
     * @template {any} RequestD Dados Request Axios
     * @param {RequestInterface<RequestD>} config Dados Request
     * @returns {AxiosRequestConfig<RequestD>}
     */
    public static parseMessageToLibrary<RequestD>(
        config: RequestInterface<RequestD>,
    ): AxiosRequestConfig<RequestD> {
        return Object.fromEntries(Object.entries({
            url: config.url,
            baseURL: config.baseURL,
            method: config.method,
            headers: config.headers,
            params: config.params,
            data: config.data,
            timeout: config.timeout,
            responseType: config.responseType,
            maxContentLength: config.maxContentLength,
            validateStatus: config.validateStatus,
            maxBodyLength: config.maxBodyLength,
            maxRedirects: config.maxRedirects,
            socketPath: config.socketPath,
            proxy: config.proxy,
        }).filter(([ , value ]) => value !== undefined));
    }

    /**
     * Parse Request Axios configuration
     *
     * @template {any} RequestD Dados Request Axios
     * @param {AxiosRequestConfig<RequestD>} config Dados Request
     * @returns {RequestInterface<RequestD>}
     */
    public static parseLibraryToMessage<RequestD>(
        config: AxiosRequestConfig<RequestD>,
    ): RequestInterface<RequestD> {
        return Object.fromEntries(Object.entries({
            url: config.url,
            baseURL: config.baseURL,
            method: config.method,
            headers: AxiosParser.parseHeaders(config.headers),
            params: config.params as ParametersInterface,
            data: config.data,
            timeout: config.timeout,
            responseType: config.responseType,
            maxContentLength: config.maxContentLength,
            validateStatus: config.validateStatus,
            maxBodyLength: config.maxBodyLength,
            maxRedirects: config.maxRedirects,
            socketPath: config.socketPath,
            proxy: config.proxy,
        }).filter(([ , value ]) => value !== undefined));
    }

}
