import z from "zod";

export const eventRegistrationSettingsSchema = z.object({
    registrationOnEvent : z.boolean({ invalid_type_error : "invalid registration settings", required_error : "registration setting is required"})
})
