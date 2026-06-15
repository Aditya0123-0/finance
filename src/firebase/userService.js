/**
 * userService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Firestore `users` collection service.
 *
 * Document shape (users/{uid}):
 * {
 *   uid:         string,           // same as document id
 *   email:       string,
 *   displayName: string,
 *   photoURL:    string | null,
 *   phone:       string | null,
 *   role:        'client' | 'admin',
 *   createdAt:   Timestamp,
 *   updatedAt:   Timestamp,
 * }
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { COLLECTIONS } from '../constants/collections.js';
import {
  addDocument,
  getDocument,
  setDocument,
  subscribeToDocument,
  updateDocument,
} from './firestoreService.js';

const COL = COLLECTIONS.USERS;

// ─── Create ───────────────────────────────────────────────────────────────────

/**
 * Create a new user profile document after sign-up.
 * Uses setDocument so the doc id matches the Firebase Auth uid.
 *
 * @param {string} uid
 * @param {{ email: string, displayName?: string, photoURL?: string, phone?: string }} profile
 * @returns {{ data: string | null, error: object | null }}
 */
export async function createUserProfile(uid, profile) {
  return setDocument(COL, uid, {
    uid,
    email: profile.email || '',
    displayName: profile.displayName || '',
    photoURL: profile.photoURL || null,
    phone: profile.phone || null,
    role: 'client',
  });
}

// ─── Read ─────────────────────────────────────────────────────────────────────

/**
 * Fetch a user profile by uid.
 * @returns {{ data: object | null, error: object | null }}
 */
export async function getUserProfile(uid) {
  return getDocument(COL, uid);
}

// ─── Update ───────────────────────────────────────────────────────────────────

/**
 * Partially update a user profile.
 * @param {string} uid
 * @param {{ displayName?: string, photoURL?: string, phone?: string }} updates
 * @returns {{ data: string | null, error: object | null }}
 */
export async function updateUserProfile(uid, updates) {
  return updateDocument(COL, uid, updates);
}

// ─── Real-time ────────────────────────────────────────────────────────────────

/**
 * Subscribe to a user profile in real time.
 * @param {string} uid
 * @param {(profile: object | null, error: object | null) => void} callback
 * @returns {() => void} unsubscribe
 */
export function subscribeToUserProfile(uid, callback) {
  return subscribeToDocument(COL, uid, callback);
}

// ─── Ensure profile exists ────────────────────────────────────────────────────

/**
 * Called after every sign-in to ensure a Firestore profile exists.
 * Creates one with role:'client' if missing; otherwise leaves existing data.
 *
 * @param {import('firebase/auth').User} firebaseUser
 * @returns {{ data: string | null, error: object | null }}
 */
export async function ensureUserProfile(firebaseUser) {
  const { data: existing } = await getUserProfile(firebaseUser.uid);
  if (existing) return { data: firebaseUser.uid, error: null };

  return createUserProfile(firebaseUser.uid, {
    email: firebaseUser.email,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
  });
}
