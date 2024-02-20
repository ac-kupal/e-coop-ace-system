import { ElectionStatus } from "@prisma/client";
import z from "zod"

export const createElectionValidation = z.object({
     electionName: z.string({
          required_error: "Election name is required",
          invalid_type_error: "Election name must be a string",
        }),
     status: z.nativeEnum(ElectionStatus,{ invalid_type_error : "invalid category" }),
  });
  