import React from 'react'
import BranchesTable from './_components/branches-table'

type Props = {}

const Branches = (props: Props) => {  
  return (
    <div className="flex p-2 min-h-screen flex-col w-full">
        <BranchesTable />
    </div>
  )
}

export default Branches