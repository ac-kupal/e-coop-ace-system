"use client"
import React from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'

type Props = {
    title : string,
    path : string,
    eventId : number
}

const NavItem = ({ title, path, eventId }: Props) => {
    const pathName = usePathname();

    const isHere = pathName.endsWith(path)

  return (
    <Link className={cn("bg-secondary text-sm px-3 py-2 rounded-full", isHere && "bg-background")} href={`/admin/events/${eventId}/incentive/${path}`}>{title}</Link>
  )
}

export default NavItem