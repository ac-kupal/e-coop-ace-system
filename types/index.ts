import z from "zod"
import { Role } from "@prisma/client";
import { ReactElement, ReactNode } from "react";
import { folderGroupSchema } from "@/validation-schema/upload";

export * from "./user.types"
export * from "./branch.types"

export type TApiError = { message: string };

export type TRoute = {
    icon : ReactNode | ReactElement ;
    name: string;
    path : string;
    allowedRole: Role[];
};

export type TElectionRoute = {
    icon : ReactNode | ReactElement ;
    name: string;
    path : string;
};



export type TFolderUploadGroups = z.infer<typeof folderGroupSchema>