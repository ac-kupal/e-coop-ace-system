import { UserRoleAssigned } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  roles : UserRoleAssigned[]
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}