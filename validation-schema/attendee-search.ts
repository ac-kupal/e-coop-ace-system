import z from "zod"

export const eventIdParamSchema = z.coerce.number({ invalid_type_error : "invalid event id", required_error : "event id is required"})

export const validateBirthDay = z.coerce.date({ invalid_type_error : "invalid birthday", required_error : "birthday is required for verification"})

export const attendeeParamsSchema = z.object({
    id : eventIdParamSchema,
    passbookNumber : z.string({ invalid_type_error : "invalid passbook number", required_error : "passbook number is required"}).min(1, "passbook number must not be empty"),
})

export const attendeeRegisterParamsSchema = z.object({
    passbookNumber : z.string({ invalid_type_error : "invalid passbook number", required_error : "passbook number is required"}).min(1, "passbook number must not be empty"),
    birthday : validateBirthDay
})