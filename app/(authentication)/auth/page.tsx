export const dynamic = "force-dynamic"

import React from "react";
import { hasRoot } from "@/services/user";
import LoginForm from "./_components/login-form";
import { INIT_ROOT_ACCOUNT } from "@/services/initialize-default";
import { ModeToggle } from "@/components/theme/mode-toggle";

type Props = {
    searchParams?: Record<"callbackUrl" | "error", string>;
  };

const LoginPage = async({ searchParams }: Props) => {
    const doesRootExist = await hasRoot();
    if (!doesRootExist) await INIT_ROOT_ACCOUNT();

    return (
        <div className="min-h-screen flex items-center justify-center relative">
            <ModeToggle className="absolute top-5 right-5 shadow-sm shadow-foreground/20"/>
            <div className="max-w-md w-full">
                <LoginForm callbackUrl={searchParams?.callbackUrl} />
            </div>
        </div>
    );
};

export default LoginPage;
