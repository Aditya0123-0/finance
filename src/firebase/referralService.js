/**
 * referralService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Firestore `referrals` collection service.
 *
 * Authenticated clients submit referrals; admins review and pay out.
 *
 * Document shape (referrals/{id}):
 * {
 *   referrerUserId:    string,          // authenticated submitter uid
 *   referrerName:      string,
 *   referrerEmail:     string,
 *   refereeName:       string,
 *   refereeEmail:      string,
 *   refereePhone:      string,
 *   serviceInterest:   string,
 *   note:              string,
 *   status:            'pending' | 'contacted' | 'converted' | 'rejected',
 *   rewardStatus:      'unpaid' | 'paid',
 *   adminNote:         string | null,
 *   createdAt:         Timestamp,
 *   updatedAt:         Timestamp,
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

const COL = COLLECTIONS.REFERRALS;

// ─── Create ───────────────────────────────────────────────────────────────────

/**
 * Submit a new referral.
 *
 * @param {string} referrerUserId
 * @param {{
 *   referrerName: string,
 *   referrerEmail: string,
 *   refereeName: string,
 *   refereeEmail: string,
 *   refereePhone?: string,
 *   serviceInterest?: string,
 *   note?: string,
 * }} formData
 * @returns {{ data: string | null, error: object | null }}
 */
export async function submitReferral(referrerUserId, formData) {
  return addDocument(COL, {
    referrerUserId,
    referrerName: formData.referrerName || '',
    referrerEmail: formData.referrerEmail || '',
    refereeName: formData.refereeName || '',
    refereeEmail: formData.refereeEmail || '',
    refereePhone: formData.refereePhone || '',
    serviceInterest: formData.serviceInterest || '',
    note: formData.note || '',
    status: 'pending',
    rewardStatus: 'unpaid',
    adminNote: null,
  });
}

// ─── Read ─────────────────────────────────────────────────────────────────────

/**
 * Fetch a single referral by id.
 */
export async function getReferral(id) {
  return getDocument(COL, id);
}

/**
 * Fetch all referrals submitted by a specific user.
 */
export async function getUserReferrals(referrerUserId) {
  return getDocuments(COL, {
    where: [['referrerUserId', '==', referrerUserId]],
    orderBy: ['createdAt', 'desc'],
  });
}

/**
 * Fetch all referrals for admin review, optionally filtered by status.
 */
export async function getAllReferrals({ status, limit: lim } = {}) {
  const constraints = { orderBy: ['createdAt', 'desc'] };
  if (status) constraints.where = [['status', '==', status]];
  if (lim) constraints.limit = lim;
  return getDocuments(COL, constraints);
}

// ─── Update ───────────────────────────────────────────────────────────────────

/**
 * Update referral status (admin use).
 * @param {'pending'|'contacted'|'converted'|'rejected'} status
 */
export async function updateReferralStatus(id, status, adminNote = null) {
  return updateDocument(COL, id, {
    status,
    ...(adminNote !== null ? { adminNote } : {}),
  });
}

/**
 * Mark the referral reward as paid (admin use).
 */
export async function markRewardPaid(id) {
  return updateDocument(COL, id, { rewardStatus: 'paid' });
}

// ─── Delete ───────────────────────────────────────────────────────────────────

/**
 * Delete a referral (admin only).
 */
export async function deleteReferral(id) {
  return deleteDocument(COL, id);
}

// ─── Real-time ────────────────────────────────────────────────────────────────

/**
 * Subscribe to all referrals for a user in real time.
 */
export function subscribeToUserReferrals(referrerUserId, callback) {
  return subscribeToCollection(
    COL,
    { where: [['referrerUserId', '==', referrerUserId]], orderBy: ['createdAt', 'desc'] },
    callback,
  );
}
