import React, { ReactNode } from "react";
import NavBar from "./_components/navbar";

type Props = { children : ReactNode};

const PublicLayout = ( { children }: Props) => {
    return (
        <div className="bg-secondary font-poppins">
            <NavBar />
            <main className="ml-0 lg:ml-[240px] overflow-x-hidden flex-1">
                {children}
            </main>
        </div>
    );
};

export default PublicLayout;
