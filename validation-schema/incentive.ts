import z from "zod";
import { eventIdSchema, incentiveAssignIdParamSchema, incentiveIdSchema, otpSchema, passbookNumberSchema, userIdSchema } from "./commons";
import { memberIdSchema } from "./member";
import { create } from "domain";

export const assignedQuantitySchema = z.coerce.number({ invalid_type_error : "invalid alotted", required_error : "alotted is required" })

export const createIncentiveSchema = z.object({
    itemName : z.string({ required_error : "Item name is required", invalid_type_error : "invalid type for item name"}).min(2, "Item name too short"),
})

export const updateIncentiveSchema = createIncentiveSchema;

export const assignIncentiveSchema = z.object({
    id : userIdSchema
})

export const createIncentiveAssigneeSchema = z.object({
    userId : userIdSchema,
    assignedQuantity : assignedQuantitySchema
})

export const updateIncentiveAssignedSchema = z.object({
   assignedQuantity : assignedQuantitySchema
})

// for claimings
export const claimsEntrySchema = z.object({
    eventId : eventIdSchema,
    eventAttendeeId : memberIdSchema,
    incentiveId : incentiveIdSchema,
    assignedId : z.coerce.number({invalid_type_error : "invalid assigned id", required_error : "assign id is required"}),
})

export const createAssistedClaimSchema = z.object({
    claims : z.array(claimsEntrySchema)
})

// for claiming public
export const createIncentiveClaimPublic = z.object({
    passbookNumber : passbookNumberSchema,
    otp : otpSchema, // dont do this
    incentiveId : incentiveIdSchema
})

export const createPublicClaimAuthorizationSchema = z.object({
    passbookNumber : passbookNumberSchema,
    otp : otpSchema,
})
