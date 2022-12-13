import { MessageException, type HttpHeadersInterface } from "@odg/message";

import { AxiosMessage } from "../../src/AxiosMessage";
import { AxiosResponseParser } from "../../src/parser/AxiosResponseParser";

describe("AxiosMessage", () => {
    const testHeader = "data.headers.Teste";

    test("Teste Request Success Headers", async () => {
        const requester = new AxiosMessage();

        const request = requester.request<undefined, { headers: HttpHeadersInterface }>({
            url: "https://httpbin.org/anything",
            headers: {
                "teste": "test-header",
            },
        });

        await expect(request).resolves.toHaveProperty(testHeader, "test-header");
        await expect(AxiosResponseParser.parseMessageToLibrary(await request))
            .resolves.toHaveProperty("statusText", "OK");
    });

    test("Teste Request Intercept", async () => {
        const requester = new AxiosMessage();
        const interceptHeader = "intercept-test";

        requester.interceptors.request.use((config) => {
            if (!config.headers) return config;
            config.headers["teste"] = interceptHeader;

            return config;
        });

        await expect(requester.request<undefined, { headers: HttpHeadersInterface }>({
            url: "https://httpbin.org/anything",
        })).resolves.toHaveProperty(testHeader, interceptHeader);
    });

    test("Teste Timeout Exception", async () => {
        const requester = new AxiosMessage();
        const request = requester.request<undefined, { headers: HttpHeadersInterface }>({
            url: "https://invalid.inv/anything",
            timeout: 1,
        });

        await expect(request).rejects.toBeInstanceOf(MessageException);
        await expect(request).rejects.toHaveProperty("message", "timeout of 1ms exceeded");
    });

    test("Teste intercept error new message", async () => {
        const interceptNewMessage = "new message";
        const requester = new AxiosMessage({
            baseURL: "https://httpbin.org",
        });

        requester.interceptors.response.use(undefined, (error) => {
            error.message = interceptNewMessage;

            throw error;
        }, {
            synchronous: true,
        });

        const request = requester.request<undefined, { headers: HttpHeadersInterface }>({
            url: "https://invalid.invalid/anything",
            timeout: 1,
        });

        await expect(request).rejects.toHaveProperty("message", interceptNewMessage);
    });

    test("Teste intercept error request", async () => {
        const requester = new AxiosMessage({});

        requester.interceptors.request.use(undefined, (error) => {
            throw error;
        });

        const request = requester.request<undefined, { headers: HttpHeadersInterface }>({
            url: "",
            timeout: 1,
        });

        await expect(request).rejects.toHaveProperty("message", "TypeError [ERR_INVALID_URL]: Invalid URL");
    });

    test("Teste invalid endpoint", async () => {
        const requester = new AxiosMessage();

        requester.interceptors.request.use(undefined, (error) => {
            throw error;
        });

        const request = requester.request<undefined, { headers: HttpHeadersInterface }>({
            url: "https://api.github.com/users/ODGodinho/as",
        });

        await expect(request).rejects.toHaveProperty("response.data.message", "Not Found");
    });

    test("Teste empty exception", async () => {
        const requester = new AxiosMessage();

        await expect(requester["requestException"](null))
            .resolves.toEqual(null);
    });
});
