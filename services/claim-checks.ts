import { TMemberAttendeesMinimalInfo } from "@/types";
import { ClaimRequirements } from "@prisma/client";

export const isSatisfiedClaimRequirements = (requirement : ClaimRequirements, member : TMemberAttendeesMinimalInfo) => {
    if(requirement === "REGISTERED" && !member.registered) return false;
    if(requirement === "REGISTERED_VOTED" && !member.voted && !member.registered) return false;
    if(requirement === "VOTED" && !member.voted) return false;
    
    return true;
}