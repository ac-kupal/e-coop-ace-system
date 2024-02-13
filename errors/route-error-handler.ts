import { ZodError } from "zod";
import { AuthenticationError } from "./auth-error";
import { NextResponse } from "next/server";

export const routeErrorHandler = (e: unknown, method: string,path:string) => {
   if (e instanceof ZodError) {
      console.error(`ERROR : ${path} - [${method}]: ${e.message}`);
      return NextResponse.json({ message: e.errors[0].message }, { status: 400 });
   }
   if (e instanceof AuthenticationError) {
      console.error(`ERROR : ${path} - [${method}]: ${e}`);
      return NextResponse.json({ message: e.message }, { status: 403 });
   } else {
      console.error(`ERROR : ${path} - [${method}]: ${e}`);
      return NextResponse.json({ message: `${e}` }, { status: 500 });
   }
};
