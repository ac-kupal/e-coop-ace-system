import React from "react";

import InvalidPrompt from "@/components/invalid-prompt";
import EventSettings from "./_components/event-settings";

import { eventIdParamSchema } from "@/validation-schema/api-params";
import { currentUserOrFalse, currentUserOrThrowAuthError } from "@/lib/auth";
import { Role } from "@prisma/client";
import NotAllowed from "../_components/not-allowed";
import { isAllowed } from "@/lib/utils";

type Props = { params: { id: number } };

const Page =async ({ params }: Props) => {
    const validatedId = eventIdParamSchema.safeParse(params);

    if (!validatedId.success)
        return <InvalidPrompt message="Event id seem's to be invalid" />;

        const user = await currentUserOrFalse();

        if (!isAllowed(["root", "admin", "coop_root"], user)) return <NotAllowed></NotAllowed>

    return (
        <div className="flex p-4 min-h-screen flex-col w-full">
            <EventSettings eventId={validatedId.data.id}/>
        </div>
    );
};

export default Page;
