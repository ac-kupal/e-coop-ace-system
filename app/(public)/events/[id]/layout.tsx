import React from "react";
import { Metadata } from "next";
import EventsNav from "./_components/events-nav";

type Props = { children: React.ReactNode; params: { id: number } };

export const metadata: Metadata = {
  title: {
    default: "Event",
    template: "Event: %s",
  },
  description: "Explore this event",
};

const layout = ({ params, children }: Props) => {
  return (
    <>
      <EventsNav eventId={params.id} />
      {children}
    </>
  );
};

export default layout;
