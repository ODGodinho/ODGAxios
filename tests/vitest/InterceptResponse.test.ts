import { type HttpHeadersInterface } from "@odg/message";

import { AxiosMessage } from "../../src/AxiosMessage";

describe("Intercept Eject", () => {
    const endpoint = "https://api.github.com/";
    const requestHeaderIntercept = "data.biscoito";

    test("Teste intercept Response", async () => {
        const requester = new AxiosMessage<unknown, Record<string, string>>();
        const interceptHeader = "biscoito-intercept";

        requester.interceptors.response.use((config) => {
            config.data["biscoito"] = interceptHeader;

            return config;
        });

        await expect(requester.request<undefined, { headers: HttpHeadersInterface }>({
            url: endpoint,
        })).resolves.toHaveProperty(requestHeaderIntercept, interceptHeader);
    });

    test("Teste Eject intercept Response", async () => {
        const requester = new AxiosMessage<unknown, Record<string, string>>();
        const interceptHeader = "biscoito-intercept";

        const interceptor = requester.interceptors.response.use((config) => {
            config.data["biscoito"] = interceptHeader;

            return config;
        });

        requester.interceptors.response.eject(interceptor);

        await expect(requester.request<undefined, { headers: HttpHeadersInterface }>({
            url: "https://catfact.ninja/fact",
        })).resolves.not.toHaveProperty(requestHeaderIntercept, interceptHeader);
    });

    test("Teste Empty Intercept", async () => {
        const requester = new AxiosMessage();
        const interceptHeader = "intercept-eject";

        await expect(requester.request<undefined, { headers: HttpHeadersInterface }>({
            url: endpoint,
        })).resolves.not.toHaveProperty(requestHeaderIntercept, interceptHeader);
    });

    test("Response without intercept error", async () => {
        const requester = new AxiosMessage();

        requester.interceptors.response.use();

        await expect(requester.request<undefined, { headers: HttpHeadersInterface }>({
            url: "https://reqres.in/api/unknown/23",
        })).rejects.toHaveProperty("response.status", 404);
    });
});
