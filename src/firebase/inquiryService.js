/**
 * inquiryService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Firestore `inquiries` collection service.
 *
 * Used for:
 *   • Public contact form submissions (no auth required)
 *   • Service-specific inquiry forms on /services/:slug
 *
 * Document shape (inquiries/{id}):
 * {
 *   fullName:                string,
 *   email:                   string,
 *   phone:                   string,
 *   serviceInterest:         string,
 *   customServiceDescription?: string,
 *   subject:                 string,
 *   message:                 string,
 *   userId:                  string | null,  // null for anonymous
 *   status:                  'new' | 'in-review' | 'resolved',
 *   source:                  'contact-page' | 'service-page' | 'other',
 *   createdAt:               Timestamp,
 *   updatedAt:               Timestamp,
 * }
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { COLLECTIONS } from '../constants/collections.js';
import {
  addDocument,
  deleteDocument,
  getDocument,
  getDocuments,
  subscribeToCollection,
  updateDocument,
} from './firestoreService.js';

const COL = COLLECTIONS.INQUIRIES;

// ─── Create ───────────────────────────────────────────────────────────────────

/**
 * Submit a new inquiry.
 * Can be called with or without an authenticated user.
 *
 * @param {{
 *   fullName: string,
 *   email: string,
 *   phone?: string,
 *   serviceInterest: string,
 *   customServiceDescription?: string,
 *   subject?: string,
 *   message: string,
 *   source?: 'contact-page' | 'service-page' | 'other',
 * }} formData
 * @param {string | null} userId – Firebase Auth uid or null for anonymous
 * @returns {{ data: string | null, error: object | null }}  data = new doc id
 */
export async function submitInquiry(formData, userId = null) {
  return addDocument(COL, {
    fullName: formData.fullName || '',
    email: formData.email || '',
    phone: formData.phone || '',
    serviceInterest: formData.serviceInterest || '',
    customServiceDescription: formData.customServiceDescription || '',
    subject: formData.subject || '',
    message: formData.message || '',
    userId,
    status: 'new',
    source: formData.source || 'contact-page',
  });
}

// ─── Read ─────────────────────────────────────────────────────────────────────

/**
 * Fetch a single inquiry by id (admin only).
 */
export async function getInquiry(id) {
  return getDocument(COL, id);
}

/**
 * Fetch all inquiries, optionally filtered by status (admin use).
 *
 * @param {{ status?: string, limit?: number }} options
 */
export async function getInquiries({ status, limit: lim } = {}) {
  const constraints = {
    orderBy: ['createdAt', 'desc'],
  };
  if (status) {
    constraints.where = [['status', '==', status]];
  }
  if (lim) {
    constraints.limit = lim;
  }
  return getDocuments(COL, constraints);
}

/**
 * Fetch inquiries submitted by a specific user.
 */
export async function getUserInquiries(userId) {
  return getDocuments(COL, {
    where: [['userId', '==', userId]],
    orderBy: ['createdAt', 'desc'],
  });
}

// ─── Update ───────────────────────────────────────────────────────────────────

/**
 * Update the status of an inquiry (admin use).
 * @param {string} id
 * @param {'new' | 'in-review' | 'resolved'} status
 */
export async function updateInquiryStatus(id, status) {
  return updateDocument(COL, id, { status });
}

/**
 * Add admin notes to an inquiry.
 */
export async function addInquiryNote(id, note) {
  return updateDocument(COL, id, { adminNote: note });
}

// ─── Delete ───────────────────────────────────────────────────────────────────

/**
 * Permanently delete an inquiry (admin only).
 */
export async function deleteInquiry(id) {
  return deleteDocument(COL, id);
}

// ─── Real-time ────────────────────────────────────────────────────────────────

/**
 * Subscribe to live inquiry updates for a user.
 * @param {string} userId
 * @param {(data: object[], error: object | null) => void} callback
 * @returns {() => void} unsubscribe
 */
export function subscribeToUserInquiries(userId, callback) {
  return subscribeToCollection(
    COL,
    { where: [['userId', '==', userId]], orderBy: ['createdAt', 'desc'] },
    callback,
  );
}
