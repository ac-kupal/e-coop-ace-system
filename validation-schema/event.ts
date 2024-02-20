import { useIsElection } from "@/stores/isElection-hooks";
import { ElectionStatus, EventType } from "@prisma/client";
import z from "zod";

export const createEventSchema = z.object({
   title: z
      .string({ required_error: "event title is required" })
      .min(1, "event title is required"),
   description: z
      .string({ required_error: "event description is required" })
      .min(1, "event description is required"),
   date: z.coerce.date({ required_error: "event date is required" }),
   location: z
      .string({ required_error: "event location is required" })
      .min(1, "event location is required"),
   category: z.nativeEnum(EventType, {
      invalid_type_error: "invalid category",
      required_error: "event location is required"}),
   deleted: z
      .boolean({
         invalid_type_error: "deleted attrib must be a boolean",
      })
      .nullable()
      .optional(),
});


export const createEventWithElectionSchema = (isElection:boolean)=>{
   return z.object({
      title: z
         .string({ required_error: "event title is required" })
         .min(1, "event title is required"),
      description: z
         .string({ invalid_type_error: "event description must be string" })
         .min(1, "event description is required"),
      date: z.coerce.date({ required_error: "event date is required" }),
      location: z
         .string({ required_error: "event location is required" })
         .min(1, "event location is required"),
      category: z.nativeEnum(EventType, {
         invalid_type_error: "invalid category",
         required_error: "event location is required"}),
      electionName: isElection ? z.string().min(1,"election name is required") : z.string({  invalid_type_error: "invalid category"}).optional()
   });
}



