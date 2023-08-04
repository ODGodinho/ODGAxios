import {
    type MessageInterceptorOptions,
    type onFulfilledType,
    type onRejectedType,
    type InterceptorManager,
    type ResponseInterface,
} from "@odg/message";
import { type AxiosResponse } from "axios";

import { AxiosResponseParser } from "../parser/AxiosResponseParser";

import { AxiosInterceptor } from "./AxiosInterceptor";

export type onFulfilledFunctionType<RequestData, ResponseData> = (
    response: AxiosResponse<ResponseData, RequestData>
) => Promise<AxiosResponse<ResponseData, RequestData>>;

export class AxiosInterceptorResponse<
    RequestData,
    ResponseData,
> extends AxiosInterceptor<
    AxiosResponse
> implements InterceptorManager<ResponseInterface<RequestData, ResponseData>> {

    public use<RequestD = RequestData, ResponseD = ResponseData>(
        onFulfilled?: onFulfilledType<ResponseInterface<RequestD, ResponseD>>,
        onRejected?: onRejectedType,
        options?: MessageInterceptorOptions,
    ): number {
        const response = onFulfilled && this.onFulfilledResponse<RequestD, ResponseD>(onFulfilled);

        return this.interceptor.use(
            response,
            this.onRejected(onRejected),
            {
                synchronous: options?.synchronous,
            },
        );
    }

    private onFulfilledResponse<RequestD = RequestData, ResponseD = ResponseData>(
        onFulfilled: onFulfilledType<ResponseInterface<RequestD, ResponseD>>,
    ): onFulfilledFunctionType<RequestD, ResponseD> {
        return async (response: AxiosResponse<ResponseD, RequestD>): Promise<AxiosResponse<ResponseD, RequestD>> => {
            const responseMessage = await AxiosResponseParser.parseLibraryToMessage(response);
            const messageResponse = await AxiosResponseParser.parseMessageToLibrary(
                await onFulfilled(responseMessage),
            );

            return {
                ...response,
                ...messageResponse,
            };
        };
    }

}
