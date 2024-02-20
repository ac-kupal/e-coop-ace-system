import { ReactNode } from "react";
import SideBar from "./_components/sidebar";
import SessionProviderWrapper from "@/providers/session-provider-wrapper";
import NavBar from "./_components/navbar";

type Props = { children?: ReactNode };
const AdminLayout = async ({ children }: Props) => {
   return (
      <SessionProviderWrapper>
         <div className=" flex flex-col bg-secondary ">
            <div className="fixed w-full z-30">
               <NavBar />
            </div>
            <div className=" lg:flex hidden fixed h-screen bg-background pt-16  rounded-r-3xl  flex-col inset-y-0 print:hidden">
               <SideBar />
            </div>
            <main className="ml-0 lg:ml-[15rem] mt-16  overflow-x-hidden flex-1">
               {children}
            </main>
         </div>
      </SessionProviderWrapper>
   );
};

export default AdminLayout;
