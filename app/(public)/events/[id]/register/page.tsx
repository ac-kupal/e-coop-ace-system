import React from "react";
import db from "@/lib/database";
import { isPast, isSameDay } from "date-fns";

import Attendance from "./_components/attendance";
import InvalidEvent from "../_components/invalid-event";

type Props = {
    params: { id: string };
};

const RegisterPage = async ({ params }: Props) => {
    let id = Number(params.id);

    if (!params.id || isNaN(id)) return <InvalidEvent />;
    const event = await db.event.findUnique({ where: { id, deleted: false } });

    if (!event) return <InvalidEvent />;

    const today = new Date();

    if (isPast(event.date))
        return <InvalidEvent message="This event already passed" />;

    if (event.registrationOnEvent === true && !isSameDay(today, event.date))
        return <InvalidEvent message="This event registration is not yet open" />;

    return (
        <div className="flex flex-col py-20 px-5 gap-y-6 min-h-screen w-full items-center">
            <p className="text-2xl lg:text-4xl uppercase text-center">
                {event.title}
            </p>
            <div className="w-5 h-2 bg-orange-400 rounded-full" />
            <div className="py-16">
                <Attendance params={params} />
            </div>
        </div>
    );
};

export default RegisterPage;
