import { ZodError } from "zod";
import { AuthenticationError } from "./auth-error";
import { NextResponse } from "next/server";
import { pathName } from "@/lib/server-utils";

export const routeErrorHandler = (e: unknown, method: string) => {
    if (e instanceof ZodError) 
        return NextResponse.json(
            { message: e.errors[0].message },
            { status: 400 }
        );
     console.log(`ERROR : ${pathName()} - [${method}]: ${e}`)
    if (e instanceof AuthenticationError) 
        return NextResponse.json({ message: e.message }, { status: 403 });
    

    console.error(`ERROR : ${pathName()} - [${method}]: ${e}`);
    return NextResponse.json({ message: `${e}` }, { status: 500 });
};
