/**
 * refundStatusTrackerService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Secure Firestore `refundStatus` collection service.
 *
 * This service allows unauthenticated customers to query their specific
 * refund tracking record securely by matching three distinct fields.
 *
 * ─── FIRESTORE SCHEMA ───
 * Collection: `refundStatus`
 * Document ID: auto-generated or ${referenceNumber}
 * Document fields:
 * {
 *   referenceNumber: string,         // e.g. "REF-982301" (unique reference ID)
 *   email:           string,         // e.g. "client@example.com" (lowercase)
 *   phone:           string,         // e.g. "555-0199" (normalized phone string)
 *   customerName:    string,         // e.g. "Jane Doe"
 *   taxYear:         string,         // e.g. "2023"
 *   expectedRefund:  string,         // e.g. "$1,850.00"
 *   status:          'Pending Documents' | 'Documents Submitted' | 'Processing' | 'Completed' | 'Rejected',
 *   notes:           string,         // public tracker updates / logs
 *   updatedAt:       Timestamp,
 *   createdAt:       Timestamp,
 * }
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { getDocuments } from './firestoreService.js';
import { COLLECTIONS } from '../constants/collections.js';

// Fallback to 'refundStatus' if constant not defined in collections.js
const COL = COLLECTIONS.REFUND_STATUS || 'refundStatus';

/**
 * Query a refund status record securely using Email, Phone, and Reference Number.
 * The client must query by all three fields in order to satisfy the Firestore Security Rules.
 *
 * @param {string} email
 * @param {string} phone
 * @param {string} referenceNumber
 * @returns {{ data: object | null, error: object | null }}
 */
export async function queryRefundStatusSecurely(email, phone, referenceNumber) {
  if (!email || !phone || !referenceNumber) {
    return {
      data: null,
      error: { code: 'invalid-arguments', message: 'All search parameters are required.' },
    };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPhone = phone.trim().replace(/[^\d]/g, '');
  const normalizedReferenceNumber = referenceNumber.trim().toUpperCase();

  const constraints = {
    where: [
      ['email', '==', normalizedEmail],
      ['phone', '==', normalizedPhone],
      ['referenceNumber', '==', normalizedReferenceNumber],
    ],
    limit: 1,
  };

  const { data, error } = await getDocuments(COL, constraints);
  
  if (error) {
    return { data: null, error };
  }

  // Return the first match or null if no record matched
  return { data: data[0] || null, error: null };
}
