import { type RequestInterface } from "@odg/message";
import { type AxiosRequestConfig } from "axios";

export interface AxiosRequestConfigExtra<RequestData> extends AxiosRequestConfig<RequestData> {
    startTime?: number;
    endTime?: number;
    timestamps?: number;
    extras?: RequestInterface<unknown>["extras"];
}
