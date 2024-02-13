import { withAuth } from "next-auth/middleware";
import { currentUserOrFalse, getServerAuthSession } from "./lib/auth";
import { getSession } from "next-auth/react";
import { NextRequest } from "next/server";

export default withAuth((req : NextRequest)=>{
    const { nextUrl } = req;

})

export const config = {
    matcher: ["/admin/:path*"],
}