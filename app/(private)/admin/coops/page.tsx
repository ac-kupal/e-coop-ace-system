import React from 'react'
import CoopsTable from './_components/coops-table'
import { currentUserOrThrowAuthError } from '@/lib/auth';
import { allowed } from '@/lib/utils';

type Props = {}

const Branches = async(props: Props) => {  
    const user = await currentUserOrThrowAuthError();

    if (!allowed(["root"], user.role)) throw new Error("You don't have access to this page")

  return (
    <div className="flex p-4 min-h-screen flex-col w-full">
        <CoopsTable />
    </div>
  )
}

export default Branches
