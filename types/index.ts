import { Role } from "@prisma/client";
import { ReactElement, ReactNode } from "react";

export * from "./user.types"
export * from "./branch.types"
export * from "./bucket.types"

export type TApiError = { message: string };

export type TRoute = {
    icon : ReactNode | ReactElement ;
    name: string;
    path : string;
    allowedRole: Role[];
};
