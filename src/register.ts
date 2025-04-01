import { Exception } from "@odg/exception";
import { MessageException } from "@odg/message";
import axios from "axios";

import { AxiosRequestParser } from "./parser/AxiosRequestParser";
import { AxiosResponseParser } from "./parser/AxiosResponseParser";

Exception.$parsers.add((exception, original) => {
    if (axios.isAxiosError(original)) {
        const response = original.response
            ? AxiosResponseParser.parseLibraryToMessage(original.response)
            : undefined;
        const config = original.config
            ? AxiosRequestParser.parseLibraryToMessage({
                ...original.config,
                endTime: Date.now(),
            })
            : undefined;

        if (response && Object.keys({ ...response.request }).length === 0) {
            response.request = config!;
        }

        const newException = new MessageException(
            exception.message,
            exception.preview,
            original.code,
            response?.request ?? config,
            response?.response,
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
