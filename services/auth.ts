import { loginSchema } from "@/validation-schema/auth"
import z from "zod"
import { findUserByEmail, getUserWithoutPassword } from "./user";
import { matchPassword } from "@/lib/server-utils";


export const login = async( credentials : z.infer<typeof loginSchema>) => {
    if(!credentials) throw new Error("Invalid credentials")

    const validated = loginSchema.safeParse(credentials);

    if(!validated.success) return null;

    const { email, password } = validated.data; 
    
    const user = await findUserByEmail(email)
    
    if(!user) throw new Error("User doesn't exist")

    const isPasswordCorrect = await matchPassword(password, user?.password )

    if(!isPasswordCorrect) throw new Error("Invalid credentials")

    const userData = await getUserWithoutPassword(user.email)

    return userData
}