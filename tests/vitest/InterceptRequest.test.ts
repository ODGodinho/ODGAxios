import { type HttpHeadersInterface } from "@odg/message";

import { AxiosMessage } from "../../src/AxiosMessage";

describe("AxiosMessage", () => {
    test("Teste Request Intercept", async () => {
        const requester = new AxiosMessage();
        const interceptHeader = "intercept-test";

        requester.interceptors.request.use((config) => {
            if (!config.headers) return config;
            config.headers["teste"] = interceptHeader;

            return config;
        });

        await expect(requester.request<undefined, { headers: HttpHeadersInterface }>({
            url: "https://1.1.1.1/",
        })).resolves.toHaveProperty("request.headers.teste", interceptHeader);
    });
});
