import z from "zod";
import { eventIdParamSchema, incentiveAssignIdParamSchema, incentiveIdParamSchema } from "./commons";

export const eventAndIncentiveParamSchema = z.object({
    id: eventIdParamSchema,
    incentiveId: incentiveIdParamSchema,
});

export const incentiveIdAndAssignIdParamSchema = z.object({
    incentiveId: incentiveIdParamSchema,
    assignId: incentiveAssignIdParamSchema,
});