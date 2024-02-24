import React from "react";
import db from "@/lib/database";
import { eventIdParamSchema } from "@/validation-schema/event-registration-voting";
import InvalidElection from "./_components/invalid-election";
import ValidateVoter from "./_components/validate-voter";

type Props = {
    params : { id : number }
};

const ElectionVerifyPage = async ({ params }: Props) => {
   
    const validatedEventId = eventIdParamSchema.safeParse(params.id)    

    if(!validatedEventId.success) return <InvalidElection />

    const election = await db.election.findUnique({ 
        where : { eventId : validatedEventId.data },
        include : { event : true }
    }) 
    
    if(!election) return <InvalidElection />

    if(election.status === "done") return <InvalidElection message="This election has ended" />
    
    if (election.status != "live") return <InvalidElection message="Election is not yet open" />

    return (
        <div className="flex flex-col py-20 px-5 gap-y-6 min-h-screen w-full items-center">
            <p className="text-2xl lg:text-4xl uppercase text-center">{election.electionName}</p>
            <div className="w-5 h-2 bg-orange-400 rounded-full"/>
            <div className="py-16">
                <ValidateVoter electionWithEvent={election} />
            </div>
        </div>
    );
};

export default ElectionVerifyPage;
