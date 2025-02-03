import { MessageUnknownException } from "@odg/message";
import axios from "axios";

import { AxiosInterceptorResponse } from "../../src/interceptors/AxiosInterceptorResponse";

describe("AxiosInterceptorResponse", () => {
    test("Teste intercept", async () => {
        const intercept = new AxiosInterceptorResponse(axios.create().interceptors.response);

        await expect(intercept["onRejected"](void 0)(void 0)).rejects.toThrowError(MessageUnknownException);
    });
});
