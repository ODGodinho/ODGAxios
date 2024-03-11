import { MessageException, type HttpHeadersInterface } from "@odg/message";

import { AxiosMessage } from "../../src/AxiosMessage";
import { AxiosResponseParser } from "../../src/parser/AxiosResponseParser";

describe("AxiosMessage", () => {
    const headerName = "teste";
    const testHeader = `request.headers.${headerName}`;
    const httpBinEndpoint = "https://1.1.1.1/";

    test("Teste Request Success Headers", async () => {
        const requester = new AxiosMessage();

        const response = requester.request<undefined, { headers: HttpHeadersInterface }>({
            url: httpBinEndpoint,
            headers: {
                [headerName]: "test-header",
            },
        });

        await expect(response).resolves.toHaveProperty(testHeader, "test-header");
        expect(AxiosResponseParser.parseMessageToLibrary(await response))
            .toHaveProperty("statusText", "OK");
    });

    test("Teste Request Intercept", async () => {
        const requester = new AxiosMessage();
        const interceptHeader = "intercept-test";

        requester.interceptors.request.use((config) => {
            if (!config.headers) return config;
            config.headers["teste"] = interceptHeader;

            return config;
        });

        const response = requester.request<undefined, { headers: HttpHeadersInterface }>({
            url: httpBinEndpoint,
        });

        await expect(response).resolves.toHaveProperty(testHeader, interceptHeader);
    });

    test("Teste Timeout Exception", async () => {
        const requester = new AxiosMessage();

        const response = requester.request<undefined, { headers: HttpHeadersInterface }>({
            url: "https://anything.org/anything",
            timeout: 1,
        });

        await Promise.all([
            expect(response).rejects.toBeInstanceOf(MessageException),
            expect(response).rejects.toHaveProperty("message", "timeout of 1ms exceeded"),
        ]);
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
            url: httpBinEndpoint,
            timeout: 1,
        });

        await expect(request).rejects.toHaveProperty("message", interceptNewMessage);
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
});
