import React from "react";
import { allowed } from "@/lib/utils";
import { currentUserOrFalse, currentUserOrThrowAuthError } from "@/lib/auth";
import IncentivesTable from "./_components/incentives-table";
import { eventIdSchema } from "@/validation-schema/commons";
import InvalidPrompt from "@/components/invalid-prompt";

type Props = { params: { id: number } };

const Branches = async ({ params }: Props) => {
    const user = await currentUserOrFalse();

    if (!user || !allowed(["root", "admin"], user.role))
        return (
            <div className="flex px-4 min-h-screen flex-col w-full">
                <InvalidPrompt message="You don't have rights to view this page" />
            </div>
        );

    const eventId = eventIdSchema.parse(params.id);

    return (
        <div className="flex px-4 min-h-screen flex-col w-full">
            <IncentivesTable eventId={eventId} />
        </div>
    );
};

export default Branches;
