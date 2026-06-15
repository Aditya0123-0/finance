/**
 * servicesService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Firestore `services` collection service.
 *
 * Admins manage CMS service records. Public reads active services.
 * Falls back to static `fallbackServices` data when Firestore has no docs.
 *
 * Document shape (services/{slug}):
 * {
 *   slug:              string,   // used as document id
 *   title:             string,
 *   heroTitle:         string,
 *   category:          string,
 *   categoryLabel:     string,
 *   description:       string,
 *   longDescription:   string,
 *   features:          string[],
 *   benefits:          string[],
 *   processSteps:      string[],
 *   requiredDocuments: string[],
 *   faqs:              Array<{ question: string, answer: string }>,
 *   ctaText:           string,
 *   inquirySubject:    string,
 *   isActive:          boolean,
 *   sortOrder:         number,
 *   createdAt:         Timestamp,
 *   updatedAt:         Timestamp,
 * }
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { fallbackServices } from '../data/fallbackServices.js';
import { COLLECTIONS } from '../constants/collections.js';
import {
  deleteDocument,
  getDocument,
  getDocuments,
  setDocument,
  subscribeToCollection,
  updateDocument,
} from './firestoreService.js';

const COL = COLLECTIONS.SERVICES;

// ─── Public reads ─────────────────────────────────────────────────────────────

/**
 * Fetch all active services from Firestore.
 * Falls back to static data if Firestore returns an empty set or errors.
 *
 * @returns {{ data: object[], error: object | null }}
 */
export async function getActiveServices() {
  const { data, error } = await getDocuments(COL, {
    where: [['isActive', '==', true]],
    orderBy: ['sortOrder', 'asc'],
  });

  // Graceful fallback to bundled static data
  if (error || !data || data.length === 0) {
    return { data: fallbackServices, error: null };
  }
  return { data, error: null };
}

/**
 * Fetch a single active service by slug.
 * Falls back to static data if not found in Firestore.
 *
 * @param {string} slug
 */
export async function getServiceBySlug(slug) {
  const { data, error } = await getDocument(COL, slug);

  if (error || !data) {
    const fallback = fallbackServices.find((s) => s.slug === slug) || null;
    return { data: fallback, error: null };
  }
  return { data, error: null };
}

// ─── Admin reads ──────────────────────────────────────────────────────────────

/**
 * Fetch all services (active and inactive) for admin management.
 */
export async function getAllServices() {
  return getDocuments(COL, { orderBy: ['sortOrder', 'asc'] });
}

// ─── Create / Update (Upsert) ─────────────────────────────────────────────────

/**
 * Create or overwrite a service document.
 * Document id is always set to the service slug for easy slug-based routing.
 *
 * @param {object} serviceData  – must include a `slug` field
 */
export async function upsertService(serviceData) {
  const { slug, ...rest } = serviceData;
  if (!slug) return { data: null, error: { code: 'invalid-arg', message: 'slug is required.' } };

  return setDocument(COL, slug, {
    slug,
    isActive: true,
    sortOrder: 100,
    ...rest,
  });
}

/**
 * Partially update a service document (admin use).
 */
export async function updateService(slug, updates) {
  return updateDocument(COL, slug, updates);
}

/**
 * Toggle the active state of a service.
 */
export async function toggleServiceActive(slug, isActive) {
  return updateDocument(COL, slug, { isActive });
}

// ─── Delete ───────────────────────────────────────────────────────────────────

/**
 * Delete a service document (admin only).
 */
export async function deleteService(slug) {
  return deleteDocument(COL, slug);
}

// ─── Seed ─────────────────────────────────────────────────────────────────────

/**
 * Seed Firestore with all static fallback services.
 * Safe to run multiple times — uses setDocument with merge so existing
 * admin edits are preserved.
 *
 * Intended for first-time project setup or a reset.
 */
export async function seedServicesFromFallback() {
  const results = await Promise.all(
    fallbackServices.map((service) =>
      setDocument(COL, service.slug, {
        isActive: true,
        sortOrder: fallbackServices.indexOf(service),
        ...service,
      }),
    ),
  );

  const errors = results.filter((r) => r.error);
  return {
    data: { seeded: results.length - errors.length, failed: errors.length },
    error: errors.length > 0 ? errors[0].error : null,
  };
}

// ─── Real-time ────────────────────────────────────────────────────────────────

/**
 * Subscribe to active services in real time.
 */
export function subscribeToActiveServices(callback) {
  return subscribeToCollection(
    COL,
    { where: [['isActive', '==', true]], orderBy: ['sortOrder', 'asc'] },
    callback,
  );
}
