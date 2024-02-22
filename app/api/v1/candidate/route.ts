import db from "@/lib/database";
import { NextRequest, NextResponse } from "next/server";
import { routeErrorHandler } from "@/errors/route-error-handler";
import { TCreateCandidate } from "@/types";
import { createCandidateSchema } from "@/validation-schema/candidate";

export const POST = async (req: NextRequest) => {
   try {
      const candidate: TCreateCandidate = await req.json();
      createCandidateSchema.parse(candidate);
      const createPosition = await db.candidate.create({
         data: {
            firstName: candidate.firstName,
            lastName: candidate.lastName,
            passbookNumber: candidate.passbookNumber,
            picture: candidate.picture,
            election: {
               connect: {
                  id: candidate.electionId,
               },
            },
            position: {
               connect: {
                  id: candidate.positionId,
               },
            },
         },
      });
      return NextResponse.json(createPosition);
   } catch (error) {
      return routeErrorHandler(error, req.method);
   }
};

export const GET = async (req: NextRequest) => {
   try {
      const getAllCandidate = await db.candidate.findMany({});
      return NextResponse.json(getAllCandidate);
   } catch (error) {
      return routeErrorHandler(error, req.method);
   }
};

export const PATCH = async (req: NextRequest) => {
   return NextResponse.json({ message: "PATCH - ok" });
};

export const DELETE = async (req: NextRequest) => {
   return NextResponse.json({ message: "DELETE - ok" });
};
