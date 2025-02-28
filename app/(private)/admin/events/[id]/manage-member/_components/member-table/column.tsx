"use client";
import moment from "moment";
import { toast } from "sonner";
import { format } from "date-fns";
import { forwardRef, useState } from "react";
import { useSession } from "next-auth/react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColHeader } from "@/components/data-table/data-table-col-header";

import {
    Copy,
    Gift,
    Send,
    Vote,
    Trash,
    QrCode,
    Pencil,
    MenuIcon,
    CopyIcon,
    QrCodeIcon,
    ClipboardPen,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/user-avatar";
import ActionTooltip from "@/components/action-tooltip";
import LoadingSpinner from "@/components/loading-spinner";
import UpdateMemberModal from "../modals/update-member-modal";
import AssistClaimSheet from "../../../../_components/assist-claim-sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import QrViewContent from "@/components/modals/modal-content/qr-view-content";

import { cn } from "@/lib/utils";
import useOrigin from "@/hooks/use-origin";
import { useInfoModal } from "@/stores/use-info-modal-store";
import { TMember, TMemberWithEventElectionId } from "@/types";
import { useConfirmModal } from "@/stores/use-confirm-modal-store";
import { deleteMember, useOtpSend } from "@/hooks/api-hooks/member-api-hook";
import { useVoterAuthorization } from "@/hooks/public-api-hooks/use-vote-api";
import { useAttendanceRegistration } from "@/hooks/api-hooks/attendance-api-hooks";

const ViewMemberQr = ({ member }: { member: TMember }) => {
    const { onOpen } = useInfoModal();

    return (
        <Button
            onClick={() =>
                onOpen({
                    title: "Event QRCode",
                    description: "Available QR Code(s) for this event",
                    hideConfirm: true,
                    component: (
                        <div className="flex lg:flex-row justify-center gap-x-4 items-center px-8 py-4">
                            <div className="flex flex-col gap-y-2 items-center">
                                <p className="text-center text-sm">
                                    {member.firstName} {member.lastName} Pasbook
                                    QR
                                </p>
                                <QrViewContent
                                    qrClassName="size-[250px] lg:size-[350px]"
                                    fileName={
                                        member.passbookNumber + "-pasbook-qr"
                                    }
                                    value={member.passbookNumber}
                                    enableDownload
                                />
                            </div>
                        </div>
                    ),
                })
            }
            size="icon"
            variant="ghost"
        >
            <QrCodeIcon className="size-6" strokeWidth={1} />
        </Button>
    );
};

const Actions = ({ member }: { member: TMemberWithEventElectionId }) => {
    const { data: session } = useSession();
    const origin = useOrigin();

    const isAdminOrRoot =
        session?.user.role === "admin" || session?.user.role === "root";

    const [onOpenModal, setOnOpenModal] = useState(false);
    const [claimSheet, setClaimSheet] = useState(false);
    const { onOpen: onOpenConfirmModal } = useConfirmModal();
    const { onOpen: onInfoModal } = useInfoModal();

    // custom no join
    // const { getAuthorization } = useVoterAuthorizationAssist(member.eventId, member.id, (voter) => window.open(`${origin}/events/${member.eventId}/election/vote`));

    const { election } = member.event;

    const { getAuthorization } = useVoterAuthorization(
        member.eventId,
        election ? election.id : "",
        member.id,
        (voter) => window.open(`/events/${member.eventId}/election/vote`)
    );

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
                onClose={(state) => setClaimSheet(state)}
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
                    onClick={() =>
                        onInfoModal({
                            title: "Event QRCode",
                            description: "Available QR Code(s) for this event",
                            hideConfirm: true,
                            component: (
                                <div className="flex lg:flex-row justify-center gap-x-4 items-center px-8 py-4">
                                    <div className="flex flex-col gap-y-2 items-center">
                                        <p className="text-center text-sm">
                                            {member.firstName} {member.lastName}{" "}
                                            Pasbook QR
                                        </p>
                                        <QrViewContent
                                            qrClassName="size-[250px] lg:size-[350px]"
                                            fileName={
                                                member.passbookNumber +
                                                "-pasbook-qr"
                                            }
                                            value={member.passbookNumber}
                                            enableDownload
                                        />
                                    </div>
                                </div>
                            ),
                        })
                    }
                >
                    <QrCode strokeWidth={2} className="h-4" /> Show Passbook QR
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="px-2 gap-x-2"
                    onClick={() => {
                        setClaimSheet(true);
                    }}
                >
                    <Gift strokeWidth={2} className="h-4" />
                    Incentive Claims
                </DropdownMenuItem>
                {!member.registered && (
                    <DropdownMenuItem
                        className="px-2 gap-x-2"
                        onClick={() =>
                            onOpenConfirmModal({
                                title: "Register Member",
                                onConfirm: () => registerAttendance(),
                                confirmString: "Register",
                                contentComponent: (
                                    <div className="flex flex-col items-center gap-y-1">
                                        <UserAvatar
                                            className="size-52"
                                            src={
                                                member.picture ??
                                                "/images/default.png"
                                            }
                                            fallback={member.firstName.charAt(
                                                0
                                            )}
                                        />
                                        <p className="text-2xl">
                                            {member.firstName}{" "}
                                            {member.middleName}{" "}
                                            {member.lastName}
                                        </p>
                                        <p className="text-sm mt-2">
                                            {member.birthday ? format(member.birthday, "MMMM d, yyyy") : 'no birthday defined'}
                                        </p>
                                        <p className="text-muted-foreground text-center min-w-28 border-b-2 text-lg">
                                            {member.passbookNumber}
                                        </p>
                                        <p className="text-center text-muted-foreground text-xs">
                                            Passbook No.
                                        </p>
                                        <p className="text-sm text-muted-foreground mt-4 text-center">
                                            You are about to register{" "}
                                            <strong>
                                                {member.firstName}{" "}
                                                {member.middleName}{" "}
                                                {member.lastName}
                                            </strong>
                                            , registration serves as attendance
                                            as well, are you sure?
                                        </p>
                                    </div>
                                ),
                            })
                        }
                    >
                        <ClipboardPen strokeWidth={2} className="h-4" />
                        Register Member
                    </DropdownMenuItem>
                )}
                {!member.voted && member.event.election && (
                    <DropdownMenuItem
                        className="px-2 gap-x-2"
                        onClick={() =>
                            onOpenConfirmModal({
                                title: "Assist Vote",
                                description:
                                    "You are about to assist this member on voting, it will redirect to a new window for voting. Are you sure to assist this member on voting?",
                                onConfirm: () => {
                                    getAuthorization({
                                        otp: member.voteOtp ?? "",
                                        passbookNumber: member.passbookNumber,
                                        birthday:
                                            member.birthday !== null
                                                ? new Date(
                                                      member.birthday
                                                  ).toISOString()
                                                : undefined,
                                    });
                                },
                                confirmString: "Vote",
                            })
                        }
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
                                        memberId: member.id,
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

const Cell = forwardRef<
    HTMLParagraphElement,
    {
        text: string | null;
        className?: string;
    }
>(({ text, className, ...other }, ref) => {
    return (
        <p
            ref={ref}
            {...other}
            className={`text-[min(14px,2.9vw)] fon-bold uppercase ${className}`}
        >
            {text}
        </p>
    );
});

Cell.displayName = "Cell";

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
        cell: ({ row }) => <Cell text={row.original.lastName}></Cell>,
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
        cell: ({ row }) => <Cell text={row.original.passbookNumber}></Cell>,
    },
    {
        id: "PB QR",
        accessorKey: "passbookNumber",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="PB QR." />
        ),
        cell: ({ row }) => <ViewMemberQr member={row.original} />,
        enableSorting: false,
        enableColumnFilter: false,
    },
    {
        accessorKey: "voteOtp",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Vote OTP" />
        ),
        cell: ({ row }) => (
            <div
                onClick={() => {
                    navigator.clipboard.writeText(`${row.original.voteOtp}`);
                    toast.success("Member OTP coppied");
                }}
                className="font-mono inline-flex items-center gap-x-2"
            >
                <ActionTooltip
                    content={
                        <>
                            Click to Copy Member OTP
                            <CopyIcon
                                className="size-4 ml-2 inline"
                                strokeWidth="1"
                            />
                        </>
                    }
                >
                    <Cell
                        text={row.original.voteOtp}
                        className=" px-2.5 py-1.5 cursor-pointer bg-popover rounded-sm"
                    />
                </ActionTooltip>
            </div>
        ),
    },

    {
        accessorKey: "birthday",
        enableHiding: true,
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Birthday" />
        ),
        cell: ({ row }) => (
            <Cell
                text={
                    !row.original.birthday
                        ? ""
                        : moment(row.original.birthday).format("LL")
                }
            ></Cell>
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
        cell: ({ row }) => (
            <Cell text={row.original.emailAddress} className="lowercase"></Cell>
        ),
    },
    {
        accessorKey: "gender",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Gender" />
        ),
        cell: ({ row }) => <Cell text={row.original.gender}></Cell>,
        enableHiding: true,
        enableSorting: false,
    },
    {
        accessorKey: "voted",
        header: ({ column }) => (
            <DataTableColHeader column={column} title="Voted" />
        ),
        cell: ({ row }) => (
            <div className="">
                {row.original.voted ? (
                    <Badge className={cn("bg-green-500 text-accent border-0")}>
                        <Cell className="lowercase" text="voted"></Cell>
                    </Badge>
                ) : (
                    <Badge
                        variant={"secondary"}
                        className={cn(" bg-secondary")}
                    >
                        <Cell className="lowercase" text="Unvoted"></Cell>
                    </Badge>
                )}
            </div>
        ),
        enableHiding: true,
        enableSorting: false,
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
                    <Badge variant={"secondary"}>unregistered</Badge>
                )}
            </div>
        ),
        enableHiding: true,
        enableSorting: false,
    },
];

export default columns;
