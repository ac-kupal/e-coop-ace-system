import React, { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Props = { children?: ReactNode; className?: string };

const SettingsCard = ({ children, className }: Props) => {
    return (
        <div
            className={cn(
                " p-5 rounded-xl bg-background overflow-clip flex gap-x-4 flex-col gap-y-4 lg:flex-row bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-background to-secondary",
                className
            )}
        >
            {
                children
            }
        </div>
    );
};

export default SettingsCard;
