import React, { ReactNode } from "react";

import { cn } from "@/lib/utils";

type Props = { children?: ReactNode; className?: string };

const SettingsCard = ({ children, className }: Props) => {
    return (
        <div
            className={cn(
                " p-7 rounded-xl bg-secondary dark:bg-background/60 overflow-clip flex gap-x-4 flex-col gap-y-4 ",
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
