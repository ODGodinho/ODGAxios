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
        private readonly interceptor: AxiosInterceptorManager<AxiosResponse>,
    ) {
    }

    public use<RequestD = RequestData, ResponseD = ResponseData>(
        onFulfilled?: onFulfilledTypo<ResponseInterface<RequestD, ResponseD>>,
        onRejected?: onRejectedTypo,
        options?: MessageInterceptorOptions,
    ): number {
        return this.interceptor.use(
            onFulfilled && (
                async (
                    config: AxiosResponse<ResponseD, RequestD>,
                ): Promise<AxiosResponse<ResponseD, RequestD>> => ({
                    ...config,
                    ...await AxiosResponseParser.parseMessageToLibrary(
                        await onFulfilled(await AxiosResponseParser.parseLibraryToMessage(config)),
                    ),
                })
            ),
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
