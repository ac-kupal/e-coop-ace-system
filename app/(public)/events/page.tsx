export const dynamic = "force-dynamic";

import React from "react";
import Link from "next/link";

import EventList from "./_components/event-list";
import PartyPopperSvg from "@/components/custom-svg/party-popper";

const EventsPage = async () => {
    return (
        <div className="flex flex-col min-h-screen py-16 lg:py-0 w-full items-center">
            <div className="flex text-sm py-4 mt-8 gap-y-4 items-center gap-x-4 text-foreground/50 flex-col w-full px-8 md:flex-row md:justify-between">
                <Link href="/events">Events</Link>
                <Link href="/">Home</Link>
            </div>
            <div className="flex flex-col gap-y-4 items-center px-8 py-16 ">
                <PartyPopperSvg className="size-[70px]" />
                <p className="text-3xl font-medium md:text-4xl lg:text-5xl">
                    Upcoming Events
                </p>
            </div>
            <EventList />
            <div className="flex text-xs bg-secondary py-2 mt-8 gap-y-4 items-center gap-x-4 text-foreground/50 flex-col w-full px-8 md:flex-row md:justify-center">
                <p>eCOOP</p>
                <p>ACE System</p>
                <p>Lands Horizon</p>
            </div>
        </div>
    );
};

export default EventsPage;
