import { NextRequest, NextResponse } from "next/server";
import { createEventSchema } from "@/validation-schema/event";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { createElectionValidation } from "@/validation-schema/election";
import { ElectionStatus, Role, VotingEligibility } from "@prisma/client";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import db from "@/lib/database";
export const POST = async (req: NextRequest) => {
    try {
        const { data } = await req.json();

        const user = await currentUserOrThrowAuthError();
        // Determine if the event includes an election
        const includeElection = !!data.electionName;

        //not so good na approach, will refactor it the soonest
        const election = includeElection
            ? { electionName: data.electionName, status: ElectionStatus.pending }
            : { electionName: "", status: ElectionStatus.pending };

        // Validate input data
        createEventSchema.parse(data);
        if (includeElection) {
            createElectionValidation.parse(election);
        }
        const CreateEvent = await db.event.create({
            data: includeElection
                ? {
                    title: data.title,
                    description: data.description,
                    date: data.date,
                    location: data.location,
                    category: data.category,
                    deleted: false,
                    branchId: user.branchId,
                    coverImage: data.coverImage,
                    election: {
                        create: {
                            electionName: election.electionName,
                            status: election.status,
                            branchId: user.branchId,
                            voteEligibility: VotingEligibility.MIGS,
                            createdBy: user.id,
                        },
                    },
                    createdBy: user.id,
                }
                : {
                    title: data.title,
                    description: data.description,
                    date: data.date,
                    location: data.location,
                    category: data.category,

                    branchId: user.branchId,
                    deleted: false,
                    coverImage: data.coverImage,
                    createdBy: user.id,
                },
            include: {
                election: true,
            },
        });
        return NextResponse.json(CreateEvent);
    } catch (e) {
        console.log(e);
        return routeErrorHandler(e, req);
    }
};

export const GET = async (req: NextRequest) => {
    try {
        const currentUser = await currentUserOrThrowAuthError();

        const conditions = ([Role.root, Role.coop_root] as Role[]).includes(
            currentUser.role,
        )
            ? {}
            : { branchId: currentUser.branchId };

        const getAllEvents = await db.event.findMany({
            where: {
                deleted: false,
                ...conditions,
            },
            orderBy: { createdAt: "desc" },
            select: {
                id: true,
                title: true,
                description: true,
                location: true,
                category: true,
                date: true,
                election: true,
                coverImage: true,
            },
        });
        return NextResponse.json(getAllEvents);
    } catch (e) {
        return routeErrorHandler(e, req);
    }
};
