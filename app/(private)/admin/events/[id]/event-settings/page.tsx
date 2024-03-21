import React from "react";

import InvalidPrompt from "@/components/invalid-prompt";
import EventSettings from "./_components/event-settings";

import { eventIdParamSchema } from "@/validation-schema/api-params";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { Role } from "@prisma/client";
import NotAllowed from "../_components/not-allowed";

type Props = { params: { id: number } };

const Page =async ({ params }: Props) => {
    const user =await currentUserOrThrowAuthError()
    const validatedId = eventIdParamSchema.safeParse(params);

    if (!validatedId.success)
        return <InvalidPrompt message="Event id seem's to be invalid" />;

    if(user.role === Role.staff) return <NotAllowed></NotAllowed>

    return (
        <div className="flex p-4 min-h-screen flex-col w-full">
            <EventSettings eventId={validatedId.data.id}/>
        </div>
    );
};

export default Page;
