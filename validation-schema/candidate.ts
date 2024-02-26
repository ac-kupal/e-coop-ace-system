import { z } from "zod";


const commonFieldErrors = {
   required_error: "This field is required",
   invalid_type_error: "Invalid data type",
};

export const createCandidateSchema = z.object({
   firstName: z.string({
      ...commonFieldErrors,
   }).min(1),
   lastName: z.string({
      ...commonFieldErrors,
   }).min(1),
   passbookNumber: z.string({
      ...commonFieldErrors,
   }),
   picture: z.string({
      ...commonFieldErrors,
   }).nullable(),
   electionId: z.coerce.number({
      ...commonFieldErrors,
   }).int(),
   positionId: z.coerce.number({
      ...commonFieldErrors,
   }).int(),
});

export const updateCandidateSchema = createCandidateSchema.extend({
   picture: z.any().refine((file: File | undefined | null) => file !== undefined && file !== null, {
      message: "Image File is required",
   }).optional(),
});

export const createCandidateWithUploadSchema = createCandidateSchema.extend({
   picture: z.any().optional(),
       electionId: z.coerce.number({
          required_error: "candidate election ID is required",
          invalid_type_error: "candidate election ID type must be number",
       }),
});


