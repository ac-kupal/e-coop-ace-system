import React, { ReactNode } from "react";
import NavBar from "./_components/navbar";

type Props = { children : ReactNode};

const PublicLayout = ( { children }: Props) => {
    return (
        <div className="bg-secondary/40 font-poppins">
            <NavBar />
            <main className="ml-0 overflow-x-hidden flex-1">
                {children}
            </main>
        </div>
    );
};

export default PublicLayout;
