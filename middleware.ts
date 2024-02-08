import { withAuth } from "next-auth/middleware";

export default withAuth((req)=>{
    const { nextUrl } = req;
    console.log("auth", req.nextauth.token)
})

export const config = {
    matcher: ["/admin"],
}