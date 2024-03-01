import z from "zod";

export const eventIdParamSchema = z.coerce.number({
    invalid_type_error: "invalid event id",
    required_error: "event id is required",
});

export const electionIdParamSchema = z.coerce.number({
    invalid_type_error: "invalid event electionId",
    required_error: "electionId is required",
});

export const validateBirthDay = z.coerce.date({
    invalid_type_error: "invalid birthday",
    required_error: "birthday is required for verification",
});

export const validateBirthdayString = z.string().refine((value) => {
    return /^(0[1-9]|1[0-2])(\/|-)(0[1-9]|1\d|2\d|3[01])(\/|-)(\d{4})$/.test(
        value
    );
}, "Invalid date format");

export const passbookNumberSchema = z
    .string({
        invalid_type_error: "invalid passbook number",
        required_error: "passbook number is required",
    })
    .min(1, "passbook number must not be empty");

export const otpSchema = z
    .string({
        invalid_type_error: "otp must be valid string",
        required_error: "otp is required",
    })
    .min(6, "otp must be minimum of 6 digits")
    .max(6, "otp must be maximum of 6 digits");

// for event registration verification api
export const attendeeParamsSchema = z.object({
    id: eventIdParamSchema,
    passbookNumber: passbookNumberSchema,
});

// for event registration verification api
export const attendeeRegisterSchema = z.object({
    passbookNumber: passbookNumberSchema,
    birthday: validateBirthDay,
});

// for event registration for form schema
export const attendeeRegisterFormSchema = z.object({
    passbookNumber: passbookNumberSchema,
    birthday: z.string().refine((value) => {
        return /^(0[1-9]|1[0-2])(\/|-)(0[1-9]|1\d|2\d|3[01])(\/|-)(\d{4})$/.test(
            value
        );
    }, "Invalid date format"),
});

// for vote - voter search
export const voterPbSearchSchema = z.object({
    passbookNumber: passbookNumberSchema,
});

// for params
export const eventElectionParamsSchema = z.object({
    id: eventIdParamSchema,
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
