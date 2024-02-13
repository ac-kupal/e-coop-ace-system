import { EventType } from "@prisma/client";
import z from "zod";

export const createEventSchema = z.object({
   title: z
      .string({ required_error: "event title is required" })
      .min(1, "event title is required"),
   description: z
      .string({ required_error: "event description is required" })
      .min(1, "event description is required"),
   date: z.coerce
      .string({ required_error: "event date is required" })
      .datetime(),
   location: z
      .string({ required_error: "event location is required" })
      .min(1, "event location is required"),
   category: z.nativeEnum(EventType, {
      invalid_type_error: "invalid category",
   }),
   deleted: z
      .boolean({
         invalid_type_error: "deleted attrib must be a boolean",
      })
      .nullable()
      .optional(),
   electionId: z.coerce
      .number({
         invalid_type_error: "Age must be a number",
      })
      .nullable()
      .optional(),
});
