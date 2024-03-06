import z from "zod"

export const testdts = z.object({
    bday : z.coerce.date()
})