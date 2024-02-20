import React from "react";
import Link from "next/link";
import db from "@/lib/database";

import { Button } from "../ui/button";

import { TEvent } from "@/types/event/TCreateEvent";

type Props = {
    Event: TEvent;
};

const VoteButton = async ({ Event }: Props) => {
    if (Event.category !== "election") return;

    const eventElection = await db.event.findUnique({ where : { id : Event.id }, include : { election : true }})

    if(!eventElection || !eventElection.election) return;

    return (
        <Button className="bg-[#00C667] w-full text-xl">
            <Link href={`/events/election/${eventElection.election.id}`}>Vote</Link>
        </Button>
    );
};

export default VoteButton;
