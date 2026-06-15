const requiredFirebaseKeys = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
];

const defaultAppUrl = typeof window !== 'undefined' && window.location?.origin
  ? window.location.origin
  : '/';

export const env = {
  appName: import.meta.env.VITE_APP_NAME || 'TaxFiler Global',
  appUrl: import.meta.env.VITE_APP_URL || defaultAppUrl,
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '',
  contactEmail: import.meta.env.VITE_CONTACT_EMAIL || '',
  contactPhone: import.meta.env.VITE_CONTACT_PHONE || '',
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  },
};

export function getMissingFirebaseEnvKeys() {
  return requiredFirebaseKeys.filter((key) => !import.meta.env[key]);
}
