import { withAuth } from "next-auth/middleware";

export default withAuth((req)=>{
    const { nextUrl } = req;
})

export const config = {
    matcher: ["/admin/:path*"],
}