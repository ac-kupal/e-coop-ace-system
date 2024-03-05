import { VotingEligibility } from "@prisma/client";

export type SettingsType = {
     voteEligibility: VotingEligibility;
     allowBirthdayVerification: boolean;
  };
  