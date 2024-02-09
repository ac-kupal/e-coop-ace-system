import { Branch, User, UserRoleAssigned } from "@prisma/client";

export type userType = User

export type userTypeWithBranch = userType & { branch : Branch }

export type userTypeWithRoles = userType & { roles : UserRoleAssigned[] }

export type userTypeWithBranchAndRoles = userTypeWithBranch & userTypeWithRoles;