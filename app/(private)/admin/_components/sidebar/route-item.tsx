"use client";
import React from "react";
import { user } from "next-auth";
import { usePathname } from "next/navigation";

import { TRoute } from "@/types";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
    currentUser: user;
    route: TRoute;
};

const RouteItem = ({ currentUser, route }: Props) => {
    const { icon, name, path, allowedRole } = route;

    const pathname = usePathname();
    const isCurrentPath = pathname.startsWith(path);

    const authorized = () => allowedRole.includes(currentUser.role);

    if (!authorized()) return null;
    return (
        <Link
            href={path}
            className={cn(
                "duration-200 group flex px-6 py-2 rounded-xl items-center gap-x-3 hover:bg-secondary text-foreground",
                isCurrentPath && "text-background bg-[#5B9381] dark:text-white hover:bg-primary/70"
            )}
        >
            <div className={`w-fit h-fit ${isCurrentPath ? "text-accent dark:text-white": "text-accent-foreground"} `}>
                {icon}
            </div>
            <p>{name}</p>
        </Link>
    );
};

export default RouteItem;
