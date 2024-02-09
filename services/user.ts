import z from "zod";
import db from "@/lib/database";

import { emailSchema } from "@/validation-schema/auth";

export const hasRoot = async () => {
    return db.user.findFirst({
        where: {
            roles: {
                some: {
                    role: {
                        equals: "root",
                    },
                },
            },
        },
    });
};

export const findUserByEmail = async (email: z.infer<typeof emailSchema>) => {
    return db.user.findUnique({ where: { email } });
};

export const getUserWithoutPassword = async (email : string) => {
    return db.user.findUnique({
        where: { email },
        select: {
            id: true,
            email: true,
            verified: true,
            branch: true,
            branchId: true,
            createdAt: true,
            createdBy: true,
            dateVerified: true,
            deleted: true,
            deletedAt: true,
            deletedBy: true,
            name: true,
            roles: true,
            updatedAt: true,
            updatedBy: true,
        },
    });
};
