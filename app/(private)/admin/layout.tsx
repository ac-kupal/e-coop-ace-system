import { ReactNode } from "react";
import SideBar from "./_components/sidebar";
import SessionProviderWrapper from "@/providers/session-provider-wrapper";

type Props = { children?: ReactNode };
const AdminLayout = async ({ children }: Props) => {
    return (
        <SessionProviderWrapper>
            <div className="flex bg-secondary">
                <div className="hidden bg-background lg:flex h-fill w-[240px] rounded-r-3xl z-30 flex-col fixed inset-y-0 print:hidden">
                    <SideBar />
                </div>
                <main className="ml-0 lg:ml-[240px] overflow-x-hidden flex-1">{children}</main>
            </div>
        </SessionProviderWrapper>
    );
};

export default AdminLayout;
