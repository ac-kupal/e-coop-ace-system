import { z } from "zod";

export type TCreateCandidate = {
   firstName: string;
   lastName: string;
   passbookNumber: number;
   picture: string | null;
   electionId: number;
   pisitonId: number;
};

export const createCandidateSchema = z.object({
   firstName: z
      .string({
         required_error: "candidate first name is required",
         invalid_type_error: "candidate firt name must be string",
      })
      .min(1, "candidate name is required"),
   lastName: z
      .string({
         required_error: "candidate last name is required",
         invalid_type_error: "candidate last name must be string",
      })
      .min(1, "candidate last name is required"), 
      passbookNumber: z.coerce.number({
          required_error: "passbook is required",
          invalid_type_error: "passbook number type must be number",
       }),
       picture: z
       .string({
          required_error: "candidate picture is required",
          invalid_type_error: "candidate picture type must be string",
       }).nullable(),
       electionId: z.coerce.number({
          required_error: "candidate election ID is required",
          invalid_type_error: "candidate election ID type must be number",
       }),
       positionId: z.coerce.number({
          required_error: "position ID is required",
          invalid_type_error: "position ID type must be number",
       }),
});


export const updateCandidateSchema = z.object({
     firstName: z
        .string({
           required_error: "candidate first name is required",
           invalid_type_error: "candidate firt name must be string",
        })
        .min(1, "candidate name is required"),
     lastName: z
        .string({
           required_error: "candidate last name is required",
           invalid_type_error: "candidate last name must be string",
        })
        .min(1, "candidate last name is required"), 
        passbookNumber: z.coerce.number({
            required_error: "number of seats is required",
            invalid_type_error: "position number of seats must be number",
         }),
         picture: z
         .string({
            required_error: "candidate picture is required",
            invalid_type_error: "candidate picture type must be string",
         }),
         electionId: z.coerce.number({
            required_error: "election ID is required",
            invalid_type_error: "election ID type must be number",
         }),
         positionId: z.coerce.number({
            required_error: "position ID is required",
            invalid_type_error: "position ID type must be number",
         }),
  });