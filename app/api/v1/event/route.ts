import { NextRequest, NextResponse } from "next/server"
import { getAllEvent } from "./services/events"


// GET create event
export const GET = async (req : NextRequest) => {
     try{
          const getAllEvents = await getAllEvent() 
          console.log(getAllEvents)
         return NextResponse.json(getAllEvents)
     }catch(e){
         console.error(`ERROR : /api/v1/events - [GET]: ${e}`)
         return NextResponse.json({ message : "Internal Server Error"}, { status : 500 })
     }
 }

// TODO: POST create an event