import z from "zod"
import db from "@/lib/database"

import { emailSchema } from "@/validation-schema/auth"

export const hasRoot = async () => {
    return db.user.findFirst({ where : {
        roles : {
            some : {
                role : {
                    equals : "root"
                }
            }
        }
    }})
}

export const findUserByEmail = async ( email : z.infer<typeof emailSchema>) => {
    return db.user.findUnique({ where : { email }})
}