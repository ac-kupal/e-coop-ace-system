import React from "react";
import db from "@/lib/database";
import VoteWindow from "./_components/vote-window";
import InvalidElection from "../_components/invalid-election";
import { eventIdParamSchema } from "@/validation-schema/event-registration-voting";

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
            positions: {
                include: { candidates: { include: { position: true } } },
            },
        },
    });

    if (!election) return <InvalidElection message="Election doesn't exist" />;

    if (election.positions.length === 0) return (<InvalidElection message="It seems like this election doesn't have positions and candidates yet. Please contact admin" />);

    return (
        <div className="flex flex-col mt-2 pt-16 px-5 gap-y-1 lg:gap-y-6 min-h-screen w-full items-center  bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-[#e7e0fb] dark:from-secondary to-transparent">
            <p className="text-lg lg:text-2xl xl:text-4xl uppercase text-center">
                {election.electionName}
            </p>
            <div className="w-5 h-2 bg-orange-400 rounded-full" />
            <VoteWindow election={election} />
        </div>
    );
};

export default VotePage;
