import { $Enums, Election } from "@prisma/client"
export type TElection = {
     id: number;
     e_name: string;
     startDate: Date;
     endDate: Date;
     status: $Enums.ElectionStatus;
     eventId: number | null;
}
