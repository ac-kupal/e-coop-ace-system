import { Incentives } from "@prisma/client";

export type TIncentive = Incentives;

export type TIncentiveWithClaimAndAssignedCount = TIncentive & { _count : { claimed : number, assigned : number } }  
