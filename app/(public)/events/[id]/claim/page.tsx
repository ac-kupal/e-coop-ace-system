import React from "react";

import InvalidPrompt from "@/components/invalid-prompt";
import { eventIdParamSchema } from "@/validation-schema/api-params";
import ClaimHome from "./_components/claim-home";

type Props = {
    params: { id: number };
};

const ClaimPage = ({ params }: Props) => {
    const validatedEventId = eventIdParamSchema.safeParse(params);

    if (!validatedEventId.success)
        return <InvalidPrompt message="This election id is invalid" />;

    return <ClaimHome eventId={validatedEventId.data.id} />
};

export default ClaimPage;
