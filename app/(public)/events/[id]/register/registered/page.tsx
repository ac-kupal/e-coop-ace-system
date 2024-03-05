import React from "react";
import Link from "next/link";
import db from "@/lib/database";

import { CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import InvalidEvent from "../../_components/invalid-event";

type Props = {
    params: { id: string };
};

const RegisteredPage = async ({ params }: Props) => {
    let id = Number(params.id);

    if (!params.id || isNaN(id)) return <InvalidEvent />;
    const event = await db.event.findUnique({ where: { id, deleted: false } });
    if (!event) return <InvalidEvent />;

    return (
        <div className="flex flex-col items-center w-full">
            <div className="w-full py-8 px-4  min-h-screen max-w-xl bg-background lg:max-w-2xl flex flex-col items-center space-y-9 justify-center">
                <div className="relative">
                    <img
                        alt="event cover image"
                        className="z-10 rounded-xl h-[60vh] dark:drop-shadow-sm dark:drop-shadow-foreground w-full object-cover"
                        src={event.coverImage as ""}
                    />
                    <div className="px-8 bg-gradient-to-t from-background to-transparent absolute w-full py-9 bottom-0 left-0  flex gap-y-4">
                        <div className="flex gap-x-4 items-center">
                            <div className="w-8 h-2 rounded-full bg-orange-500" />
                            <p className="text-xl md:text-3xl">{event.title}</p>
                        </div>
                    </div>
                </div>
                <div className="gap-y-4 flex flex-col items-center">
                    <CheckCircle
                        className="size-14 text-green-600"
                        strokeWidth={1}
                    />
                    <p className="text-2xl">You have been registered 🎉</p>
                    <p className="text-foreground/70">
                        Your registration will serve as your attendance
                    </p>
                    <Link href={`/events/${event.id}`}>
                        <Button>Return to Event</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisteredPage;
