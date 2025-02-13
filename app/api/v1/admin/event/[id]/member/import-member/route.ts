import { routeErrorHandler } from "@/errors/route-error-handler";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { ExcelDateToJSDate, generateOTP, validateId } from "@/lib/server-utils";
import { createManySchema } from "@/validation-schema/member";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/database";
import { gender } from "@prisma/client";
import { register } from "module";

type MemberData = {
    firstName: string;
    lastName: string;
    middleName: string;
    passbookNumber: string;
    createdBy: number;
    birthday?: Date;
    eventId: number;
    emailAddress?: string;
    contact?: string;
    voteOtp: string;
    gender: gender
    registered:boolean
};

type FilteredMembers = {
    duplicatesOnNewImport: MemberData[];
    newMembers: MemberData[];
    skippedMembers: MemberData[];
};

const mapAndFilterDuplicates = (membersData: any[], user: { id: number }, id: number): FilteredMembers => {
    const modifiedMembersData: MemberData[] = membersData.map((member: any) => ({
        ...member,
        firstName: member.firstName ?? "",
        lastName: member.lastName ?? "",
        middleName: member.middleName?.toString() ?? "",
        gender:member.gender === "M" || member.gender === "Male" ? "Male" : "Female",
        passbookNumber: member.passbookNumber?.toString() ?? generateOTP(6),
        createdBy: user.id,
        birthday: member.birthday ? ExcelDateToJSDate(member.birthday) : undefined,
        eventId: id,
        emailAddress: member.emailAddress ?? "",
        contact: member.contact?.toString() ?? "",
        voteOtp: generateOTP(6),
        registered:member.registered === "" || member.registered.toLowerCase().trim() === "yes"
    }));


    const passbookMap = new Map<string | undefined, boolean>();
    const duplicates: MemberData[] = [];
    const newMembers: MemberData[] = [];

    modifiedMembersData.forEach((member) => {
        const passbookNumber = member.passbookNumber;
        if (passbookMap.has(passbookNumber)) {
            duplicates.push(member);
        } else {
            passbookMap.set(passbookNumber, true);
            newMembers.push(member);
        }
    });

    return { duplicatesOnNewImport: duplicates, newMembers, skippedMembers: [] };
};

const fetchOldMembers = async (id: number) => {
    return await db.eventAttendees.findMany({
        where: {
            eventId: id,
        },
    });
};

const filterUniqueMembers = (newMembers: MemberData[], oldMembers: any[]) => {
    const filteredMembers = newMembers.filter((newMember) => {
        return !oldMembers.some((oldMember: any) => oldMember.passbookNumber === newMember.passbookNumber);
    });

    const skippedMembers = newMembers.filter((newMember) => {
        return oldMembers.some((oldMember: any) => oldMember.passbookNumber === newMember.passbookNumber);
    });

    return { filteredMembers, skippedMembers };
};

export const POST = async (req: NextRequest, { params }: { params: { id: number } }) => {
    try {
        const id = Number(params.id);
        validateId(id);
        const user = await currentUserOrThrowAuthError();
        const membersData = await req.json();

        const { duplicatesOnNewImport, newMembers } = mapAndFilterDuplicates(membersData, user, id);
        const oldMembers = await fetchOldMembers(id);
        const { filteredMembers, skippedMembers } = filterUniqueMembers(newMembers, oldMembers);

        filteredMembers.forEach((member: MemberData) => {
            createManySchema.parse(member);
        });

        await db.eventAttendees.createMany({
            data: filteredMembers,
            skipDuplicates: true,
        });

        const Members = {
            duplicationOnFirstImport: duplicatesOnNewImport,
            newMembers: filteredMembers,
            skippedMembers:[...duplicatesOnNewImport, ...skippedMembers]
        };

        return NextResponse.json(Members);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};
