import React from 'react'

import AttendanceTable from './_components/attendance-table';

import { allowed } from '@/lib/utils';
import { currentUserOrThrowAuthError } from '@/lib/auth';
import { eventIdSchema } from '@/validation-schema/commons';

type Props = { params : { id : number }};

const AttendancePage = async ({ params } : Props) => {
  const user = await currentUserOrThrowAuthError();

  if (!allowed(["root", "admin", "staff"], user.role))
    throw new Error("You don't have access to this page");

  const eventId = eventIdSchema.parse(params.id);

  return (
    <div className="flex p-4 min-h-screen flex-col w-full">
      <AttendanceTable eventId={eventId}/>
    </div>
  );
};

export default AttendancePage;