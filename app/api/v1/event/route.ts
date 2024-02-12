import { NextRequest, NextResponse } from "next/server"
import { createEvent, getAllEvent } from "./services/events"
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { createEventSchema } from "@/validation-schema/event";
import { z } from "zod";


// GET create event
export const POST =async (req: NextRequest) => {
    try {
        const { data, electionId }: { data: z.infer<typeof createEventSchema>, electionId: number } = await req.json();
        const validation = createEventSchema.safeParse(data)
        
        if(!validation.success) 
            return NextResponse.json({ message : validation.error.issues[0].message }, { status : 400 })

        const CreateEvent = await createEvent(data,electionId)
        return NextResponse.json(CreateEvent)
    
    } catch (e) {
        console.error(`ERROR : /api/v1/events - [GET]: ${e}`)
         return NextResponse.json({ message : "Internal Server Error"}, { status : 500 })
    }
}


export const GET = async (req : NextRequest) => {
     try{
          const getAllEvents = await getAllEvent() 
          console.log("event",getAllEvents)
         return NextResponse.json(getAllEvents)
     }catch(e){
         console.error(`ERROR : /api/v1/events - [GET]: ${e}`)
         return NextResponse.json({ message : "Internal Server Error"}, { status : 500 })
     }
 }

// TODO: POST create an event