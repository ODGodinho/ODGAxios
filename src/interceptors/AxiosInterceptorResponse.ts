import {
    type MessageInterceptorOptions,
    type onFulfilledTypo,
    type onRejectedTypo,
    type InterceptorManager,
    type ResponseInterface,
} from "@odg/message";
import { type AxiosInterceptorManager, type AxiosResponse } from "axios";

import { AxiosResponseParser } from "../parser/AxiosResponseParser";

export class AxiosInterceptorResponse<RequestData, ResponseData> implements
    InterceptorManager<ResponseInterface<RequestData, ResponseData>> {

    public constructor(
        private readonly interceptor: AxiosInterceptorManager<AxiosResponse<ResponseData, RequestData>>,
    ) {
    }

    public use(
        onFulfilled?: onFulfilledTypo<ResponseInterface<RequestData, ResponseData>>,
        onRejected?: onRejectedTypo,
        options?: MessageInterceptorOptions,
    ): number {
        return this.interceptor.use(
            onFulfilled && (async (
                config: AxiosResponse<ResponseData, RequestData>,
            ): Promise<AxiosResponse<ResponseData, RequestData>> => ({
                ...config,
                ...await AxiosResponseParser.parseMessageToLibrary(
                    await onFulfilled(await AxiosResponseParser.parseLibraryToMessage(config)),
                ),
            })),
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
