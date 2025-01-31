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
});
