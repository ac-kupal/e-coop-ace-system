import z from "zod"

export const eventIdParamSchema = z.coerce.number({ invalid_type_error : "invalid event id", required_error : "event id is required"})

export const electionIdParamSchema = z.coerce.number({ invalid_type_error : "invalid event electionId", required_error : "electionId is required"})

export const validateBirthDay = z.coerce.date({ invalid_type_error : "invalid birthday", required_error : "birthday is required for verification"})

export const passbookNumber = z.string({ invalid_type_error : "invalid passbook number", required_error : "passbook number is required"}).min(1, "passbook number must not be empty")


// for event registration verification api
export const attendeeParamsSchema = z.object({
    id : eventIdParamSchema,
    passbookNumber
})

// for event registration verification api
export const attendeeRegisterParamsSchema = z.object({
    passbookNumber,
    birthday : validateBirthDay
})



// for vote - voter search
// for params
export const eventElectionParamsSchema = z.object({
    id : eventIdParamSchema,
    electionId : electionIdParamSchema
})

// for voter search params
export const voterSearchParamSchema = z.object({
    passbookNumber
})

export const voterRequestAuthorizationSchema = z.object({
    passbookNumber,
    
    // verification method - depends on event thats why it's optional
    otp : z.string({invalid_type_error : "otp must be valid string", required_error : "otp is required"}).min(6, "otp must be minimum of 6 digits").max(6, "otp must be maximum of 6 digits").optional()
})
