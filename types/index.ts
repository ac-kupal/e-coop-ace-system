import z from "zod";
import { Role } from "@prisma/client";
import { ReactElement, ReactNode } from "react";
import { folderGroupSchema } from "@/validation-schema/upload";

export * from "./user.types";
export * from "./branch.types";
export * from "./event.types";
export * from "./election.types";
export * from "./position.types";
export * from "./candidate.types";
export * from "./member-attendees.types";
export * from "./member.types";
export * from "./incentive.types";
export * from "./incentive-claims.types";
export * from "./mail-template.types";
export * from "./election-settings.types";
export * from "./incentive-assigned.types";
export * from "./vote.types"

export type TApiError = { message: string };

export type TRoute = {
    icon: ReactNode | ReactElement;
    name: string;
    path: string;
    allowedRole: Role[];
};

export type TNavListRoute = {
    icon: ReactNode | ReactElement;
    name: string;
    path: string;
};

export type TFolderUploadGroups = z.infer<typeof folderGroupSchema>;

export type TVoteAuthorizationPayload = {
    eventId: number;
    electionId: number;
    attendeeId: string;
    passbookNumber: string;
    assisted? : boolean;
};
