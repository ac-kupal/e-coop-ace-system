import { gender } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import db from "@/lib/database";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { createManySchema } from "@/validation-schema/member";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { ExcelDateToJSDate, generateOTP, validateId } from "@/lib/server-utils";
import { generateUserProfileS3URL } from "@/lib/aws-s3";

type MemberData = {
    firstName: string;
    lastName: string;
    middleName: string;
    passbookNumber: string;
    createdBy: number;
    birthday?: Date | undefined;
    eventId: number;
    emailAddress?: string;
    contact?: string;
    voteOtp: string;
    gender: gender;
    picture: string;
    registered: boolean;
};

type FilteredMembers = {
    duplicatesOnNewImport: MemberData[];
    newMembers: MemberData[];
    skippedMembers: MemberData[];
};

const parseRegistered = (value: unknown): boolean => {
    return (
        value === true ||
        (typeof value === "string" && value.trim().toLowerCase() === "yes")
    );
};

const mapAndFilterDuplicates = (
    membersData: any[],
    user: { id: number },
    id: number
): FilteredMembers => {
    const modifiedMembersData: MemberData[] = membersData.map(
        (
            member: Omit<MemberData, "registered"> & {
                registered: string | boolean;
            }
        ) => {
            const PBNo = member.passbookNumber
                ? String(member.passbookNumber)
                : generateOTP(6);

            return {
                ...member,
                firstName: member.firstName ?? "",
                lastName: member.lastName ?? "",
                middleName: member.middleName ? String(member.middleName) : "",
                gender:
                    (member.gender as string) === "M" ||
                    member.gender?.toLowerCase() === "male"
                        ? "Male"
                        : "Female",
                passbookNumber: PBNo,
                createdBy: user.id,
                birthday: member.birthday
                    ? ExcelDateToJSDate(member.birthday as unknown as string)
                    : undefined,
                eventId: id,

                emailAddress: member.emailAddress ?? "",
                contact: member.contact ? String(member.contact) : "",
                voteOtp: generateOTP(6),
                picture: generateUserProfileS3URL(PBNo),
                registered: parseRegistered(member.registered),
            };
        }
    );

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

    return {
        duplicatesOnNewImport: duplicates,
        newMembers,
        skippedMembers: [],
    };
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
        return !oldMembers.some(
            (oldMember: any) =>
                oldMember.passbookNumber === newMember.passbookNumber
        );
    });

    const skippedMembers = newMembers.filter((newMember) => {
        return oldMembers.some(
            (oldMember: any) =>
                oldMember.passbookNumber === newMember.passbookNumber
        );
    });

    return { filteredMembers, skippedMembers };
};

export const POST = async (
    req: NextRequest,
    { params }: { params: { id: number } }
) => {
    try {
        const id = Number(params.id);
        validateId(id);
        const user = await currentUserOrThrowAuthError();
        const membersData = await req.json();

        const { duplicatesOnNewImport, newMembers } = mapAndFilterDuplicates(
            membersData,
            user,
            id
        );
        const oldMembers = await fetchOldMembers(id);
        const { filteredMembers, skippedMembers } = filterUniqueMembers(
            newMembers,
            oldMembers
        );

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
            skippedMembers: [...duplicatesOnNewImport, ...skippedMembers],
        };

        return NextResponse.json(Members);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};
