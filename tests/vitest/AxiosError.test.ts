import { Exception } from "@odg/exception";
import { MessageException } from "@odg/message";
import axios, { AxiosError } from "axios";

import { AxiosMessage } from "../../src/AxiosMessage";
import * as Interfaces from "../../src/interfaces";

describe("AxiosMessage", () => {
    test("Test is Axios Error", async () => {
        const requester = new AxiosMessage();

        const axiosError = (async (): Promise<Error | undefined> => Exception.parse(
            await requester.request({
                url: "https://invalid.invalid/invalid",
                timeout: 3000,
            }).catch((error: unknown) => error),
        ))();

        await expect(axiosError).resolves.toHaveProperty("isAxiosError", true);
        expect(axios.isAxiosError(await axiosError)).toBeTruthy();
        expect(await axiosError).toBeInstanceOf(MessageException);
    });

    test("Teste Parser Error Class", async () => {
        expect(Exception.parse(new Error("error"))).toHaveProperty("message", "error");

        const axiosError = new AxiosError("zeze");
        expect(Exception.parse(axiosError)).toBeInstanceOf(MessageException);
    });

    test("interfaces file", () => {
        expect(Interfaces).toBeTypeOf("object");
    });
});
