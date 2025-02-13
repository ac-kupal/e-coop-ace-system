import z from "zod";
import { otpSchema, eventIdSchema, validateBirthDay, electionIdParamSchema, passbookNumberSchema, validateBirthdayString } from "./commons"

// for event registration verification api
export const nameSearchSchema = z.string({ required_error : "name is required", invalid_type_error : "invalid name search type"})

export const attendeeParamsSchema = z.object({
    id: eventIdSchema,
    passbookNumber: passbookNumberSchema,
});

export const attendeeNameParamsSchema = z.object({
    id: eventIdSchema,
    nameSearch: nameSearchSchema,
});

// for event registration verification api
export const attendeeRegisterSchema = z.object({
    passbookNumber: passbookNumberSchema,
    birthday: validateBirthDay.optional(),
});

// for event registration for form schema
export const attendeeRegisterFormSchema = z.object({
    passbookNumber: passbookNumberSchema,
    birthday: z.string().refine((value) => {
        return /^(0[1-9]|1[0-2])(\/|-)(0[1-9]|1\d|2\d|3[01])(\/|-)(\d{4})$/.test(
            value
        );
    }, "Invalid date format").optional(),
});

export const memberAttendeeSearchSchema = z.object({
    passbookNumber : z.string({invalid_type_error: "invalid passbook number",required_error: "passbook number is required"}),
    nameSearch : nameSearchSchema
})

// for params
export const eventElectionParamsSchema = z.object({
    id: eventIdSchema,
    electionId: electionIdParamSchema,
});

// for voter passbook search
export const passbookSearchSchema = z.object({
    passbookNumber: passbookNumberSchema,
});

// for voter search params
export const voterSearchParamSchema = z.object({
    passbookNumber: passbookNumberSchema,
});

export const voterVerificationSchema = z.object({
    passbookNumber: passbookNumberSchema,
    otp: otpSchema,
    birthday: validateBirthDay.optional(),
});

export const voterVerificationFormSchema = z.object({
    passbookNumber: passbookNumberSchema,
    otp: otpSchema,
    birthday : validateBirthdayString.optional()
})

// for voter registration
export const voterRegistrationVerification = z.object({});
