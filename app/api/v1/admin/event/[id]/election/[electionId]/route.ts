import { validateId } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/database"
import { routeErrorHandler } from "@/errors/route-error-handler";
import { electionSettingSchema } from "@/validation-schema/election-settings";

type TParams = {
  params:{electionId:number}
}

export const POST = (req:NextRequest)=>{
  return NextResponse.json({message:"post - ok"})
}

export const GET =async (req:NextRequest,{params}:TParams)=>{
  try {
       const electionId = Number(params.electionId)
       validateId(electionId)
       const getElection = await db.election.findUnique({
        where:{id:electionId},
        include:{
          positions:true,
          candidates:true
        }
        })
       return NextResponse.json(getElection)
    } catch (error) {
       return routeErrorHandler(error, req);
    }
}

export const PATCH = async function name(req:NextRequest,{params}:TParams) {
  try {
     const electionId = Number(params.electionId)
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
      return routeErrorHandler(error,req)
    }
}
