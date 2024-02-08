import type { GetServerSidePropsContext } from "next";
// import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { getServerSession, type NextAuthOptions } from "next-auth";

import { matchPassword } from "./server-utils";
import { findUserByEmail } from "@/services/user";
import { loginSchema } from "@/validation-schema/auth";

export const authOptions: NextAuthOptions = {
    providers: [
        // GoogleProvider({
        // TODO: Gmail account from tita
        //     clientId: process.env.GOOGLE_ID as string,
        //     clientSecret: process.env.GOOGLE_SECRET as string,
        // }),
        CredentialsProvider({
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "Email",
                },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials, req) {
                // TODO: Todo later after finalize ERD model for user table
                // TODO: Do module augmentation

                if(!credentials) return null;

                const validated = loginSchema.safeParse(credentials);

                if(!validated.success) return null;

                const { email, password } = validated.data; 
                
                const user = await findUserByEmail(email)
                
                if(!user) throw new Error("User doesn't exist")

                const isPasswordCorrect = await matchPassword(user?.password, password)

                if(isPasswordCorrect) return null;

                

                return {  };
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 28000,
    },
    jwt: {
        maxAge: 28000,
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
}) => getServerSession(ctx.req, ctx.res, authOptions);

export const currentUser = async () => {
    const session = await getServerSession(authOptions);
    if (!session) return null;
    return session;
};