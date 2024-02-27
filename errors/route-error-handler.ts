import { ZodError } from "zod";
import { AuthenticationError } from "./auth-error";
import { NextResponse } from "next/server";
import { pathName } from "@/lib/server-utils";
import { Prisma } from "@prisma/client";

export const routeErrorHandler = (e: unknown, method: string) => {
   if (e instanceof ZodError)
      return NextResponse.json(
         { message: e.errors[0].message },
         { status: 400 }
      );
   if (e instanceof AuthenticationError)
      return NextResponse.json({ message: e.message }, { status: 403 });
   
      if(e instanceof Prisma.PrismaClientKnownRequestError){
         if (e.code === "P2002") return NextResponse.json({ message : "User with that email already exist" }, {status : 409})
     }
      
   console.error(`ERROR : ${pathName()} - [${method}]: ${e}`);
   return NextResponse.json({ message: `${e}` }, { status: 500 });
};
