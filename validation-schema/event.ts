import { EventType } from "@prisma/client";
import z from "zod";

const commonFieldErrors = {
   required_error: "This field is required",
   invalid_type_error: "Invalid data type",
};

const commonFieldErrorsMinimum = {
   required_error: "Field must contain at least 1 character(s)",
};

export const createEventSchema = z.object({
   title: z
      .string({
         ...commonFieldErrors,
      })
      .min(1, commonFieldErrorsMinimum.required_error),
   description: z
      .string({
         ...commonFieldErrors,
      })
      .min(1, commonFieldErrorsMinimum.required_error),
   date: z.coerce.date({
      ...commonFieldErrors,
   }),
   location: z
      .string({
         ...commonFieldErrors,
      })
      .min(1, commonFieldErrorsMinimum.required_error),
   coverImage: z
      .string({
         ...commonFieldErrors,
      })
      .nullable(),
   category: z.nativeEnum(EventType, {
      ...commonFieldErrors,
   }),
   deleted: z
      .boolean({
         invalid_type_error: "Deleted attribute must be a boolean",
      })
      .nullable()
      .optional(),
});

export const updateEventSchema = createEventSchema
   .pick({
      title: true,
      description: true,
      date: true,
      location: true,
   })
   .merge(
      z.object({
         coverImage: z.any().optional(),
      })
   );

export const createEventWithElectionSchema = (isElection: boolean) => {
   return createEventSchema.extend({
      electionName: isElection
         ? z
              .string({
                 ...commonFieldErrors,
              })
              .min(1)
         : z.string({ ...commonFieldErrors }).optional(),
   });
};

export const createEventWithElectionWithUploadSchema = (
   isElection: boolean
) => {
   return createEventWithElectionSchema(isElection).extend({
      coverImage: z.any().optional(),
   });
};
