import { type HttpHeadersInterface } from "@odg/message";

import { AxiosMessage } from "../../src/AxiosMessage";

describe("Intercept Eject", () => {
    const endpoint = "https://httpbin.org/anything";
    test("Teste intercept Response", async () => {
        const requester = new AxiosMessage<unknown, Record<string, string>>();
        const interceptHeader = "biscoito-intercept";

        requester.interceptors.response.use((config) => {
            config.data["biscoito"] = interceptHeader;

            return config;
        });

        await expect(requester.request<undefined, { headers: HttpHeadersInterface }>({
            url: endpoint,
        })).resolves.toHaveProperty("data.biscoito", interceptHeader);
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
        })).resolves.not.toHaveProperty("data.biscoito", interceptHeader);
    });

    test("Teste Empty Intercept", async () => {
        const requester = new AxiosMessage();
        const interceptHeader = "intercept-eject";

        await expect(requester.request<undefined, { headers: HttpHeadersInterface }>({
            url: endpoint,
        })).resolves.not.toHaveProperty("data.headers.Teste", interceptHeader);
    });
});
