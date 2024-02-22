
import { Candidate } from "@prisma/client"

export type TCreateCandidate = {
    firstName:string,
    lastName:string,
    passbookNumber: number,
    picture: string | null;
    electionId: number;
    positionId: number;
}

export type TCandidate = Candidate