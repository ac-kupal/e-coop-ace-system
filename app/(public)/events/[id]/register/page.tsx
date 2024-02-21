import React from "react";
import db from "@/lib/database";
import { isSameDay } from "date-fns";

import InvalidEvent from "../_components/invalid-event";

type Props = {
    params: { id: string };
};

const RegisterPage = async ({ params }: Props) => {
    let id = Number(params.id);

    if (!params.id || isNaN(id)) return <InvalidEvent />;
    const event = await db.event.findUnique({ where: { id, deleted: false } });

    if (!event) return <InvalidEvent />;

    // todo if registration is allowed na

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
        <div className="flex flex-col py-20 lg:flex-row min-h-screen w-full justify-center">
            <p>{event.title}</p>
        </div>
    );
};

export default RegisterPage;
