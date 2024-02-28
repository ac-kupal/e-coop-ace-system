import { ModeToggle } from "@/components/theme/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuShortcut,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import LogOut from "./log-out";
import Link from "next/link";

type Props = {};

const NavBar = async ({}: Props) => {
   const user = await currentUserOrThrowAuthError();

   return (
      <div className="w-full bg-[#3D7663] font-poppins dark:bg-background/70 dark:border-[1px] dark:border-b-primary/70 dark:backdrop-blur-md justify-between flex p-3">
         <Link href="/" className="text-[min(22px,3.0vw)] text-white font-medium flex  items-center">
            <h1>Coop ACE System</h1>
         </Link>
         <div className=" flex  space-x-4 items-center">
            <h1 className="text-white text-[min(14px,2.4vw)]">{user.name}</h1>
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Avatar>
                     <AvatarImage  src={user.picture as string} alt="@shadcn" />
                     <AvatarFallback>
                        {user.name.substring(0, 1)}
                     </AvatarFallback>
                  </Avatar>
               </DropdownMenuTrigger>
               <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                     <DropdownMenuItem>
                        Profile
                        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                     </DropdownMenuItem>

                     <DropdownMenuItem>
                        Settings
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                     </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <LogOut />
               </DropdownMenuContent>
            </DropdownMenu>
            <ModeToggle />
         </div>
      </div>
   );
};

export default NavBar;
