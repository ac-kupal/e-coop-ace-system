"use client"
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type TPublicNavItem = {
    routeName: string;
    path: string;
    Icon: React.ReactNode;
};

const RouteItem = ({ routeName, path, Icon }: TPublicNavItem) => {
    const pathName = usePathname();

    return (
        <div className="relative rounded-xl lg:rounded-full overflow-clip">
            <div className="absolute top-2 left-3 blur-md  z-0">{Icon}</div>
            <Link
                href={path}
                className={cn("duration-200 z-10 relative px-3 py-2 text-foreground bg-secondary/20 hover:bg-background/70 ease-in flex items-center gap-x-2", pathName === path && "bg-background/80 dark:bg-secondary/80")}
            >
                {Icon} {routeName}
            </Link>
        </div>
    );
};

export default RouteItem;
