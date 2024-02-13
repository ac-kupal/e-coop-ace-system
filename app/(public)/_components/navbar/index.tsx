import { ModeToggle } from "@/components/theme/mode-toggle";
import Link from "next/link";
import React from "react";
import RouteItem from "./route-item";

type Props = {};

const routes = [
    { routeName : "Events", path : "/events" },
]

const NavBar = (props: Props) => {
    return (
        <header className="fixed top-0 z-50 flex flex-col items-center w-[100vw] p-4 bg-white/20 dark:bg-slate-900/20 backdrop-blur-md">
            <div className="flex items-center justify-between w-full max-w-7xl">
                <Link href="/" className="text-lg font-medium" >ACE System</Link>
                <div className="flex items-center text-foreground/60 gap-x-5 justify-center">
                    {
                        routes.map((route)=> <RouteItem key={route.path} routeName={route.routeName} path={route.path} />)
                    }
                </div>
                <div className="flex items-center justify-end">
                    <ModeToggle />
                </div>
            </div>
        </header>
    );
};

export default NavBar;
