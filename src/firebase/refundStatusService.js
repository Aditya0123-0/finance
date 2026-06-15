/**
 * refundStatusService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Firestore `refundStatusRequests` collection service.
 *
 * Authenticated clients can submit refund-status check requests and
 * track the admin response. Admins can update statuses.
 *
 * Document shape (refundStatusRequests/{id}):
 * {
 *   userId:         string,         // Firebase Auth uid (required)
 *   taxYear:        string,         // e.g. '2023'
 *   filingType:     string,         // 'federal' | 'state' | 'both'
 *   filingStatus:   string,         // 'single' | 'married-jointly' | etc.
 *   ssn4:           string,         // last 4 digits only
 *   expectedRefund: string,         // approximate amount string
 *   note:           string,
 *   status:         'pending' | 'in-review' | 'resolved',
 *   adminResponse:  string | null,
 *   createdAt:      Timestamp,
 *   updatedAt:      Timestamp,
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
  subscribeToDocument,
  updateDocument,
} from './firestoreService.js';

const COL = COLLECTIONS.REFUND_STATUS_REQUESTS;

// ─── Create ───────────────────────────────────────────────────────────────────

/**
 * Submit a refund status check request.
 *
 * @param {string} userId
 * @param {{
 *   taxYear: string,
 *   filingType: string,
 *   filingStatus: string,
 *   ssn4: string,
 *   expectedRefund?: string,
 *   note?: string,
 * }} formData
 * @returns {{ data: string | null, error: object | null }}
 */
export async function submitRefundStatusRequest(userId, formData) {
  return addDocument(COL, {
    userId,
    taxYear: formData.taxYear || '',
    filingType: formData.filingType || 'federal',
    filingStatus: formData.filingStatus || '',
    ssn4: formData.ssn4 || '',
    expectedRefund: formData.expectedRefund || '',
    note: formData.note || '',
    status: 'pending',
    adminResponse: null,
  });
}

// ─── Read ─────────────────────────────────────────────────────────────────────

/**
 * Fetch a single refund status request by id.
 */
export async function getRefundStatusRequest(id) {
  return getDocument(COL, id);
}

/**
 * Fetch all refund status requests for a user.
 */
export async function getUserRefundRequests(userId) {
  return getDocuments(COL, {
    where: [['userId', '==', userId]],
    orderBy: ['createdAt', 'desc'],
  });
}

/**
 * Fetch all requests (admin use), optionally filtered by status.
 */
export async function getAllRefundRequests({ status, limit: lim } = {}) {
  const constraints = { orderBy: ['createdAt', 'desc'] };
  if (status) constraints.where = [['status', '==', status]];
  if (lim) constraints.limit = lim;
  return getDocuments(COL, constraints);
}

// ─── Update ───────────────────────────────────────────────────────────────────

/**
 * Update the status and optional admin response (admin use).
 */
export async function updateRefundRequestStatus(id, status, adminResponse = null) {
  return updateDocument(COL, id, { status, adminResponse });
}

// ─── Delete ───────────────────────────────────────────────────────────────────

/**
 * Delete a request (admin only).
 */
export async function deleteRefundRequest(id) {
  return deleteDocument(COL, id);
}

// ─── Real-time ────────────────────────────────────────────────────────────────

/**
 * Subscribe to a single request in real time (client dashboard).
 */
export function subscribeToRefundRequest(id, callback) {
  return subscribeToDocument(COL, id, callback);
}

/**
 * Subscribe to all user refund requests in real time.
 */
export function subscribeToUserRefundRequests(userId, callback) {
  return subscribeToCollection(
    COL,
    { where: [['userId', '==', userId]], orderBy: ['createdAt', 'desc'] },
    callback,
  );
}
