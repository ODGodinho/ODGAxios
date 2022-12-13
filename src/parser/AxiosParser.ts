import { type HttpHeadersInterface } from "@odg/message";
import { type AxiosResponseHeaders } from "axios";

export class AxiosParser {

    /**
     * Add support axios 1.0 headers
     *
     * @param {unknown} headers Axios Headers Object
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

}
