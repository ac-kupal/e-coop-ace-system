import React from "react";
import db from "@/lib/database";
import EventCard from "./[id]/_components/event-card";
import PartyPopperSvg from "@/components/custom-svg/party-popper";

type Props = {};

const EventsPage = async ({}: Props) => {
  const events = await db.event.findMany({
    where: { deleted: false },
    orderBy: [ { createdAt: "desc"} , {date : "desc" } ]
  });

  return (
    <div className="flex flex-col min-h-screen py-16 lg:py-24 w-full items-center">
      <div className="flex flex-col gap-y-4 items-center px-8 py-16 ">
        <PartyPopperSvg className="size-[70px]" />
        <p className="text-3xl font-medium md:text-4xl lg:text-5xl">
          Upcoming Events
        </p>
      </div>
      <div className="p-4 grid grid-cols-1 gap-4 md:grid-cols-2 justify-center w-full lg:max-w-[90rem]">
        {events.map((event) => (
          <EventCard event={event} key={event.id} />
        ))}
      </div>
      {events.length === 0 && (
        <div className="h-full w-full flex justify-center items-center">
          <p>There&#39;s no event here yet 🐧</p>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
