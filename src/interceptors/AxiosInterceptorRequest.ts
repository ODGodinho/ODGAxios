/* eslint-disable arrow-body-style */
import {
    type MessageInterceptorOptions,
    type onFulfilledTypo,
    type onRejectedTypo,
    type InterceptorManager,
    type RequestInterface,
} from "@odg/message";
import { type AxiosRequestConfig, type AxiosInterceptorManager } from "axios";

import { AxiosRequestParser } from "../parser/AxiosRequestParser";

export class AxiosInterceptorRequest<RequestData> implements InterceptorManager<RequestInterface<RequestData>> {

    public constructor(
        private readonly interceptor: AxiosInterceptorManager<AxiosRequestConfig<RequestData>>,
    ) {
    }

    public use(
        onFulfilled?: onFulfilledTypo<RequestInterface<RequestData>>,
        onRejected?: onRejectedTypo,
        options?: MessageInterceptorOptions,
    ): number {
        return this.interceptor.use(
            async (config: AxiosRequestConfig<RequestData>) => {
                if (!onFulfilled) return config;

                return {
                    ...config,
                    ...AxiosRequestParser.parseMessageToLibrary(
                        await onFulfilled(await AxiosRequestParser.parseLibraryToMessage(config)),
                    ),
                };
            },
            onRejected,
            {
                synchronous: options?.synchronous,
            },
        );
    }

    public eject(id: number): void {
        this.interceptor.eject(id);
    }

    public clear(): void {
        if ("clear" in this.interceptor) {
            (this.interceptor.clear as CallableFunction)();
        }
    }

}
