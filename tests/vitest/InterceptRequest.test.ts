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

    test("Teste Request Error", async () => {
        const requester = new AxiosMessage();

        requester.interceptors.request.use(undefined, (error) => {
            throw error;
        });

        await expect(requester.request<undefined, { headers: HttpHeadersInterface }>({
            url: "https://reqres.in/api/unknown/23",
        })).rejects.toHaveProperty("response.status", 404);
    });
});
