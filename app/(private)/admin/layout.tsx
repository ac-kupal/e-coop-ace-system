import SessionProviderWrapper from "@/providers/session-provider-wrapper";
import { ReactNode } from "react";

type Props = { children?: ReactNode };

const AdminLayout = ({ children }: Props) => {
    return (
        <SessionProviderWrapper>
            <div className="min-h-screen">
                <div>{children}</div>
            </div>
        </SessionProviderWrapper>
    );
};

export default AdminLayout;
