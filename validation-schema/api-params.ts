import z from "zod"

export const eventIdParamsSchema = z.coerce.number({ required_error : "event id is required", invalid_type_error : "invalid id"})
