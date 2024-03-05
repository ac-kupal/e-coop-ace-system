import { $Enums, Election } from "@prisma/client";
import { TCandidate, TEvent, TPosition, TPositionWithCandidatesAndPosition } from ".";
export type TCreateElection = {
    electionName: string;
    status: $Enums.ElectionStatus;
};

export type TElection = Election;

export type TElectionWithEvent = TElection & { event: TEvent };

export type TElectionWithPositionAndCandidate = TElection & { positions : TPosition[] } & {candidates: TCandidate[]}

export type TElectionWithPositionsAndCandidates = TElection & { positions : TPositionWithCandidatesAndPosition[] } & {candidates: TCandidate[]}

// for public/events election usage
export type TElectionWithEventWithPositionAndCandidates = TElectionWithEvent & { positions : TPositionWithCandidatesAndPosition[] }
