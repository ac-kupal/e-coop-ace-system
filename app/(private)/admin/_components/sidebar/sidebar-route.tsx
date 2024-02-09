import React from "react";
import { user } from "next-auth";

import { Home, PartyPopper, User } from "lucide-react";

import { routeType } from "@/types";
import RouteItem from "./route-item";

const routes: routeType[] = [
    {
        icon: <Home className="h-5 w-5" />,
        name: "Dashboard",
        path: "/admin/dashboard",
        allowedRole: ["root", "admin", "staff"],
    },
    {
        icon: <User className="h-5 w-5" />,
        name: "Users",
        path: "/admin/user-management",
        allowedRole: ["root", "admin", "staff"],
    },
    {
        icon: <PartyPopper className="w-5 h-5"/>,
        name: "Events",
        path: "/admin/events",
        allowedRole: ["root", "admin", "staff"],
    },
];

type Props = {
    currentUser: user;
};

const SideBarRoute = ({ currentUser }: Props) => {
    return (
        <div className="flex-1 flex flex-col gap-y-2 w-full">
            {routes.map((route, i) => (
                <RouteItem currentUser={currentUser} route={route} key={i} />
            ))}
        </div>
    );
};

export default SideBarRoute;
