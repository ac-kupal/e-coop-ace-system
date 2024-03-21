import { user } from "next-auth";
import { Role } from "@prisma/client";
import { twMerge } from "tailwind-merge"
import { type ClassValue, clsx } from "clsx"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const isAllowed = (roleAllowed: Role[], user : user | false | null | undefined ) => {
    if(!user) return false;
    return roleAllowed.includes(user.role);
};