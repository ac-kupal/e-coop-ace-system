import React from "react";
import db from "@/lib/database";
import InvalidElection from "../_components/invalid-election";
import { eventIdParamSchema } from "@/validation-schema/event-registration-voting";
import VoteWindow from "./_components/vote-window";

type Props = {
    params: { id: number };
};

const VotePage = async ({ params }: Props) => {
    const parsedParams = eventIdParamSchema.safeParse(params.id);

    if (!parsedParams.success)
        return <InvalidElection message="Invalid election" />;

    const election = await db.election.findUnique({
        where: { eventId: parsedParams.data },
        include: {
            event: true,
            positions: { include: { candidates: { include: { position: true } } } },
        },
    });

    if (!election) return <InvalidElection message="Election doesn't exist" />;

    return (
        <div className="flex flex-col py-20 px-5 gap-y-6 min-h-screen w-full items-center">
            <p className="text-2xl lg:text-4xl uppercase text-center">
                {election.electionName}
            </p>
            <div className="w-5 h-2 bg-orange-400 rounded-full" />
            <VoteWindow election={election} />
        </div>
    );
};

export default VotePage;
