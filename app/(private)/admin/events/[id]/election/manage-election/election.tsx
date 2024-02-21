"use client"
import { TElection } from '@/types'
import React from 'react'

type Props={
   election:TElection | null
}

const ManageElection = ({election}:Props) => {
return (
    <div>
     <h1>{election?.electionName}</h1>
    </div>
  )
}

export default ManageElection