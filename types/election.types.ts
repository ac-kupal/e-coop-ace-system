import { $Enums, Election } from "@prisma/client";
import { TCandidate, TEvent, TPosition, TPositionWithCandidatesAndPosition } from ".";
export type TCreateElection = {
    electionName: string;
    status: $Enums.ElectionStatus;
};

export type TElection = Election;

export type TElectionWithEvent = TElection & { event: TEvent };

export type TElectionWithPositions = TElection & { positions : TPosition[] };

// for public/events election usage
export type TElectionWithPositionAndCandidates = TElection & { positions : TPositionWithCandidatesAndPosition[] }
