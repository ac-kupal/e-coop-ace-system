import z from "zod";

export const eventPbBulkExportRequestSchema = z.object({
    batchId: z.coerce.number(),
    passbookNumbers: z.array(z.string().min(1), {
        required_error: "passbookNumbers is required and must be an array",
    }),
    options: z
        .object({
            dimension: z.number().min(100).max(1000).default(500).optional(),
            showPbNumberText: z.boolean().default(false).optional(),
        })
        .optional(),
});

export interface IEventPbBulkExportRequest
    extends z.infer<typeof eventPbBulkExportRequestSchema> {}

export interface IEventPbBulkExportResponse {
    url: string;
}
