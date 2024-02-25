import { Position } from "@prisma/client";
import { TCandidatewithPosition } from ".";

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


// used in public event/[]/election/vote
export type TPositionWithCandidatesAndPosition = { candidates : TCandidatewithPosition[] }
