import z from "zod";

export const eventIncentiveParamsSchema = z.object({
    id : z.coerce.number({ required_error : "event id is required", invalid_type_error : "invalid id type" }),
    incentiveId : z.coerce.number({ required_error : "incentive id is required", invalid_type_error : "invalid incentive id"})
})

export const createIncentiveSchema = z.object({
    itemName : z.string({ required_error : "Item name is required", invalid_type_error : "invalid type for item name"}).min(2, "Item name too short"),
    allotted : z.coerce.number({required_error : "Allotted is required", invalid_type_error : "invalid type for allotted"}).min(1,"Minimum value is 1"),
})

export const updateIncentiveSchema = createIncentiveSchema;
