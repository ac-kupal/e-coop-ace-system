import { Branch, User } from "@prisma/client";

export type TUser = Omit<User, 'password'>

export type TUserWithBranch = TUser & { branch : Branch }

export type TUserMinimalInfo = TUser | {
    id : number,
    picture : string | null,
    name : string,
    email : string,
}