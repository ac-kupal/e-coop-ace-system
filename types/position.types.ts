import { Position } from "@prisma/client";
import { TCandidate, TCandidatewithPosition } from ".";

export type TCreatePosition = {
     positionName:string,
     numberOfSelection:number,
     electionId:number,
}

export type TUpdatePosition = {
     positionName:string,
     numberOfSelection:number,
     electionId:number,
}

export type TPosition = Position

export type TPositionWithEventID = Position & {eventId:number}

export type TPositionWithCandidates= Position & { candidates : TCandidate[] }

export type  BarGraphDataTypes = {
     positionName:string,
     dataSets: number[];
     candidatesName: string[];
     candidateNameWithNumeric: string[];
}

// used in public event/[]/election/vote
export type TPositionWithCandidatesAndPosition = Position & { candidates : TCandidatewithPosition[] }
