import Link from "next/link";
import SideBarRoute from "./sidebar-route";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { currentUser } from "@/lib/auth";
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = {};

const SideBar = async (props: Props) => {
    const session = await currentUser();

    if (!session?.user || session?.user.id === undefined)
        return (
            <div className="w-60 p-4 bg-background flex flex-col gap-y-8 items-center rounded-r-2xl">
                <p>You are not signed in</p>
                <Link className="underline" href="/auth">
                    Sign in
                </Link>
            </div>
        );

    return (
        <div className="w-60 h-screen  bg-background flex flex-col gap-y-8 items-center rounded-r-2xl">
            <ScrollArea className="flex-1 px-4 w-full text-left">
                <div className="flex flex-col p-4 mb-4 items-center">
                    <p className="text-xl">ACE System v1</p>
                    <Avatar className="h-16 w-16 mt-8">
                        <AvatarImage src={session.user.picture as string} />
                        <AvatarFallback>
                            {session.user.name.substring(0, 1)}
                        </AvatarFallback>
                    </Avatar>
                    <p>{session.user.name}</p>
                </div>
                <SideBarRoute currentUser={session.user} />
            </ScrollArea>
        </div>
    );
};

export default SideBar;
