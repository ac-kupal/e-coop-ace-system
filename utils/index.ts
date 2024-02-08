import axios from "axios";
import { ApiErr } from "@/types";

const isApiErr = (data: any): data is ApiErr => {
    return data && typeof data.message === "string";
};

export const handleAxiosErrorMessage = (error: unknown) => {
    if (!axios.isAxiosError(error)) {
        return "Unknown error";
    }

    if (!error.response) {
        return error.message;
    }

    if (!isApiErr(error.response.data)) {
        return error.message;
    }

    return error.response.data.message;
};
