import React from "react";
import db from "@/lib/database";
import Link from "next/link";

type Props = {};

const EventsPage = async (props: Props) => {
    const events = await db.event.findMany({
        where: { deleted: false },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="flex flex-col lg:flex-row min-h-screen w-full">
            {events.length === 0 && <p>There's no event here yet 🐧</p>}
            {events.map((event) => (
                <div className="min-h-[80vh] w-full lg:w-[60vw] rounded-lg">
                    <Link href={`/events/${event.id}`} >Go</Link>
                </div>
            ))}
        </div>
    );
};

export default EventsPage;
