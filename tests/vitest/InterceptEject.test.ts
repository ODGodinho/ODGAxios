import { type HttpHeadersInterface } from "@odg/message";

import { AxiosMessage } from "../../src/AxiosMessage";

describe("Intercept Eject", () => {
    test("Teste Eject intercept header", async () => {
        const requester = new AxiosMessage<unknown, Record<string, string>>();
        const interceptHeader = "intercept-eject";

        const interceptRequest = requester.interceptors.request.use((config) => {
            if (!config.headers) return config;
            config.headers["teste"] = interceptHeader;

            return config;
        }, undefined, {
            synchronous: true,
        });

        const interceptResponse = requester.interceptors.response.use((config) => {
            config.response.data["biscoito"] = interceptHeader;

            return config;
        });

        requester.interceptors.request.eject(interceptRequest);
        requester.interceptors.response.eject(interceptResponse);

        const request = requester.request<undefined, { headers: HttpHeadersInterface }>({
            url: "https://1.1.1.1/",
        });

        await Promise.all([
            expect(request).resolves.not.toHaveProperty("data.headers.Teste", interceptHeader),
            expect(request).resolves.not.toHaveProperty("data.biscoito", interceptHeader),
        ]);
    });

    test("Teste Clear intercept header", async () => {
        const requester = new AxiosMessage<unknown, Record<string, string>>();
        const interceptHeader = "intercept-eject";

        requester.interceptors.request.use((config) => {
            if (!config.headers) return config;
            config.headers["teste"] = interceptHeader;

            return config;
        });

        requester.interceptors.response.use((config) => {
            config.response.data["biscoito"] = interceptHeader;

            return config;
        }, undefined, {
            synchronous: true,
        });

        requester.interceptors.request.clear();
        requester.interceptors.response.clear();

        const request = requester.request<undefined, { headers: HttpHeadersInterface }>({
            url: "https://1.1.1.1/",
        });

        await Promise.all([
            expect(request).resolves.not.toHaveProperty("data.headers.Teste", interceptHeader),
            expect(request).resolves.not.toHaveProperty("data.biscoito", interceptHeader),
        ]);
    });
});
