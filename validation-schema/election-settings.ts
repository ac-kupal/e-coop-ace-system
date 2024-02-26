import { ElectionStatus, Role, VotingEligibility } from "@prisma/client";
import z from "zod";

export const voteEligibility = z.nativeEnum(VotingEligibility, { invalid_type_error : "invalid role" })
export const electionStatus = z.nativeEnum(ElectionStatus, { invalid_type_error : "invalid role" })


export const electionSettingSchema = z.object({
   voteEligibility: z.nativeEnum(VotingEligibility, { invalid_type_error : "invalid role" }), 
   allowBirthdayVerification:z.boolean({invalid_type_error:"invalid type"}) 
})


