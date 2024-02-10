import { Branch, User, UserRoleAssigned } from "@prisma/client";

export type TUser = User

export type TUserWithBranch = TUser & { branch : Branch }

export type TUserWithRoles = TUser & { roles : UserRoleAssigned[] }

export type TUserWithBranchAndRoles = TUserWithBranch & TUserWithRoles;