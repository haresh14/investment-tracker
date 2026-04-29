import { z } from "zod";

export const investmentSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    source: z.string().min(2, "Source is required"),
    account: z.string().min(2, "Account is required"),
    type: z.enum(["sip", "lumpsum"]),
    monthly_amount: z.coerce.number().nonnegative().optional().nullable(),
    lump_sum_amount: z.coerce.number().nonnegative().optional().nullable(),
    expected_annual_return: z.coerce.number().min(0).max(50),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().optional().nullable(),
    sip_day: z.coerce.number().min(1).max(31).optional().nullable(),
    lock_in_months: z.coerce.number().int().min(0).max(600).optional().nullable()
  })
  .superRefine((value, ctx) => {
    if (value.type === "sip" && (!value.monthly_amount || value.monthly_amount <= 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["monthly_amount"],
        message: "Monthly amount is required for SIPs"
      });
    }

    if (value.type === "lumpsum" && (!value.lump_sum_amount || value.lump_sum_amount <= 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["lump_sum_amount"],
        message: "Lumpsum amount is required"
      });
    }

    if (value.end_date && value.end_date < value.start_date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["end_date"],
        message: "End date cannot be before start date"
      });
    }
  });

export type InvestmentFormValues = z.infer<typeof investmentSchema>;
