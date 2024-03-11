import { Exception } from "@odg/exception";
import { MessageException } from "@odg/message";
import axios from "axios";

import { AxiosRequestParser } from "./parser/AxiosRequestParser";
import { AxiosResponseParser } from "./parser/AxiosResponseParser";

Exception.$parsers.add((exception, original) => {
    if (axios.isAxiosError(original)) {
        const newException = new MessageException(
            exception.message,
            exception.preview,
            original.code,
            original.config ? AxiosRequestParser.parseLibraryToMessage(original.config) : undefined,
            original.response ? AxiosResponseParser.parseLibraryToMessage(original.response) : undefined,
        );
        newException.stack = original.stack;

        Object.defineProperty(newException, "isAxiosError", {
            configurable: true,
            enumerable: false,
            value: true,
            writable: true,
        });

        return newException;
    }

    return exception;
});
