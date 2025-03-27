import {
    type MessageInterceptorOptions,
    type onFulfilledType,
    type onRejectedType,
    type InterceptorManager,
    type RequestInterface,
} from "@odg/message";
import { type AxiosInterceptorManager, type AxiosRequestConfig } from "axios";

import { type AxiosRequestConfigExtra } from "../interfaces";
import { AxiosRequestParser } from "../parser/AxiosRequestParser";

import { AxiosInterceptor } from "./AxiosInterceptor";

export class AxiosInterceptorRequest<
    RequestData,
> extends AxiosInterceptor<
        AxiosRequestConfigExtra<RequestData>
    > implements InterceptorManager<RequestInterface<RequestData>> {

    protected readonly parser = AxiosRequestParser;

    public use<RequestD = RequestData>(
        onFulfilled?: onFulfilledType<RequestInterface<RequestD>>,
        onRejected?: onRejectedType,
        options?: MessageInterceptorOptions,
    ): number {
        const requestIntercept = onFulfilled && this.onFulfilledRequest<RequestD>(onFulfilled);

        return this.interceptor.use(
            requestIntercept,
            this.onRejected(onRejected),
            {
                synchronous: options?.synchronous,
            },
        );
    }

    private onFulfilledRequest<RequestD = RequestData>(
        onFulfilled: onFulfilledType<RequestInterface<RequestD>>,
    ): Parameters<AxiosInterceptorManager<AxiosRequestConfig>["use"]>["0"] {
        return async (config: AxiosRequestConfigExtra<RequestD>): Promise<AxiosRequestConfigExtra<RequestD>> => ({
            ...config,
            ...this.parser.parseMessageToLibrary(
                await onFulfilled(this.parser.parseLibraryToMessage(config)),
            ),
        });
    }

}
