import React from 'react'
import NavItem from './nav-item'

type Props = { eventId : number }

const incentiveRoutes = [
    {
        title : "Incentives",
        path : "incentives",
    },
    {
        title : "Assign",
        path : "assign"
    },
    {
        title : "Claims",
        path : "claims"
    }
]

const IncentiveNavigation = ({ eventId }: Props) => {

  return (
    <div className="flex gap-x-2 p-4">
        {
            incentiveRoutes.map((route)=> <NavItem eventId={eventId} key={route.path} {...route}/>)
        }
    </div>
  )
}

export default IncentiveNavigation