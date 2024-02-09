import { Role } from "@prisma/client";
import { ReactElement, ReactNode } from "react";

export type ApiErr = { message: string };

export type routeType = {
    icon : ReactNode | ReactElement ;
    name: string;
    path : string;
    allowedRole: Role[];
};
