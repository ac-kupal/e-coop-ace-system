import { gender } from "@prisma/client";
import { z } from "zod";

const commonFieldErrorsMinimum = {
   required_error: "Field must contain at least 1 character(s)",
};

export const createMemberSchema = z.object({
   passbookNumber: z
      .string({
         required_error: "passBook Number field is required",
         invalid_type_error: "Invalid passBook Number data type",
      })
      .min(1,"passbook Field must contain at least 1 character(s)"),

   firstName: z
      .string({
         required_error: "firstname field is required",
         invalid_type_error: "Invalid firstname data type",
      })
      .min(1,"firstName Field must contain at least 1 character(s)"),

   middleName: z
      .string({
         required_error: "middle field is required",
         invalid_type_error: "Invalid middle data type",
      })
      .min(1, "middleName Field must contain at least 1 character(s)"),

   lastName: z
      .string({
         required_error: "lastname field is required",
         invalid_type_error: "Invalid lastname data type",
      })
      .min(1,"lastName Field must contain at least 1 character(s)"),

   gender: z.nativeEnum(gender, {
      required_error: "gender field is required",
         invalid_type_error: "Invalid gender data type",
   }),

   birthday: z.coerce.date({ required_error: "birthday field is required",
   invalid_type_error: "Invalid birthday data type",}),

   emailAddress: z
      .string({
         required_error: "email field is required",
         invalid_type_error: "Invalid email data type",
      })
      .min(1, "email is required")
      .email("please provide a valid email").nullable(),
   contact: z
      .string({
         required_error: "contact field is required",
         invalid_type_error: "Invalid contact data type",
      })
      .min(11,"contact Field must contain at least 1 character(s)"),
   eventId: z.coerce
      .number({
         required_error: "event field is required",
         invalid_type_error: "Invalid event data type",
      })
      .optional(),
});

export const createMemberWithUploadSchema = createMemberSchema.extend({
  picture: z.any().optional(),
})   

