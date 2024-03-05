"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTableColHeader } from "@/components/data-table/data-table-col-header";
import { ClipboardPen, Copy, Gift, MenuIcon, Pencil, Send, Trash } from "lucide-react";

import { toast } from "sonner";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import moment from "moment";
import { TMember } from "@/types";
import { Badge } from "@/components/ui/badge";
import { deleteMember, useOtpSend } from "@/hooks/api-hooks/member-api-hook";
import { useConfirmModal } from "@/stores/use-confirm-modal-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UpdateMemberModal from "../modals/update-member-modal";
import { useState } from "react";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import LoadingSpinner from "@/components/loading-spinner";
import { useAttendanceRegistration } from "@/hooks/api-hooks/attendance-api-hooks";
import AssistClaimSheet from "../../../../_components/assist-claim-sheet";

const Actions = ({ member }: { member: TMember }) => {
    const { data: session } = useSession();

    const isAdminOrRoot = session?.user.role === "admin" || session?.user.role === "root";

    const [onOpenModal, setOnOpenModal] = useState(false);
    const [claimSheet, setClaimSheet] = useState(false)
    const deleteOperation = deleteMember();
    const { onOpen: onOpenConfirmModal } = useConfirmModal();

    const { isSendingOtp, sendOtp } = useOtpSend(
        member.eventId,
        member.passbookNumber
    );
    const { registerAttendance, registerPending } = useAttendanceRegistration(
        member.eventId,
        member.passbookNumber
    );

    const isLoading = isSendingOtp || registerPending;

    if (isLoading) return <LoadingSpinner />;

    return (
        <DropdownMenu>
            <UpdateMemberModal
                member={member}
                state={onOpenModal}
                onClose={() => setOnOpenModal(false)}
                onCancel={() => setOnOpenModal(false)}
            />
            <AssistClaimSheet
                state={claimSheet}
                onClose={(state)=>setClaimSheet(state)}
                member={member}
            />
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-8 h-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MenuIcon className="size-7 text-muted-foreground" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="border-none shadow-2" align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="px-2 gap-x-2"
                    onClick={() => {
                        navigator.clipboard.writeText(
                            `${member.passbookNumber}`
                        );
                        toast.success("coppied");
                    }}
                >
                    {" "}
                    <Copy strokeWidth={2} className="h-4" />
                    Copy passbook No.
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="px-2 gap-x-2"
                    onClick={() => {
                        navigator.clipboard.writeText(`${member.voteOtp}`);
                        toast.success("coppied");
                    }}
                >
                    <Copy strokeWidth={2} className="h-4" />
                    Copy vote OTP
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="px-2 gap-x-2"
                    onClick={() => {
                        sendOtp();
                    }}
                >
                    <Send strokeWidth={2} className="h-4" />
                    Send OTP
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="px-2 gap-x-2"
                    onClick={() => {
                        setClaimSheet(true)
                    }}
                >
                    <Gift strokeWidth={2} className="h-4" />
                    Incentive Claims
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="px-2 gap-x-2"
                    onClick={() => {
                        navigator.clipboard.writeText(
                            `${format(member.birthday, "PPP")}`
                        );
                        toast.success("coppied");
                    }}
                >
                    <Copy strokeWidth={2} className="h-4" />
                    Copy birthday
                </DropdownMenuItem>
                {!member.registered && (
                    <DropdownMenuItem
                        className="px-2 gap-x-2"
                        onClick={() => {
                            registerAttendance();
                        }}
                    >
                        <ClipboardPen strokeWidth={2} className="h-4" />
                        Register Member
                    </DropdownMenuItem>
                )}

                {isAdminOrRoot && (
                    <DropdownMenuItem
                        className="px-2 gap-x-2"
                        onClick={() => {
                            setOnOpenModal(true);
                        }}
                    >
                        <Pencil strokeWidth={2} className="h-4" /> Edit Member
                    </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                {isAdminOrRoot && (
                    <DropdownMenuItem
                        className="px-2 gap-x-2 text-destructive"
                        onClick={() =>
                            onOpenConfirmModal({
                                title: "Delete Member 🗑️",
                                description:
                                    "Are you sure to delete this member permanently? This cannot be undone.",
                                onConfirm: () => {
                                    deleteOperation.mutate({
                                        eventId: member.eventId,
                                        memberId:member.id
                                    });
                                },
                            })
                        }
                    >
                        <Trash strokeWidth={2} className="h-4" />
                        Delete
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

const columns: ColumnDef<TMember>[] = [
    {
        id: "actions",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Actions" />
        ),
        cell: ({ row }) => (
            <div className="flex justify-start">
                <Actions member={row.original} />
            </div>
        ),
    },
    {
        accessorKey: "firstName",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="first Name" />
        ),
        cell: ({ row }) => {
            const img =
                row.original.picture === null
                    ? "/images/default.png"
                    : row.original.picture;
            return (
                <div className="flex items-center space-x-2">
                    <Avatar>
                        <AvatarImage src={img} />
                        <AvatarFallback className="bg-primary text-accent">
                            {row.original.firstName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <h1 className="font-medium">{row.original.firstName}</h1>
                </div>
            );
        },
    },
    {
        accessorKey: "lastName",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="last Name" />
        ),
        cell: ({ row }) => <div className=""> {row.original.lastName}</div>,
    },
    {
        accessorKey: "middleName",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="middle" />
        ),
        cell: ({ row }) => <div className="">{row.original.middleName}</div>,
    },
    {
        accessorKey: "passbookNumber",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="passbook N0." />
        ),
        cell: ({ row }) => (
            <div className="">{row.original.passbookNumber}</div>
        ),
    },
    {
        accessorKey: "voteOtp",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="vote OTP" />
        ),
        cell: ({ row }) => <div className="">{row.original.voteOtp}</div>,
    },

    {
        accessorKey: "birthday",
        enableHiding: true,
        header: ({ column }) => (
            <DataTableColHeader column={column} title="birthday" />
        ),
        cell: ({ row }) => (
            <div className="">{moment(row.original.birthday).format("LL")}</div>
        ),
    },
    {
        accessorKey: "contact",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="contact" />
        ),
        cell: ({ row }) => <div className="">{row.original.contact}</div>,
    },
    {
        accessorKey: "emailAddress",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="email" />
        ),
        cell: ({ row }) => <div className="">{row.original.emailAddress}</div>,
    },
    {
        accessorKey: "gender",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="gender" />
        ),
        cell: ({ row }) => <div className="">{row.original.gender}</div>,
    },
    {
        id: "registered",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Registered" />
        ),
        cell: ({ row }) => (
            <div className="">
                {row.original.registered ? (
                    <Badge className="dark:text-white text-white bg-primary">
                        registered
                    </Badge>
                ) : (
                    <Badge variant={"secondary"}>unregistered</Badge>
                )}
            </div>
        ),
    },
];

export default columns;
