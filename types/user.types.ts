import { Branch, User } from "@prisma/client";

export type TUser = Omit<User, 'password'>

export type TUserWithBranch = TUser & { branch : Branch }