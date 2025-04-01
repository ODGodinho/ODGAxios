import { MessageResponse } from "@odg/message";

import { AxiosResponseParser } from "../../src/parser/AxiosResponseParser";

describe("Intercept Eject", () => {
    test("Teste statusText axios", async () => {
        expect(AxiosResponseParser.parseMessageToLibrary(
            new MessageResponse(
                {},
                {
                    data: "",
                    status: -1,
                    headers: {},
                },
            ),
        )).toMatchObject({
            statusText: "Unknown Status Code",
        });
    });
});
