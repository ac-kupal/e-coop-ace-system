import z from "zod";
import { eventIdSchema, incentiveAssignIdParamSchema, incentiveIdSchema } from "./commons";
import { memberIdSchema } from "./member";

export const eventIdParamSchema = z.object({
    id : eventIdSchema
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