import { MessageException } from "@odg/message";

import { AxiosMessage } from "../../src";

describe("Axios Default Params test", () => {
    test("Test Create default", async () => {
        const requester = new AxiosMessage();
        const baseURL = "https://test.test";

        expect(requester.getDefaultOptions().baseURL).toBeUndefined();
        requester.setDefaultOptions({
            baseURL: baseURL,
        });
        expect(requester.getDefaultOptions().baseURL).toEqual(baseURL);
    });

    test("Test Base URL change", async () => {
        const requester = new AxiosMessage();
        const baseURL = "https://1.1.1.1/";

        requester.setDefaultOptions({
            baseURL: baseURL,
        });

        await expect(requester.request({})).resolves.toMatchObject({
            request: {
                baseURL: baseURL,
            },
        });
    });

    test("Test request Time", async () => {
        const requester = new AxiosMessage();
        const baseURL = "https://httpbin.org/delay/2";

        requester.setDefaultOptions({
            baseURL: baseURL,
            timeout: 1000,
        });

        const myRequest = requester.request({});
        await expect(myRequest).rejects.toThrow(MessageException);

        const requestAwait = await myRequest.catch((error: MessageException<unknown>) => error);
        expect(requestAwait.request?.timestamps).toBeGreaterThan(requester.getDefaultOptions().timeout! * 0.95);
    });
});
