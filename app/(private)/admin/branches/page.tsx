import React from 'react'
import BranchesTable from './_components/branches-table'
import { currentUserOrThrowAuthError } from '@/lib/auth';
import { allowed } from '@/lib/utils';

type Props = {}

const Branches = async(props: Props) => {  
    const user = await currentUserOrThrowAuthError();

    if (!allowed(["root", "admin"], user.role)) throw new Error("You don't have access to this page")

  return (
    <div className="flex p-2 min-h-screen flex-col w-full">
        <BranchesTable />
    </div>
  )
}

export default Branches