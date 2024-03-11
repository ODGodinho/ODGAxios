import { AxiosResponseParser } from "../../src/parser/AxiosResponseParser";

describe("Intercept Eject", () => {
    test("Teste statusText axios", async () => {
        expect(AxiosResponseParser.parseMessageToLibrary({
            data: "",
            status: -1,
            headers: {},
            request: {},
        })).toMatchObject({
            statusText: "Unknown Status Code",
        });
    });
});
