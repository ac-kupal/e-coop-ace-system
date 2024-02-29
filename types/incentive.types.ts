import { Incentives } from "@prisma/client";

export type TIncentive = Incentives;

export type TIncentiveWithClaimCount = TIncentive & { _count : { claimed : number } }  
