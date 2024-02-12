import z from "zod";

export const createEventSchema = z.object({
    title: z
        .string({ required_error: "event title is required" })
        .min(1, "event title is required"),
    description: z
        .string({ required_error: "event description is required" })
        .min(1, "event description is required"),
    address: z
        .string({ required_error: "event location is required" })
        .min(1, "event location is required"),
     category: z
        .string({ required_error: "event catergory is required" })
        .min(1, "event catergory is required"),

});
