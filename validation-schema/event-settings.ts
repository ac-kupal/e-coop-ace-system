import z from "zod";
import { MemberSearchMode } from "@prisma/client";

export const eventRegistrationSettingsSchema = z.object({
    registrationOnEvent: z.boolean({
        invalid_type_error: "invalid registration settings",
        required_error: "registration setting is required",
    }),
});

export const memberSearchOptionEnums = z.nativeEnum(MemberSearchMode);

export const eventSettingsSchema = z.object({
    registrationOnEvent: z
        .boolean({
            invalid_type_error: "registration on event settings is invalid",
        })
        .optional(),
    defaultMemberSearchMode: memberSearchOptionEnums.optional(),
});
