import z from "zod";

export const createCoopSchema = z.object({
  coopName: z
    .string({
      required_error: "Coop name is required",
      invalid_type_error: "Invalid coop name type",
    })
    .min(1, "Coop name is required"),
  coopDescription: z
    .string({
      required_error: "Coop description is required",
      invalid_type_error: "Invalid description type",
    })
    .min(1, "Coop description is required"),
});

export const updateCoopSchema = createCoopSchema;
