import {
    type MessageInterceptorOptions,
    type onFulfilledType,
    type onRejectedType,
    type InterceptorManager,
    type ResponseInterface,
} from "@odg/message";
import { type AxiosInterceptorManager, type AxiosResponse } from "axios";

import { AxiosResponseParser } from "../parser/AxiosResponseParser";

import { AxiosInterceptor } from "./AxiosInterceptor";

export class AxiosInterceptorResponse<
    RequestData,
    ResponseData,
> extends AxiosInterceptor<
        AxiosResponse
    > implements InterceptorManager<ResponseInterface<RequestData, ResponseData>> {

    protected readonly parser = AxiosResponseParser;

    public use<RequestD = RequestData, ResponseD = ResponseData>(
        onFulfilled?: onFulfilledType<ResponseInterface<RequestD, ResponseD>>,
        onRejected?: onRejectedType,
        _options?: MessageInterceptorOptions,
    ): number {
        const responseIntercept = onFulfilled && this.onFulfilledResponse<RequestD, ResponseD>(onFulfilled);

        return this.interceptor.use(
            responseIntercept,
            this.onRejected(onRejected),
        );
    }

    private onFulfilledResponse<RequestD = RequestData, ResponseD = ResponseData>(
        onFulfilled: onFulfilledType<ResponseInterface<RequestD, ResponseD>>,
    ): Parameters<AxiosInterceptorManager<AxiosResponse<ResponseD, RequestD>>["use"]>["0"] {
        return async (response: AxiosResponse<ResponseD, RequestD>): Promise<AxiosResponse<ResponseD, RequestD>> => ({
            ...response,
            ...this.parser.parseMessageToLibrary(
                await onFulfilled(this.parser.parseLibraryToMessage(response)),
            ),
        });
    }

}
