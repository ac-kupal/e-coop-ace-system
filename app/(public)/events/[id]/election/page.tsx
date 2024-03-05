import React from "react";

import InvalidElection from "@/components/invalid-prompt";
import { eventIdParamSchema } from "@/validation-schema/api-params";
import ElectionHome from "./_components/election-home";

type Props = {
    params: { id: number };
};

const ElectionVerifyPage = ({ params }: Props) => {
    const validatedEventId = eventIdParamSchema.safeParse(params);

    if (!validatedEventId.success)
        return <InvalidElection message="This election id is invalid" />;

    return <ElectionHome eventId={validatedEventId.data.id} />
};

export default ElectionVerifyPage;
