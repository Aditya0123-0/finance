/**
 * testimonialService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Firestore `testimonials` collection service.
 *
 * Public read (isActive == true). Admins manage all testimonials.
 *
 * Document shape (testimonials/{id}):
 * {
 *   authorName:   string,
 *   authorTitle:  string,           // e.g. 'NRI Client, New York'
 *   rating:       number,           // 1–5
 *   body:         string,
 *   serviceSlug:  string | null,    // link to a specific service
 *   isActive:     boolean,          // controls public visibility
 *   sortOrder:    number,           // lower = shown first
 *   createdAt:    Timestamp,
 *   updatedAt:    Timestamp,
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

const COL = COLLECTIONS.TESTIMONIALS;

// ─── Public reads ─────────────────────────────────────────────────────────────

/**
 * Fetch all active (visible) testimonials, sorted by sortOrder ascending.
 * Used on the home page and service pages.
 *
 * @param {{ limit?: number, serviceSlug?: string }} options
 */
export async function getActiveTestimonials({ limit: lim, serviceSlug } = {}) {
  const whereClause = serviceSlug
    ? [
        ['isActive', '==', true],
        ['serviceSlug', '==', serviceSlug],
      ]
    : [['isActive', '==', true]];

  return getDocuments(COL, {
    where: whereClause,
    orderBy: ['sortOrder', 'asc'],
    ...(lim ? { limit: lim } : {}),
  });
}

// ─── Admin reads ──────────────────────────────────────────────────────────────

/**
 * Fetch all testimonials (active and inactive) for admin management.
 */
export async function getAllTestimonials() {
  return getDocuments(COL, { orderBy: ['sortOrder', 'asc'] });
}

/**
 * Fetch a single testimonial by id.
 */
export async function getTestimonial(id) {
  return getDocument(COL, id);
}

// ─── Create ───────────────────────────────────────────────────────────────────

/**
 * Create a new testimonial (admin use).
 *
 * @param {{
 *   authorName: string,
 *   authorTitle?: string,
 *   rating: number,
 *   body: string,
 *   serviceSlug?: string,
 *   isActive?: boolean,
 *   sortOrder?: number,
 * }} data
 */
export async function createTestimonial(data) {
  return addDocument(COL, {
    authorName: data.authorName || '',
    authorTitle: data.authorTitle || '',
    rating: data.rating || 5,
    body: data.body || '',
    serviceSlug: data.serviceSlug || null,
    isActive: data.isActive ?? true,
    sortOrder: data.sortOrder ?? 100,
  });
}

// ─── Update ───────────────────────────────────────────────────────────────────

/**
 * Update any fields of a testimonial (admin use).
 */
export async function updateTestimonial(id, updates) {
  return updateDocument(COL, id, updates);
}

/**
 * Toggle a testimonial's active/visible state.
 */
export async function toggleTestimonialActive(id, isActive) {
  return updateDocument(COL, id, { isActive });
}

// ─── Delete ───────────────────────────────────────────────────────────────────

/**
 * Permanently delete a testimonial (admin only).
 */
export async function deleteTestimonial(id) {
  return deleteDocument(COL, id);
}

// ─── Real-time ────────────────────────────────────────────────────────────────

/**
 * Subscribe to active testimonials in real time (e.g. for a live home-page feed).
 */
export function subscribeToActiveTestimonials(callback, limit = 10) {
  return subscribeToCollection(
    COL,
    {
      where: [['isActive', '==', true]],
      orderBy: ['sortOrder', 'asc'],
      limit,
    },
    callback,
  );
}
