import React from "react";

import RegisterHome from "./_components/register-home";
import InvalidPrompt from "../_components/invalid-prompt";

import { eventIdParamSchema } from "@/validation-schema/api-params";

type Props = { params: { id: string } };

const RegisterPage = async ({ params }: Props) => {
    const validatedEventId = eventIdParamSchema.safeParse(params);

    if (!validatedEventId.success)
        return <InvalidPrompt message="This event id is invalid" />;

    return <RegisterHome eventId={validatedEventId.data.id} />;
};

export default RegisterPage;
