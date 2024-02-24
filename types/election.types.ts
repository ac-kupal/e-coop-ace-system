import { $Enums, Election } from "@prisma/client"
import { TEvent } from ".";
export type TCreateElection = {
     electionName: string;
     status: $Enums.ElectionStatus;
}

export type TElection = Election

export type TElectionWithEvent = TElection & { event : TEvent }

