import db from "@/lib/database";
import { eventIdParamSchema } from "@/validation-schema/commons";
import React from "react";
import InvalidElection from "../../_components/invalid-election";
import { CheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Props = {
  params: { id: number };
};

const CompletePage = async ({ params }: Props) => {
  const validateParam = eventIdParamSchema.safeParse(params.id);

  if (!validateParam.success)
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh">
        <InvalidElection message={validateParam.error.issues[0].message} />
      </div>
    );

  const election = await db.election.findUnique({
    where: { eventId: validateParam.data },
    include: { event: true },
  });

  if (!election)
    return (
      <div className="flex flex-col items-center justify-center min-h-dvh">
        <InvalidElection message="Election was not found" />
      </div>
    );

  return (
    <div className="flex flex-col items-center min-h-dvh">
      <div className="w-full flex-1 bg-background px-8 gap-y-8 py-24 max-w-4xl flex flex-col items-center">
        <div className="relative overflow-clip w-full">
          <img
            className="object-cover w-full rounded-xl max-h-[400px] "
            src={election.event.coverImage as ""}
          />
          <div className="absolute w-full flex items-center bottom-0 left-0 py-8 px-4 bg-gradient-to-t  from-background to-transparent">
            <h1 className="text-4xl dark:text-[#e7e0fb]">
              {election.event.title}
            </h1>
          </div>
        </div>

        <div className="rounded-full bg-secondary text-green-400 border border-green-500 p-4">
          <CheckIcon className="size-5" />
        </div>

        <p className="text-lg">Thank you for voting 🥳</p>
        <p className="text-foreground/80">
          Your vote has been saved & the copy of your vote has been sent to your
          email.
        </p>
        <Link
          className=""
          href={`/events/${election.eventId}`}
        >
          <Button size="sm">Return to Event</Button>
        </Link>
      </div>
    </div>
  );
};

export default CompletePage;
