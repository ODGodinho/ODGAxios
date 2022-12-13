import axios from "axios";

import { AxiosMessage } from "../../src/AxiosMessage";

describe("AxiosMessage", () => {
    test("Test is Axios Error", async () => {
        const requester = new AxiosMessage();

        const axiosError = (async (): Promise<Error> => requester["requestException"](
            await requester.request({
                url: "https://invalid.invalid/invalid",
            }).catch((error: unknown) => error),
        ))();

        await expect(axiosError).resolves.toHaveProperty("isAxiosError", true);
        expect(axios.isAxiosError(await axiosError)).toBeTruthy();
    });
});
