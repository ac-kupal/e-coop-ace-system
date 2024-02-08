import z from "zod";

const createRootUserSchema = z.object({
    name: z
        .string({
            required_error: "name is required",
            invalid_type_error: "invalid name",
        })
        .min(1, "name is required"),
    email: z
        .string({
            required_error: "email is required",
            invalid_type_error: "invalid email",
        })
        .min(1, "email is required")
        .email("please provide a valid email"),
    password: z
        .string({
            required_error: "password is required",
            invalid_type_error: "invalid password",
        })
        .min(8, "minimum password is 8 character")
        .max(15, "maximum password size is 15 character"),
});
