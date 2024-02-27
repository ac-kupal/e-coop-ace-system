import { gender } from "@prisma/client";
import { z } from "zod";

// export type TCreateMember = {
//    passbookNumber: string;
//    firstName: string;
//    middleName: string;
//    lastName: string;
//    gender: $Enums.gender;
//    birthday: Date;
//    contact: string;
//    picture: string | null;
//    voteOtp: string;
//    eventId: number;
// };

const commonFieldErrors = {
   required_error: "This field is required",
   invalid_type_error: "Invalid data type",
};
const commonFieldErrorsMinimum = {
   required_error: "Field must contain at least 1 character(s)",
};

export const createEventSchema = z.object({
     passbookNumber: z.string({
        ...commonFieldErrors,
     }).min(1, commonFieldErrorsMinimum.required_error),
  
     firstName: z.string({
        ...commonFieldErrors,
     }).min(1, commonFieldErrorsMinimum.required_error),
  
     middleName: z.coerce.date({
        ...commonFieldErrors,
     }),
  
     lastName: z.string({
        ...commonFieldErrors,
     }).min(1, commonFieldErrorsMinimum.required_error),
  
     gender: z.nativeEnum(gender, {
        ...commonFieldErrors,
     }),
  
     picture: z.string({
        ...commonFieldErrors,
     }).nullable(),
  
     birthday: z.coerce.date({
        ...commonFieldErrors,
     }),
  
     contact: z.string({
        ...commonFieldErrors,
     }).min(11, commonFieldErrorsMinimum.required_error),
  
     voteOtp: z.string({
        ...commonFieldErrors,
     }).min(6, commonFieldErrorsMinimum.required_error),
  
     eventId: z.coerce.number({
          ...commonFieldErrors,
     }).optional()
  });
  

export const memberEmailSchema = z.string({invalid_type_error : "invalid email"}).email("invalid email");
