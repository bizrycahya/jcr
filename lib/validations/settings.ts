import { z } from "zod";

export const appearanceSchema = z.object({
  sidebarColor: z.string().min(4, "Format warna tidak valid"),
  buttonColor: z.string().min(4, "Format warna tidak valid"),
  ttdKepsekUrl: z.string().url("URL tidak valid").optional().or(z.literal("")),
  ttdWaliUrl: z.string().url("URL tidak valid").optional().or(z.literal("")),
  stempelUrl: z.string().url("URL tidak valid").optional().or(z.literal("")),
});

export type AppearanceInput = z.infer<typeof appearanceSchema>;