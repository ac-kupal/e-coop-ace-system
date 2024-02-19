import SideBarRoute from "./sidebar-route";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import LogOut from "./log-out";
import { ScrollArea } from "@/components/ui/scroll-area";
import { currentUserOrThrowAuthError } from "@/lib/auth";

type Props = {};

const SideBar = async (props: Props) => {
    const user = await currentUserOrThrowAuthError();

    return (
        <div className="w-60 h-screen py-5 overflow-clip bg-background flex flex-col gap-y-8 items-center rounded-r-2xl">
            <ScrollArea className="flex-1 px-4 w-full text-left">
                <SideBarRoute currentUser={user} />
            </ScrollArea>
        </div>
    );
};

export default SideBar;
