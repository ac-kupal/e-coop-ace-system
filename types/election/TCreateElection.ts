import { $Enums, Election } from "@prisma/client"
export type TCreateElection = {
     electionName: string;
     status: $Enums.ElectionStatus;
}

export type TElection = Election

