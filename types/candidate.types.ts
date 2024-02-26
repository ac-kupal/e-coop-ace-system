
import { Candidate, Position } from "@prisma/client"

export type TCreateCandidate = {
    firstName:string,
    lastName:string,
    passbookNumber: string,
    picture: string | null;
    electionId: number;
    positionId: number;
}

export type TCandidate = Candidate

export type TCandidatewithPosition = Candidate & {position:Position} 