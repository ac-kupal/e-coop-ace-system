import { $Enums } from "@prisma/client"
export type TCreateElection = {
     electionName: string;
     status: $Enums.ElectionStatus;
}
