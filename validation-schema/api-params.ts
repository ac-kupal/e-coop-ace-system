import z from "zod";
import { memberIdSchema } from "./member";
import { claimIdSchema } from "./incentive";
import { eventIdSchema, incentiveAssignIdParamSchema, incentiveIdSchema } from "./commons";

export const eventIdParamSchema = z.object({
    id : eventIdSchema
})

export const eventIdAndClaimIdParamSchema = z.object({
    id : eventIdSchema,
    claimId : claimIdSchema
})

export const eventAndIncentiveParamSchema = z.object({
    id: eventIdSchema,
    incentiveId: incentiveIdSchema,
});

export const incentiveIdAndAssignIdParamSchema = z.object({
    incentiveId: incentiveIdSchema,
    assignId: incentiveAssignIdParamSchema,
});

export const eventIdandMemberIdParamSchema = z.object({
    id : eventIdSchema,
    memberId : memberIdSchema
})

