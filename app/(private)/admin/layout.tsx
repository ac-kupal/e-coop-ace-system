import { ReactNode } from "react";
import SideBar from "./_components/sidebar";
import SessionProviderWrapper from "@/providers/session-provider-wrapper";
import NavBar from "./_components/navbar";

type Props = { children?: ReactNode };
const AdminLayout = async ({ children }: Props) => {
   return (
      <SessionProviderWrapper>
         <div className=" flex flex-col bg-secondary ">
            <div className="fixed w-full z-30" >
               <NavBar />
            </div>
            <div className="w-full border flex mt-16">
               <div className="hidden bg-background lg:flex h-fill rounded-r-3xl  flex-col inset-y-0 print:hidden">
                  <SideBar />
               </div>
               <main className="ml-0  overflow-x-hidden flex-1">
                  {children}
               </main>
            </div>
         </div>
      </SessionProviderWrapper>
   );
};

export default AdminLayout;
