import { VotingEligibility, VotingConfiguration } from "@prisma/client";

export type SettingsType = {
     voteEligibility: VotingEligibility;
     allowBirthdayVerification: boolean;
     voteConfiguration:VotingConfiguration;
  };
  