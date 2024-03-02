import { routeErrorHandler } from "@/errors/route-error-handler";
import { validateId } from "@/lib/server-utils";
import { NextRequest, NextResponse } from "next/server"
import { getElection } from "@/services/election";

type TParams = { params: { id: number } };

export const GET = async (req: NextRequest, { params }: TParams) => {
    try {
       const id = Number(params.id);
       validateId(id);
       const getUniqueElection = await getElection(id);
       return NextResponse.json(getUniqueElection);
    } catch (e) {
       console.log(e);
       return routeErrorHandler(e, req);
    }
 };
 