import {
    type MessageInterceptorOptions,
    type onFulfilledType,
    type InterceptorManager,
    type onRejectedType,
    MessageUnknownException,
    MessageException,
} from "@odg/message";
import { type AxiosInterceptorManager } from "axios";

export abstract class AxiosInterceptor<AxiosInterceptor> implements InterceptorManager<unknown> {

    public constructor(
        protected readonly interceptor: AxiosInterceptorManager<AxiosInterceptor>,
    ) {
    }

    public eject(id: number): void {
        this.interceptor.eject(id);
    }

    public clear(): void {
        this.interceptor.clear();
    }

    protected onRejected(onRejected?: onRejectedType) {
        return async (error: unknown): Promise<never> => {
            const parserError = MessageException.parse(error)
                ?? new MessageUnknownException("Axios Message empty error", error);
            if (!onRejected) {
                throw parserError;
            }

            return onRejected(
                parserError,
            );
        };
    }

    public abstract use(
        onFulfilled?: onFulfilledType<unknown>,
        onRejected?: onRejectedType,
        options?: MessageInterceptorOptions
    ): number;

}
