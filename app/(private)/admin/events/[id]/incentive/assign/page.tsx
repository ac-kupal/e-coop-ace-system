import React from "react";
import { allowed } from "@/lib/utils";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { eventIdSchema } from "@/validation-schema/commons";
import IncentiveAssigneeTable from "./_components/incentive-assignee-table";

type Props = { params: { id: number } };

const AssignPage = async ({ params }: Props) => {
    const user = await currentUserOrThrowAuthError();

    if (!allowed(["root", "admin"], user.role))
        throw new Error("You don't have access to this page");

    const eventId = eventIdSchema.parse(params.id);

    return (
        <div className="flex px-4 min-h-screen flex-col w-full">
            <IncentiveAssigneeTable eventId={eventId} />
        </div>
    );
};

export default AssignPage;
