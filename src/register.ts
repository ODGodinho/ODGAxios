import { Exception } from "@odg/exception";
import axios from "axios";

Exception.$parsers.add((exception, original) => {
    if ("isAxiosError" in exception || axios.isAxiosError(original)) {
        Object.defineProperty(exception, "isAxiosError", {
            configurable: true,
            enumerable: false,
            value: axios.isAxiosError(original),
            writable: true,
        });
    }

    return exception;
});
