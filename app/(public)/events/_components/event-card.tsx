import React from "react";
import Link from "next/link";
import { format } from "date-fns";

import { Calendar, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";

import { TEvent } from "@/types";
import { cn } from "@/lib/utils";

type Props = {
    event: TEvent;
    className?: string;
};

const EventCard = ({ className, event }: Props) => {
    return (
        <div
            className={cn(
                "relative overflow-clip min-h-[500px] rounded-xl flex flex-col gap-y-4",
                className
            )}
        >
            <img
                alt="Event Cover"
                src={event.coverImage as ""}
                className="absolute z-0 top-0 object-cover left-0 rounded-xl w-full h-full"
            />
            <div className="flex-auto" />
            <div className="p-5 bg-popover/80 flex z-40 backdrop-blur-lg relative max-w-full flex-col w-full gap-y-4">
                <h1 className="text-xl md:text-2xl max-w-full whitespace-nowrap overflow-hidden text-ellipsis dark:text-[#e7e0fb]">
                    {event.title}
                </h1>
                <p className="text-foreground/80">{event.description}</p>

                <div className="flex flex-col gap-y-2">
                    <p className="px-4 py-1 inline-flex items-center gap-x-4 rounded-full bg-secondary text-sm w-fit">
                        <Calendar className="size-4" strokeWidth={1} />
                        {format(event.date, "EEE, MMM dd, yyyy")}
                    </p>

                    <p className="px-4 py-1 inline-flex items-center gap-x-4 rounded-full bg-secondary text-sm w-fit">
                        <MapPin className="size-4" strokeWidth={1} />
                        {event.location}
                    </p>
                </div>
                <Link href={`/events/${event.id}`} className="w-full md:w-fit">
                    <Button className="bg-gradient-to-r from-[#dce2d9] w-full md:w-fit to-[#7fbeed] hover:to-[#d8bce8] text-black/80 hover:text-black rounded-xl px-8 py-4">
                        Go to Event
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default EventCard;
