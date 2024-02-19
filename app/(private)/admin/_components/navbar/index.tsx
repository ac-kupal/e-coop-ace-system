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
import LogOut from "../sidebar/log-out";
import { CornerDownLeft } from "lucide-react";

type Props = {};

const NavBar = async (props: Props) => {
   const user = await currentUserOrThrowAuthError();

   return (
      <div className="w-full bg-[#3D7663] justify-between flex p-3">
         <h1 className="text-[24px] text-white font-medium">Coop ACE System</h1>
         <div className=" flex  space-x-4 items-center">
            <h1 className="text-white">{user.name}</h1>
            <DropdownMenu>
               <DropdownMenuTrigger asChild>
                  <Avatar>
                     <AvatarImage src={user.picture as string} alt="@shadcn" />
                     <AvatarFallback>
                        {" "}
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
                  <DropdownMenuItem>
                     <LogOut className=" font-semibold" />
                     <DropdownMenuShortcut>
                     ⇧⌘Q
                        <CornerDownLeft className="w-4" />
                     </DropdownMenuShortcut>
                  </DropdownMenuItem>
               </DropdownMenuContent>
            </DropdownMenu>
            <ModeToggle />
         </div>
      </div>
   );
};

export default NavBar;
