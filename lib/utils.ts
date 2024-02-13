import { Role } from "@prisma/client";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const allowed = (roleAllowed: Role[], userRole: Role) => {
    return roleAllowed.includes(userRole);
};