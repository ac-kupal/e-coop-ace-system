import React from "react";

import InvalidPrompt from "@/components/invalid-prompt";
import EventSettings from "./_components/event-settings";

import { eventIdParamSchema } from "@/validation-schema/api-params";

type Props = { params: { id: number } };

const Page = ({ params }: Props) => {
    const validatedId = eventIdParamSchema.safeParse(params);

    if (!validatedId.success)
        return <InvalidPrompt message="Event id seem's to be invalid" />;

    return (
        <div className="flex p-4 min-h-screen flex-col w-full">
            <EventSettings eventId={validatedId.data.id}/>
        </div>
    );
};

export default Page;
