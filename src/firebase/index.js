/**
 * src/firebase/index.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Barrel export for all Firebase service modules.
 *
 * Import from here to keep import paths short across the app:
 *   import { submitInquiry, getUserReferrals } from '../firebase';
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── Auth ─────────────────────────────────────────────────────────────────────
export {
  auth,
  logOut,
  onAuthStateChange,
  registerWithEmail,
  resetPassword,
  signInWithEmail,
  signInWithGoogle,
  updateUserProfile as updateAuthProfile,
} from './authService.js';

// ─── Firestore generic CRUD ───────────────────────────────────────────────────
export {
  addDocument,
  db,
  deleteDocument,
  getDocument,
  getDocuments,
  setDocument,
  subscribeToCollection,
  subscribeToDocument,
  updateDocument,
} from './firestoreService.js';

// ─── Storage ──────────────────────────────────────────────────────────────────
export {
  buildDocumentPath,
  deleteFile,
  getFileDownloadUrl,
  listFiles,
  storage,
  uploadFile,
} from './storageService.js';

// ─── Users collection ─────────────────────────────────────────────────────────
export {
  createUserProfile,
  ensureUserProfile,
  getUserProfile,
  subscribeToUserProfile,
  updateUserProfile,
} from './userService.js';

// ─── Inquiries collection ─────────────────────────────────────────────────────
export {
  addInquiryNote,
  deleteInquiry,
  getInquiries,
  getInquiry,
  getUserInquiries,
  submitInquiry,
  subscribeToUserInquiries,
  updateInquiryStatus,
} from './inquiryService.js';

// ─── Refund Status collection ─────────────────────────────────────────────────
export {
  deleteRefundRequest,
  getAllRefundRequests,
  getRefundStatusRequest,
  getUserRefundRequests,
  submitRefundStatusRequest,
  subscribeToRefundRequest,
  subscribeToUserRefundRequests,
  updateRefundRequestStatus,
} from './refundStatusService.js';

// ─── Referrals collection ─────────────────────────────────────────────────────
export {
  deleteReferral,
  getAllReferrals,
  getReferral,
  getUserReferrals,
  markRewardPaid,
  submitReferral,
  subscribeToUserReferrals,
  updateReferralStatus,
} from './referralService.js';

// ─── Testimonials collection ──────────────────────────────────────────────────
export {
  createTestimonial,
  deleteTestimonial,
  getActiveTestimonials,
  getAllTestimonials,
  getTestimonial,
  subscribeToActiveTestimonials,
  toggleTestimonialActive,
  updateTestimonial,
} from './testimonialService.js';

// ─── Services CMS collection ──────────────────────────────────────────────────
export {
  deleteService,
  getAllServices,
  getActiveServices,
  getServiceBySlug,
  seedServicesFromFallback,
  subscribeToActiveServices,
  toggleServiceActive,
  updateService,
  upsertService,
} from './servicesService.js';

// ─── Secure Refund Tracker collection ──────────────────────────────────────────
export {
  queryRefundStatusSecurely,
} from './refundStatusTrackerService.js';

