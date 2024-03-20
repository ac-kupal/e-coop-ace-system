import React from "react";
import UserTable from "./_components/user-table";
import { currentUserOrThrowAuthError } from "@/lib/auth";
import { allowed } from "@/lib/utils";

type Props = {};

const UserManagementPage = async (props: Props) => {
    const user = await currentUserOrThrowAuthError();

    if (!allowed(["root", "branch_root"], user.role))
        return (
            <div className="flex p-2 h-dvh flex-col items-center justify-center w-full">
                <p>You are not allowed in this page</p>
            </div>
        );

    return (
        <div className="flex p-4 min-h-screen flex-col w-full">
            <UserTable currentUser={user} />
        </div>
    );
};

export default UserManagementPage;
