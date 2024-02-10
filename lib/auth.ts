import type { GetServerSidePropsContext } from "next";
import CredentialsProvider from "next-auth/providers/credentials";
import { DefaultUser, getServerSession, type NextAuthOptions } from "next-auth";

import { getUserWithoutPassword } from "@/services/user";
import { login } from "@/services/auth";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "Email",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const user = await login(credentials as any);
                return user as {} as DefaultUser;
            },
        }),
    ],
    pages: {
        signIn: "/auth",
    },
    session: {
        strategy: "jwt",
        maxAge: 28000,
    },
    jwt: {
        maxAge: 28000,
    },
    callbacks: {
        async signIn({ user }) {
            const fetchUserData = getUserWithoutPassword(user.email as string);
            if (!fetchUserData) return false;
            return true;
        },
        async session({ session, token}) {
            const fetchUserData = await getUserWithoutPassword(session.user.email);
            if(fetchUserData) session.user = fetchUserData

            return session;
        },
    },
};

export const getServerAuthSession = (ctx: {
    req: GetServerSidePropsContext["req"];
    res: GetServerSidePropsContext["res"];
}) => getServerSession(ctx.req, ctx.res, authOptions);

export const currentUser = async () => {
    const session = await getServerSession(authOptions);
    if (!session) return null;
    return session;
};
