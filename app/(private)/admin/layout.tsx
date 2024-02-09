import { ReactNode } from "react";
import SideBar from "./_components/sidebar";
import SessionProviderWrapper from "@/providers/session-provider-wrapper";

type Props = { children?: ReactNode };

const AdminLayout = ({ children }: Props) => {
    return (
        <SessionProviderWrapper>
            <div className="min-h-screen flex">
                <SideBar />
                <main className="">{children}</main>
            </div>
        </SessionProviderWrapper>
    );
};

export default AdminLayout;
