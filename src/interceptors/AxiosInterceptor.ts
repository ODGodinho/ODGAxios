import { type onRejectedType, MessageUnknownException } from "@odg/message";
import { type AxiosInterceptorManager } from "axios";

export abstract class AxiosInterceptor<AxiosInterceptor> {

    public constructor(
        protected readonly interceptor: AxiosInterceptorManager<AxiosInterceptor>,
    ) {
    }

    public eject(id: number): void {
        this.interceptor.eject(id);
    }

    public clear(): void {
        if ("clear" in this.interceptor) {
            (this.interceptor.clear as CallableFunction)();
        }
    }

    protected onRejected(onRejected?: onRejectedType) {
        return async (error: unknown): Promise<never> => {
            if (!onRejected) throw error;

            return onRejected(MessageUnknownException.parseOrDefault(error, "Axios Message empty error"));
        };
    }

}
