import z from "zod"

export const passbookNumberSchema = z
    .string({
        invalid_type_error: "invalid passbook number",
        required_error: "passbook number is required",
    })
    .min(1, "passbook number must not be empty");
