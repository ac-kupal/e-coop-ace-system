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
            name: true,
            picture : true,
            email: true,
            roles: true,
            
            branchId: true,
            branch: true,

            verified: true,
            dateVerified: true,

            createdAt: true,
            createdBy: true,
            deleted: true,
            deletedAt: true,
            deletedBy: true,
            updatedAt: true,
            updatedBy: true,
        },
    });
};
