import { redirect } from "next/navigation";

import { allowed } from "@/lib/utils";
import { AdminRoutes } from "./_components/sidebar/sidebar-route";
import { currentUserOrThrowAuthError } from "@/lib/auth";

type Props = {};

const AdminPage = async (props: Props) => {
    const user = await currentUserOrThrowAuthError();

    if (!allowed(["root", "admin"], user.role))
        return (
            <div className="flex p-2 h-dvh flex-col items-center justify-center w-full">
                <p>You are not allowed in this page</p>
            </div>
        );

    const allowedPages = AdminRoutes.filter((route) =>
        route.allowedRole.includes(user.role)
    );

    if (allowedPages.length === 0)
        return (
            <div className="flex justify-center items-center h-dvh">
                <p>Your account role doesn't have access to any page</p>
            </div>
        );

    return redirect(allowedPages[0].path);
};

export default AdminPage;
