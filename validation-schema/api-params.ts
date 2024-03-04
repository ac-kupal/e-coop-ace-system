import z from "zod"
import { eventIdParamSchema, incentiveIdParamSchema } from "./commons"

export const eventAndIncentiveParamSchema = z.object({
    id : eventIdParamSchema,
    incentiveId : incentiveIdParamSchema
})