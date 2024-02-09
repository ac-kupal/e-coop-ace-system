"use client";
import React from "react";
import { user } from "next-auth";
import { usePathname } from "next/navigation";

import { routeType } from "@/types";
import Link from "next/link";

type Props = {
    currentUser: user;
    route: routeType;
};

const RouteItem = ({ currentUser, route }: Props) => {
    const { icon, name, path, allowedRole } = route;

    const pathname = usePathname();
    const isCurrentPath = pathname.startsWith(path);

    const authorized = () => {
        for (const role of currentUser.roles) {
            if (allowedRole.includes(role.role)) return true;
        }
        return false;
    };

    if (!authorized()) return null;

    return (
        <Link
            href={path}
            className="flex px-6 py-2 bg-foreground rounded-full text-background items-center gap-x-3"
        >
            {icon}
            <p>{name}</p>
        </Link>
    );
};

export default RouteItem;
