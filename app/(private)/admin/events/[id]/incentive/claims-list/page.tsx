import React from "react";
import { isAllowed } from "@/lib/utils";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { eventIdSchema } from "@/validation-schema/commons";
import ClaimListTable from "./_components/claim-list-table";

type Props = { params: { id: number } };

const ClaimsPage = async ({ params }: Props) => {
    const user = await currentUserOrThrowAuthError();

    if (!isAllowed(["root", "admin", "staff"], user))
        throw new Error("You don't have access to this page");

    const eventId = eventIdSchema.parse(params.id);

    return (
        <div className="flex px-4 min-h-screen flex-col w-full">
            <ClaimListTable eventId={eventId} />
        </div>
    );
};

export default ClaimsPage;
