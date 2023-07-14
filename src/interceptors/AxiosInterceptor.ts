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

}
