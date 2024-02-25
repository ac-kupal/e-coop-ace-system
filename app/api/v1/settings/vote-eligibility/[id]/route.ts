import { routeErrorHandler } from "@/errors/route-error-handler"
import { validateId } from "@/lib/server-utils"
import { updatePositionSchema } from "@/validation-schema/position"
import { NextRequest, NextResponse } from "next/server"
import db from '@/lib/database'
import { voteEligibility } from "@/validation-schema/election-settings"

type TParams = {
     params: {id:number}
}

export const PATCH = async function name(req:NextRequest,{params}:TParams) {
     try {
        const electionId = Number(params.id)
        const votingEligibility = await req.json()
        voteEligibility.parse(votingEligibility.voteEligibility)
        const updateElectionVoteEligibility = await db.election.update({
          where:{id:electionId},
          data:{
            voteEligibility:votingEligibility.voteEligibility
          }
          }
        )
       return NextResponse.json(updateElectionVoteEligibility)     
       } catch (error) {
         return routeErrorHandler(error,req.method)
       }
   }
   