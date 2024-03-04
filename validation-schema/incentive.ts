import z from "zod";
import { incentiveAssignIdParamSchema, incentiveIdSchema, otpSchema, passbookNumberSchema, userIdSchema } from "./commons";

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
export const createIncentiveClaimAssistSchema = z.object({
    incentiveAssignId : incentiveAssignIdParamSchema,
    eventAttendeeId : z.string({ required_error : "event attendee id is required", invalid_type_error : "invalid event attendee id"}),
})


// for claiming public
export const createIncentiveClaimPublic = z.object({
    passbookNumber : passbookNumberSchema,
    otp : otpSchema,
    incentiveId : incentiveIdSchema
})