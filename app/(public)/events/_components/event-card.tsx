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
        " p-5 rounded-xl bg-background overflow-clip flex gap-x-4 flex-col gap-y-4 lg:flex-row bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-background to-[#e7e0fb] dark:to-secondary",
        className,
      )}
    >
      <div className="relative w-full lg:w-1/2 h-full">
        <img
          src={event.coverImage as ""}
          className="absolute w-full scale-110 h-full top-0 left-0 blur-lg opacity-10 z-0"
        />
        <img
          src={event.coverImage as ""}
          className="relative object-cover rounded-xl w-full h-full z-40"
        />
      </div>
      <div className="relative p-5 flex flex-col w-full lg:w-1/2 gap-y-8">
        <h1 className="text-xl md:text-4xl dark:text-[#e7e0fb]">
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
