import { validateId } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";
import db from '@/lib/database'
import { routeErrorHandler } from "@/errors/route-error-handler";
import { createCandidateSchema } from "@/validation-schema/candidate";
type TParams = { params: { id: number } };

//delete candidate
export const DELETE = async function name(req:NextRequest,{params}:TParams) {
    try {
     const candidateId = Number(params.id)
     validateId(candidateId)
     const deleteCandidate = await db.candidate.delete({where:{id:candidateId}})
     return NextResponse.json(deleteCandidate)     
     } catch (error) {
       return routeErrorHandler(error, req)
     }
}

//get many candidate based on id
export const GET = async function name(req:NextRequest,{params}:TParams) {
  try {
    const electionId = Number(params.id)
    console.log(electionId)
    validateId(electionId)
    const getAllCandidate = await db.candidate.findMany(
      {where:
         {
            electionId:electionId
         },
         include:{
            position:true
         }
      }
   );
    return NextResponse.json(getAllCandidate);
 } catch (error) {
    return routeErrorHandler(error, req );
 }
     
}
//update specific candidate
export const PATCH = async function name(req:NextRequest,{params}:TParams) {
  try {
    const candidateId = Number(params.id)
    const candidate = await req.json()
    createCandidateSchema.parse(candidate)
    validateId(candidateId)
    const updatedCandidate = await db.candidate.update({
      where:{id:candidateId},
       data:
       {
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        passbookNumber: candidate.passbookNumber,
        picture: candidate.picture,
        election: {
           connect: {
              id: candidate.electionId,
           },
        },
        position: {
           connect: {
              id: candidate.positionId,
           },
        },
     },
    })
    return NextResponse.json(updatedCandidate)     
    } catch (error) {
      return routeErrorHandler(error,req)
    }
}
