import { Exception } from "@odg/exception";
import { MessageException, type HttpHeadersInterface } from "@odg/message";
import axios, { type AxiosResponseHeaders } from "axios";

import { AxiosRequestParser } from "src/parser/AxiosRequestParser";
import { AxiosResponseParser } from "src/parser/AxiosResponseParser";

export class AxiosParser {

    /**
     * Request Exception parse MessageException
     *
     * @param {unknown} error Error Exception
     * @throws {MessageException} Convert Message Exception class
     * @returns {Exception}
     */
    public static parserRequestException(error: unknown): Exception {
        if (!error || error instanceof MessageException) return error;

        const requestParser = axios.isAxiosError(error) && error.config
            ? AxiosRequestParser.parseLibraryToMessage(error.config)
            : undefined;

        const responseParser = axios.isAxiosError(error) && "response" in error && error.response
            ? AxiosResponseParser.parseLibraryToMessage(error.response)
            : undefined;

        const exception = new MessageException(
            AxiosParser.getErrorMessage(error),
            undefined,
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

    /**
     * Add support axios 1.0 headers
     *
     * @param {unknown | undefined} headers Axios Headers Object
     * @returns {HttpHeadersInterface}
     */
    public static parseHeaders(headers?: unknown): HttpHeadersInterface {
        if (AxiosParser.isAxiosHeaders(headers) && typeof headers.toJSON === "function") {
            return (headers.toJSON as CallableFunction)(true) as HttpHeadersInterface;
        }

        return headers as HttpHeadersInterface;
    }

    /**
     * Check if headers is Axios Headers
     *
     * @param {unknown} headers Axios Headers
     * @returns {headers is AxiosResponseHeaders}
     */
    protected static isAxiosHeaders(headers: unknown): headers is AxiosResponseHeaders {
        return !!(
            headers
            && typeof headers === "object"
        );
    }

    /**
     * Get Error Message
     *
     * @param {unknown} error Unknown Error
     * @returns {string}
     */
    private static getErrorMessage(error: unknown): string {
        return error
            && typeof error === "object"
            && "message" in error
            ? String(error.message)
            : String(error);
    }

}
