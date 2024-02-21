import React from 'react'
import Election from '../_components/election'

const page = ({ params }: { params: { id: number } }) => {
  return (
    <div>
        <h1 className="text-2xl font-semibold">Manage Dashboard</h1>
         <Election id={params.id}></Election>
    </div>
  )
}

export default page