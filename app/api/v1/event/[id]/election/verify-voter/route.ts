import { routeErrorHandler } from "@/errors/route-error-handler";
import { eventIdParamSchema } from "@/validation-schema/event-registration-voting";
import { NextRequest } from "next/server";

type TParams = { params: { id: number } };

export const GET = async (req: NextRequest, { params }: TParams) => {
    try {
        const eventId = eventIdParamSchema.parse(params.id)
        const data = 



    } catch (e) {
        routeErrorHandler(e, req.method);
    }
};
