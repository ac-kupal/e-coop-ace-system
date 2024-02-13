import { ElectionStatus } from "@prisma/client";
import z from "zod"

export const createElectionValidation = z.object({
     e_name: z.string({
          required_error: "Election name is required",
          invalid_type_error: "Election name must be a string",
        }),
     startDate:z.coerce.date({ required_error: "Election date is required" }),
     endDate: z.coerce.date({ required_error: "Election date is required" }),
     status: z.nativeEnum(ElectionStatus,{ invalid_type_error : "invalid category" }),
  });
  