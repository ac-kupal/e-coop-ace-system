import React from "react";
import { user } from "next-auth";

import { GitBranch, Home, PartyPopper, User } from "lucide-react";

import { TRoute } from "@/types";
import RouteItem from "./route-item";
import Link from "next/link";

export const AdminRoutes: TRoute[] = [
    {
        icon: <GitBranch className="h-5 w-5" />,
        name: "Branches",
        path: "/admin/branches",
        allowedRole: ["root", "branch_root", "admin"],
    },
    {
        icon: <User className="h-5 w-5" />,
        name: "Users",
        path: "/admin/user-management",
        allowedRole: ["root", "branch_root", "admin"],
    },
    {
        icon: <PartyPopper className="w-5 h-5"/>,
        name: "Events",
        path: "/admin/events",
        allowedRole: ["root", "branch_root", "admin", "staff"],
    }
];

type Props = {
    currentUser: user;
};

const SideBarRoute = ({ currentUser }: Props) => {
    return (
            <div className="flex-1 flex flex-col gap-y-2 px-2 w-full">
            {AdminRoutes.map((route, i) => (
                <RouteItem currentUser={currentUser} route={route} key={i} />
            ))}
            {
                AdminRoutes.length === 0 && <p className="text-center">You role doesnt have page access</p>
            }
        </div>
    );
};

export default SideBarRoute;
