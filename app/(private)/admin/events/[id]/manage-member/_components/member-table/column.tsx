"use client";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { DataTableColHeader } from "@/components/data-table/data-table-col-header";
import { ClipboardPen, Copy, Gift, MenuIcon, Pencil, Send, Trash, Vote } from "lucide-react";

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
import { TMemberWithEventElectionId } from "@/types";
import { Badge } from "@/components/ui/badge";
import { deleteMember, useOtpSend } from "@/hooks/api-hooks/member-api-hook";
import { useConfirmModal } from "@/stores/use-confirm-modal-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UpdateMemberModal from "../modals/update-member-modal";
import { useState } from "react";
import { useSession } from "next-auth/react";
import LoadingSpinner from "@/components/loading-spinner";
import { useAttendanceRegistration } from "@/hooks/api-hooks/attendance-api-hooks";
import AssistClaimSheet from "../../../../_components/assist-claim-sheet";
import { cn } from "@/lib/utils";
import useOrigin from "@/hooks/use-origin";
import { useVoterAuthorization } from "@/hooks/public-api-hooks/use-vote-api";

const Actions = ({ member }: { member: TMemberWithEventElectionId }) => {
    const { data: session } = useSession();
    const origin = useOrigin();

    const isAdminOrRoot = session?.user.role === "admin" || session?.user.role === "root";

    const [onOpenModal, setOnOpenModal] = useState(false);
    const [claimSheet, setClaimSheet] = useState(false)
    const { onOpen: onOpenConfirmModal } = useConfirmModal();

    // custom no join
    // const { getAuthorization } = useVoterAuthorizationAssist(member.eventId, member.id, (voter) => window.open(`${origin}/events/${member.eventId}/election/vote`));
    
    const { election } = member.event

    const { getAuthorization } = useVoterAuthorization(member.eventId, election? election.id : '', member.id, (voter)=> window.open(`/events/${member.eventId}/election/vote`));

    const deleteOperation = deleteMember();

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
                {!member.registered && (
                    <DropdownMenuItem
                        className="px-2 gap-x-2"
                        onClick={()=> onOpenConfirmModal({
                            title : "Register Member",
                            description : "You are about to register this member, registration serves as attendance as well, are you sure?",
                            onConfirm : () => registerAttendance(),
                            confirmString : "Register"
                        })}
                    >
                        <ClipboardPen strokeWidth={2} className="h-4" />
                        Register Member
                    </DropdownMenuItem>
                )}
                {!member.voted && member.event.election && (
                    <DropdownMenuItem
                        className="px-2 gap-x-2"
                        onClick={()=> onOpenConfirmModal({
                            title : "Assist Vote",
                            description : "You are about to assist this member on voting, it will redirect to a new window for voting. Are you sure to assist this member on voting?",
                            onConfirm : () => {
                                getAuthorization({ otp : member.voteOtp ?? "", passbookNumber : member.passbookNumber, birthday : member.birthday !== null ? new Date(member.birthday).toISOString() : undefined })
                            },
                            confirmString : "Vote"
                        })}
                    >
                        <Vote strokeWidth={2} className="h-4" />
                        Assist Vote
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

const Cell = ({ text,className}: { text: string | null,className?:string }) => {
    return <p className={`text-[min(14px,2.9vw)] fon-bold uppercase ${className}`}>{text}</p>;
};

const columns: ColumnDef<TMemberWithEventElectionId>[] = [
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
            <DataTableColHeader column={column} title="First Name" />
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
                    <Cell text={row.original.firstName}></Cell>
                </div>
            );
        },
    },
    {
        accessorKey: "lastName",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Last Name" />
        ),
        cell: ({ row }) =>  <Cell text={row.original.lastName}></Cell>,
    },
    {
        accessorKey: "middleName",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Middle" />
        ),
        cell: ({ row }) => <Cell text={row.original.middleName}></Cell>,
    },
    {
        accessorKey: "passbookNumber",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Passbook N0." />
        ),
        cell: ({ row }) => (
            <Cell text={row.original.passbookNumber}></Cell>
        ),
    },
    {
        accessorKey: "voteOtp",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Vote OTP" />
        ),
        cell: ({ row }) => <Cell text={row.original.voteOtp }></Cell>,
    },

    {
        accessorKey: "birthday",
        enableHiding: true,
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Birthday" />
        ),
        cell: ({ row }) => (
            <Cell text={!row.original.birthday ? "":moment(row.original.birthday).format("LL")}></Cell>
        ),
    },
    {
        accessorKey: "contact",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Contact" />
        ),
        cell: ({ row }) => <Cell text={row.original.contact}></Cell>,
    },
    {
        accessorKey: "emailAddress",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Email" />
        ),
        cell: ({ row }) =><Cell text={row.original.emailAddress} className="lowercase"></Cell>,
    },
    {
        accessorKey: "gender",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Gender" />
        ),
        cell: ({ row }) =><Cell text={row.original.gender}></Cell>,
        enableHiding:true,
        enableSorting:false
    },
    {
        accessorKey: "voted",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Voted" />
        ),
        cell: ({ row }) => (
            <div className="">
                {row.original.voted ? (
                    <Badge className={cn("bg-green-500 text-accent border-0")} >
                    <Cell className="lowercase" text="voted"></Cell>
                    </Badge>
                ) : (
                    <Badge variant={"secondary"} className={cn(" bg-secondary")} >
                          <Cell className="lowercase" text="Unvoted"></Cell>
                        </Badge>
                )}
            </div>
        ),
        enableHiding:true,
        enableSorting:false
    },
    {
        accessorKey: "registered",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Status" />
        ),
        cell: ({ row }) => (
            <div className="">
                {row.original.registered ? (
                    <Badge className="text-primary border-0  bg-primary/40">
                          <Cell className="lowercase" text="registered"></Cell>
                    </Badge>
                ) : (
                    <Badge  variant={"secondary"}>unregistered</Badge>
                )}
            </div>
        ),
        enableHiding:true,
        enableSorting:false
    },
];

export default columns;
