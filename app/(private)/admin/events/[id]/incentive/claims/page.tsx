import React from "react";
import { allowed } from "@/lib/utils";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { eventIdSchema } from "@/validation-schema/commons";

type Props = { params: { id: number } };

const ClaimsPage = async ({ params }: Props) => {
    const user = await currentUserOrThrowAuthError();

    if (!allowed(["root", "admin"], user.role))
        throw new Error("You don't have access to this page");

    const eventId = eventIdSchema.parse(params.id);

    return (
        <div className="flex px-4 min-h-screen flex-col w-full">
            Claims Page
        </div>
    );
};

export default ClaimsPage;
