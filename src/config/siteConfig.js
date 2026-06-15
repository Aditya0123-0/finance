import { env } from './env.js';

export const siteConfig = {
  name: env.appName,
  url: env.appUrl,
  email: env.contactEmail,
  phone: env.contactPhone,
  whatsappNumber: env.whatsappNumber,
  description:
    'US tax filing, ITIN, FBAR, FATCA, bookkeeping, payroll, and CPA back-office support services.',
};
