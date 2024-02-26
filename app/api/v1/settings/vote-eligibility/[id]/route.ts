import { routeErrorHandler } from "@/errors/route-error-handler"
import { validateId } from "@/lib/server-utils"
import { updatePositionSchema } from "@/validation-schema/position"
import { NextRequest, NextResponse } from "next/server"
import db from '@/lib/database'
import { electionSettingSchema } from "@/validation-schema/election-settings"

type TParams = {
     params: {id:number}
}

export const PATCH = async function name(req:NextRequest,{params}:TParams) {
     try {
        const electionId = Number(params.id)
        const election = await req.json()
        console.log(election)
        electionSettingSchema.parse(election)
        const updatedElectionSettings = await db.election.update({
          where:{id:electionId},
          data:{
            voteEligibility:election.voteEligibility,
            allowBirthdayVerification:election.allowBirthdayVerification
          }
          }
        )
       return NextResponse.json(updatedElectionSettings)     
       } catch (error) {
         return routeErrorHandler(error,req.method)
       }
   }
   