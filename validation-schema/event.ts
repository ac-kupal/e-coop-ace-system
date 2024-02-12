import { EventType } from "@prisma/client";
import z from "zod";

export const createEventSchema = z.object({
   title: z
      .string({ required_error: "event title is required" })
      .min(1, "event title is required"),
   description: z
      .string({ required_error: "event description is required" })
      .min(1, "event description is required"),
   date: z
      .date({ required_error: "event date is required" }),
   location: z
      .string({ required_error: "event location is required" })
      .min(1, "event location is required"),
      category: z.nativeEnum(EventType),
   electionID: z.coerce
      .number({ required_error: "election id is required" })
      .optional(),
});
