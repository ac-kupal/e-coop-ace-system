import { validateId } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/database"
import { routeErrorHandler } from "@/errors/route-error-handler";

type TParams = {
  params:{electionId:number}
}

export const POST = (req:NextRequest)=>{
  return NextResponse.json({message:"post - ok"})
}

export const GET =async (req:NextRequest,{params}:TParams)=>{
  try {
       const electionId = Number(params.electionId)
       console.log("election",params)
       validateId(electionId)
       const getElection = await db.election.findUnique({
        where:{id:electionId},
        include:{
          positions:true
        }
        })
       console.log("this is election: ",getElection)
       return NextResponse.json(getElection)
    } catch (error) {
       return routeErrorHandler(error, req);
    }

}