import { gender } from "@prisma/client";
import { z } from "zod";
import { passbookNumber } from "./event-registration-voting";

const commonFieldErrorsMinimum = {
   required_error: "Field must contain at least 1 character(s)",
};

export const createMemberSchema = z.object({
   passbookNumber: z
      .string({
         required_error: "passBook Number field is required",
         invalid_type_error: "Invalid passBook Number data type",
      })
      .min(1, commonFieldErrorsMinimum.required_error),

   firstName: z
      .string({
         required_error: "firstname field is required",
         invalid_type_error: "Invalid firstname data type",
      })
      .min(1, commonFieldErrorsMinimum.required_error),

   middleName: z
      .string({
         required_error: "middle field is required",
         invalid_type_error: "Invalid middle data type",
      })
      .min(1, commonFieldErrorsMinimum.required_error),

   lastName: z
      .string({
         required_error: "lastname field is required",
         invalid_type_error: "Invalid lastname data type",
      })
      .min(1, commonFieldErrorsMinimum.required_error),

   gender: z.nativeEnum(gender, {
      required_error: "gender field is required",
      invalid_type_error: "Invalid gender data type",
   }),

   birthday: z.coerce.date({
      required_error: "birthday field is required",
      invalid_type_error: "Invalid birthday data type",
   }),

   emailAddress: z
      .string({
         required_error: "email field is required",
         invalid_type_error: "Invalid email data type",
      })
      .min(1, "email is required")
      .email("please provide a valid email")
      .nullable(),
   contact: z
      .string({
         required_error: "contact field is required",
         invalid_type_error: "Invalid contact data type",
      })
      .min(11, commonFieldErrorsMinimum.required_error),
   eventId: z.coerce
      .number({
         required_error: "event field is required",
         invalid_type_error: "Invalid event data type",
      })
      .optional(),
});

export const createMemberWithUploadSchema = createMemberSchema.extend({
   picture: z.any().optional(),
});

export const createManySchema = z.object({
   passbookNumber: z
      .string({
         required_error:"passbook is Requried",
         invalid_type_error: "Invalid passBook Number data type",
      })
      .nullable(),
   firstName: z
      .string({
         required_error:"firstName is Requried",
         invalid_type_error: "Invalid firstname data type",
      })
      .nullable(),
   middleName: z
      .string({
         required_error:"middle name is Requried",
         invalid_type_error: "Invalid middle data type",
      })
      .nullable(),
   lastName: z
      .string({
         required_error: "lastname field is required",
         invalid_type_error: "Invalid lastname data type",
      })
      .nullable(),

   gender: z
      .nativeEnum(gender, {
         required_error:"gender is Requried",
         invalid_type_error: "Invalid gender data type",
      })
      .nullable(),

   birthday: z.coerce
      .date({
         required_error:"birthday is Requried",
         invalid_type_error: "Invalid birthday data type",
      })
      .nullable(),

   emailAddress: z
      .string({
         required_error:"email is Requried",
         invalid_type_error: "Invalid email data type",
      })
      .email("please provide a valid email")
      .nullable(),
   contact: z
      .string({
         required_error:"contact is Requried",
         invalid_type_error: "Invalid contact data type",
      })
      .nullable(),
   eventId: z.coerce
      .number({
         required_error: "event field is required",
         invalid_type_error: "Invalid event data type",
      })
      .optional(),
});

export const memberEmailSchema = z.string({ invalid_type_error : "invalid email", required_error : "Email is required"}).email("Email is required");
