import React from "react";
import Link from "next/link";
import db from "@/lib/database";

import { Button } from "../ui/button";

import { TEvent } from "@/types";
import { cn } from "@/lib/utils";

type Props = {
    event: TEvent;
};

const VoteButton = async ({ event }: Props) => {
    if (event.category !== "election") return;

    const eventElection = await db.event.findUnique({
        where: { id: event.id },
        include: { election: true },
    });

    if (!eventElection || !eventElection.election) return;

    const {election} = eventElection;

    const canVote = election.status == "live";

    return (
        <Link href={canVote ? `/events/${event.id}/election/` : ''} className={cn("w-full", !canVote && "pointer-events-none")}>
            <Button disabled={!canVote} className={cn("bg-[#00C667] w-full text-xl", !canVote && "bg-secondary hover:bg-secondary text-secondary-foreground hover:text-secondary-foreground")}>
                    Vote
            </Button>
        </Link>
    );
};

export default VoteButton;
