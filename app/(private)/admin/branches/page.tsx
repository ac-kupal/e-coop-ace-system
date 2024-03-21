import React from 'react'

import BranchesTable from './_components/branches-table'

import { isAllowed } from '@/lib/utils';
import { currentUserOrFalse } from '@/lib/auth';

type Props = {}

const Branches = async(props: Props) => {  
    const user = await currentUserOrFalse();

    if (!isAllowed(["root", "coop_root"], user)) throw new Error("You don't have access to this page")

  return (
    <div className="flex p-4 min-h-screen flex-col w-full">
        <BranchesTable />
    </div>
  )
}

export default Branches
