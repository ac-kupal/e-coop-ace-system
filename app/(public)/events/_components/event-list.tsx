"use client"
import React from "react";

import EventCard from "./event-card";
import { useEventList } from "../../../../hooks/public-api-hooks/use-events-api";
import LoadingSpinner from "@/components/loading-spinner";

const EventList = () => {
    const { eventList, isFetching, isLoading } = useEventList();

    const loading = isFetching || isLoading

    return (
        <>
            { loading && <LoadingSpinner /> }
            <div className="p-4 grid grid-cols-1 gap-4 md:grid-cols-2 justify-center w-full lg:max-w-[90rem]">
                {eventList.map((event) => (
                    <EventCard event={event} key={event.id} />
                ))}
            </div>
            { !loading && eventList.length === 0 && (
                <div className="h-full w-full flex justify-center items-center">
                    <p>There&#39;s no event here yet 🐧</p>
                </div>
            )}
        </>
    );
};

export default EventList;
