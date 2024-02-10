import z from "zod";

export const createBranchSchema = z.object({
    branchName: z
        .string({ required_error: "branch name is required" })
        .min(1, "branch name is required"),
    branchDescription: z
        .string({ required_error: "branch description is required" })
        .min(1, "branch description is required"),
    branchAddress: z
        .string({ required_error: "branch address is required" })
        .min(1, "branch address is required"),
    branchPicture: z
        .string({ required_error: "branch picture is required" })
        .optional()
});
