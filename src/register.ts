import { Exception } from "@odg/exception";
import axios from "axios";
import { AxiosParser } from "src/parser/AxiosParser";

Exception.$parsers.add((exception, original) => {
    if ("isAxiosError" in exception || axios.isAxiosError(original)) {
        const newException = AxiosParser.parserRequestException(exception);
        Object.defineProperty(exception, "isAxiosError", {
            configurable: true,
            enumerable: false,
            value: true,
            writable: true,
        });
        return newException;
    }

    return exception;
});
