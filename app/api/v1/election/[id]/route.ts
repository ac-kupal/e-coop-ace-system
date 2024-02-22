import { routeErrorHandler } from "@/errors/route-error-handler";
import { validateId } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server"
import { getEvent } from "../../event/_services/events";
import { handlePrivateRoute } from "../../hadle-private-route";
import { getElection } from "@/services/election";

type TParams = { params: { id: number } };

export const GET = async (req: NextRequest, { params }: TParams) => {
    try {
       await handlePrivateRoute()
       const id = Number(params.id);
       validateId(id);
       const getUniqueElection = await getElection(id);
       return NextResponse.json(getUniqueElection);
    } catch (e) {
       console.log(e);
       return routeErrorHandler(e, req.method);
    }
 };
 