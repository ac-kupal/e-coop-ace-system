import db from "@/lib/database";
import React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import VoteButton from "@/components/vote/vote-button";

type Props = {
    params: { id: string };
};

const InvalidEvent = () => {
    return (
        <div className="h-dvh w-dvw flex items-center justify-center">
            <p>Sorry, but this is an invalid event</p>
        </div>
    );
};

const ElectionPage = async ({ params }: Props) => {
    let id = Number(params.id);

    if (!params.id || isNaN(id)) return <InvalidEvent />;

    const event = await db.event.findUnique({ where: { id }});

    if (!event) return <InvalidEvent />;

    return (
        <div className="flex flex-col lg:flex-row min-h-screen w-full">
            <div className="w-full flex flex-col gap-y-16 bg-background px-8 py-16 lg:w-1/2">
                <img
                    alt="event cover image"
                    className="rounded-xl h-[60vh] w-full object-cover"
                    src="https://media.discordapp.net/attachments/955281529481883729/1209463734758809640/Blue__Purple_Gradient_Music_Event_Facebook_Post.jpg?ex=65e703e1&is=65d48ee1&hm=21beacdba6b6c7f167dbbbe425cf93d6b1deeae7dfa75e38d3bdbe45c2201c92&=&format=webp&width=740&height=621"
                />
                <div className="px-0 md:px-16 xl:px-24 flex flex-col gap-y-8">
                    <div className="flex gap-x-4">
                        <Button className="bg-gradient-to-tr from-[#9175DF] rounded-lg w-full to-[#BA7D81] hover:from-[#7f68c0] hover:to-[#8d6265] text-xl">
                            <Link href={`/events/${params.id}/register`}>
                                Register
                            </Link>
                        </Button>
                        <VoteButton Event={event} />
                    </div>
                    <div className="flex gap-x-4 items-center">
                        <div className="w-8 h-2 rounded-full bg-orange-500" />
                        <p className="text-xl md:text-3xl xl:text-4xl">
                            {event.title}
                        </p>
                    </div>
                </div>
            </div>
            <div className="w-full p-8 lg:w-1/2 flex flex-col items-center justify-center">
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
            </div>
        </div>
    );
};

export default ElectionPage;
