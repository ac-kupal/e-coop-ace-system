import React from "react";
import QrGen from "./_components/qr-gen";

const QrGeneratorPage = () => {
    return (
        <div className="min-w-full flex flex-col items-center bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-background to-[#e7e0fb] dark:to-secondary">
            <div className="w-full px-4 justify-center min-h-dvh flex items-center max-w-3xl">
               <QrGen /> 
            </div>
        </div>
    );
};

export default QrGeneratorPage;
