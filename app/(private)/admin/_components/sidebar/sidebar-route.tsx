import React from "react";
import { user } from "next-auth";

import { routeType } from "@/types";
import { Home } from "lucide-react";
import RouteItem from "./route-item";

const routes: routeType[] = [
    {
        icon: <Home className="h-4 w-4" />,
        name: "Dashboard",
        path: "/admin/",
        allowedRole: ["admin", "staff"],
    },
];

type Props = {
    currentUser: user;
};

const SideBarRoute = ({ currentUser }: Props) => {
    return (
        <div className="flex-1 w-full">
            {routes.map((route, i) => (
                <RouteItem currentUser={currentUser} route={route} key={i} />
            ))}
        </div>
    );
};

export default SideBarRoute;
