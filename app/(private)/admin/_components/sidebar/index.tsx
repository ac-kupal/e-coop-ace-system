import Link from "next/link";
import SideBarRoute from "./sidebar-route";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { currentUser, currentUserOrThrowAuthError } from "@/lib/auth";
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = {};

const SideBar = async (props: Props) => {
    const user = await currentUserOrThrowAuthError();

    return (
        <div className="w-60 h-screen  bg-background flex flex-col gap-y-8 items-center rounded-r-2xl">
            <ScrollArea className="flex-1 px-4 w-full text-left">
                <div className="flex flex-col p-4 mb-4 items-center">
                    <p className="text-xl">ACE System v1</p>
                    <Avatar className="h-16 w-16 mt-8">
                        <AvatarImage src={user.picture as string} />
                        <AvatarFallback>
                            {user.name.substring(0, 1)}
                        </AvatarFallback>
                    </Avatar>
                    <p>{user.name}</p>
                </div>
                <SideBarRoute currentUser={user} />
            </ScrollArea>
        </div>
    );
};

export default SideBar;
