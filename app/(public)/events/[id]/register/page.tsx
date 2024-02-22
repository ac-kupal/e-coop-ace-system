import React from "react";
import db from "@/lib/database";
import { isSameDay } from "date-fns";

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

    if (event.registrationOnEvent === true && !isSameDay(today, event.date))
        return (
            <div className="flex h-dvh justify-center items-center">
                <p className="text-sm text-foreground/70">
                    Registration is not yet open
                </p>
            </div>
        );

    return (
        <div className="flex flex-col py-20 px-5 gap-y-6 min-h-screen w-full items-center">
            <p className="text-2xl lg:text-4xl uppercase text-center">{event.title}</p>
            <div className="w-5 h-2 bg-orange-400 rounded-full"/>
            <div className="py-16">
                <Attendance params={params} />
            </div>
        </div>
    );
};

export default RegisterPage;
