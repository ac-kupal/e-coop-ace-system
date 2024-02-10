// TODO: GET get specific event

import { NextRequest, NextResponse } from "next/server";
export const GET = () => {
    return NextResponse.json('ok')
    
}
// TODO: PATCH update specific event

// TODO: DELETE specific event

export const DELETE = async(req:NextRequest)=>{
     try {
          // DELETE EVENT
     } catch (error) {
          console.error(`ERROR : /api/v1/[id] - [DELETE]: ${error}`)
          return NextResponse.json({ message : "Internal Server Error"}, { status : 500 })
     }

}