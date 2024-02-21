import { Position } from "@prisma/client";


export type TCreatePosition = {
     positionName:string,
     numberOfSelection:number,
     electionId:number,
}

export type TPosition = Position
