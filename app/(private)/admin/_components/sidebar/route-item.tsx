"use client";
import React from "react";
import { user } from "next-auth";
import { usePathname } from "next/navigation";

import { routeType } from "@/types";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
            className={cn(
                "duration-200 group flex px-6 py-2 rounded-full items-center gap-x-3 hover:bg-secondary text-foreground",
                isCurrentPath && "text-background bg-foreground hover:bg-foreground"
            )}
        >
            <div className="w-fit h-fit text-indigo-400">
                {icon}
            </div>
            <p>{name}</p>
        </Link>
    );
};

export default RouteItem;
