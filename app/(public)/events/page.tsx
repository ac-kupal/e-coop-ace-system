export const dynamic = "force-dynamic";

import React from "react";

import EventList from "./_components/event-list";
import PartyPopperSvg from "@/components/custom-svg/party-popper";

const EventsPage = async () => {
    return (
        <div className="flex flex-col min-h-screen py-16 lg:py-0 w-full items-center">
            <div className="flex flex-col gap-y-4 items-center px-8 py-16 ">
                <PartyPopperSvg className="size-[70px]" />
                <p className="text-3xl font-medium md:text-4xl lg:text-5xl">
                    Upcoming Events
                </p>
            </div>
            <EventList />
        </div>
    );
};

export default EventsPage;
