import { z } from 'zod';

export const AgencyDetailsSchema = z.object({
  name: z.string().min(2, { message: 'Agency name must be at least 2 char' }),
  companyEmail: z
    .string()
    .min(1, { message: 'Agency name must be at least 1 char' }),
  companyPhone: z
    .string()
    .min(1, { message: 'Agency name must be at least 1 char' }),
  whiteLabel: z.boolean(),
  address: z
    .string()
    .min(1, { message: 'Agency name must be at least 1 char' }),
  city: z.string().min(1, { message: 'Agency name must be at least 1 char' }),
  zipCode: z
    .string()
    .min(1, { message: 'Agency name must be at least 1 char' }),
  state: z.string().min(1, { message: 'Agency name must be at least 1 char' }),
  country: z
    .string()
    .min(1, { message: 'Agency name must be at least 1 char' }),
  agencyLogo: z
    .string()
    .min(1, { message: 'Agency name must be at least 1 char' }),
});

export type TAgencyDetailsSchema = z.infer<typeof AgencyDetailsSchema>;
