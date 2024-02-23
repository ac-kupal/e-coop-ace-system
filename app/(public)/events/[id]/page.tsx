import React from "react";
import Link from "next/link";
import db from "@/lib/database";

import { Button } from "@/components/ui/button";
import VoteButton from "@/components/vote/vote-button";
import InvalidEvent from "./_components/invalid-event";
import DisplayEventQRLink from "./_components/displayed-qr";

type Props = {
    params: { id: string };
};

const ElectionPage = async ({ params }: Props) => {
    let id = Number(params.id);

    if (!params.id || isNaN(id)) return <InvalidEvent />;
    const event = await db.event.findUnique({ where: { id, deleted: false } });
    if (!event) return <InvalidEvent />;

    return (
        <div className="flex flex-col lg:flex-row min-h-screen w-full">
            <div className="w-full relative flex flex-col gap-y-24 bg-background overflow-clip px-8 py-20 lg:w-1/2">
                <img
                    alt="cover image blur"
                    className="z-0 rounded-xl h-[63vh] opacity-10 absolute blur-xl left-0 w-full object-cover"
                    src={event.coverImage as ''}
                />
                <img
                    alt="event cover image"
                    className="z-10 rounded-xl h-[60vh] dark:drop-shadow-sm dark:drop-shadow-foreground w-full object-cover"
                    src={event.coverImage as ''}
                />
                <div className="px-0 md:px-16 xl:px-24 flex flex-col gap-y-4">
                    <div className="flex gap-x-4 mb-4">
                        <Link
                            href={`/events/${event.id}/register`}
                            className="w-full"
                        >
                            <Button className="bg-gradient-to-tr from-[#9175DF] rounded-lg to-[#BA7D81] hover:from-[#7f68c0] hover:to-[#8d6265] w-full text-xl">
                                Register
                            </Button>
                        </Link>
                        <VoteButton event={event} />
                    </div>
                    <div className="flex gap-x-4 items-center">
                        <div className="w-8 h-2 rounded-full bg-orange-500" />
                        <p className="text-xl md:text-3xl xl:text-4xl">
                            {event.title}
                        </p>
                    </div>
                    <p className="text-foreground/70">{event.description}</p>
                </div>
            </div>
            <div className="w-full p-8 lg:w-1/2 flex flex-col items-center space-y-9 justify-center">
                <div className="flex flex-col gap-y-8 lg:gap-y-16 text-lg lg:text-xl xl:text-2xl">
                    <div className="flex gap-x-4 items-center">
                        <div className="w-5 h-1 lg:h-2 rounded-full bg-orange-500" />
                        <p>Register to capture attendance</p>
                    </div>
                    <div className="flex gap-x-4 items-center">
                        <div className="w-5 h-1 lg:h-2 rounded-full bg-orange-500" />
                        <p>Once registered, you can attend the event</p>
                    </div>
                    <div className="flex gap-x-4 items-center">
                        <div className="w-5 h-1 lg:h-2 rounded-full bg-orange-500" />
                        <p>Claim event incentives/give aways</p>
                    </div>
                </div>
                <DisplayEventQRLink Event={event} />
            </div>
        </div>
    );
};

export default ElectionPage;
