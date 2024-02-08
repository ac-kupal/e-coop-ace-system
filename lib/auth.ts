import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import { User, getServerSession, type NextAuthOptions } from "next-auth";
import type { GetServerSidePropsContext } from "next";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            // TODO: Gmail account from tita
            clientId: process.env.GOOGLE_ID as string,
            clientSecret: process.env.GOOGLE_SECRET as string, 
        }),
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
                // TODO: Todo later after finalize ERD model for user table
                // TODO: Do module augmentation

                return { } as User
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge : 28000
    },
    jwt : {
       maxAge : 28000
    },
    callbacks: {
        async signIn({ user }) {
            // TODO: After prisma model created

            return true;
        },
        async jwt({ token }) {
            // TODO: After prisma model created
            
            return token;
        },
        async session({ session, token }) {
            // TODO: After prisma model created
            
            return session;
        },
    },
};

export const getServerAuthSession = (ctx: {
    req: GetServerSidePropsContext["req"];
    res: GetServerSidePropsContext["res"];
}) => {
    return getServerSession(ctx.req, ctx.res, authOptions);
};