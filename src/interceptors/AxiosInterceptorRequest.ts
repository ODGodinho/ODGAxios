import {
    type MessageInterceptorOptions,
    type onFulfilledType,
    type onRejectedType,
    type InterceptorManager,
    type RequestInterface,
} from "@odg/message";
import { type AxiosRequestConfig } from "axios";

import { AxiosRequestParser } from "../parser/AxiosRequestParser";

import { AxiosInterceptor } from "./AxiosInterceptor";

export class AxiosInterceptorRequest<
    RequestData,
> extends AxiosInterceptor<
        AxiosRequestConfig<RequestData>
    > implements InterceptorManager<RequestInterface<RequestData>> {

    public use(
        onFulfilled?: onFulfilledType<RequestInterface<RequestData>>,
        onRejected?: onRejectedType,
        options?: MessageInterceptorOptions,
    ): number {
        return this.interceptor.use(
            async (config: AxiosRequestConfig<RequestData>) => {
                if (!onFulfilled) return config;

                return {
                    ...config,
                    ...AxiosRequestParser.parseMessageToLibrary(
                        await onFulfilled(AxiosRequestParser.parseLibraryToMessage(config)),
                    ),
                };
            },
            this.onRejected(onRejected),
            {
                synchronous: options?.synchronous,
            },
        );
    }

}
