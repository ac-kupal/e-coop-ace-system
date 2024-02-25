import { EventAttendees } from "@prisma/client";

export type TMemberAttendees = EventAttendees


export type TMemberAttendeesMinimalInfo = {
                firstName: string,
                middleName: string,
                lastName: string,
                contact: string,
                picture: string | undefined,
                registered: boolean,
                voted: boolean
}
