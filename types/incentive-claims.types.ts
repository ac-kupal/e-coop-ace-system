import { IncentiveClaims } from "@prisma/client";
import { TIncentive } from "./incentive.types";
import { TIncentiveAssignedWithUserMinimalInfo } from "./incentive-assigned.types";

export type TIncentiveClaims = IncentiveClaims;

export type TIncentiveClaimsWithIncentiveAndClaimAssistance = TIncentiveClaims & {
    assigned : TIncentiveAssignedWithUserMinimalInfo | null,
    incentive : TIncentive 
}