/**
 * authService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Firebase Authentication service.
 *
 * Covers:
 *   • Email / password sign-up & sign-in
 *   • Google OAuth sign-in
 *   • Sign-out
 *   • Password reset email
 *   • Display-name / photo update
 *   • Auth-state observer (for AuthContext)
 *
 * All functions return { data, error } so callers never need try/catch.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../config/firebase.js';

// ─── helpers ─────────────────────────────────────────────────────────────────

/**
 * Wraps a Firebase Auth call and returns { data, error }.
 * Never throws; the caller decides how to handle `error`.
 */
async function run(fn) {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (err) {
    return { data: null, error: normalizeAuthError(err) };
  }
}

/**
 * Maps Firebase Auth error codes to user-friendly messages.
 */
function normalizeAuthError(err) {
  const map = {
    'auth/email-already-in-use':
      'An account with this email already exists. Please sign in.',
    'auth/invalid-email': 'The email address is not valid.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/too-many-requests':
      'Too many failed attempts. Please wait a moment and try again.',
    'auth/popup-closed-by-user': 'Sign-in popup was closed before completing.',
    'auth/network-request-failed':
      'A network error occurred. Check your connection.',
    'auth/user-disabled': 'This account has been disabled.',
  };

  return {
    code: err.code || 'auth/unknown',
    message: map[err.code] || err.message || 'An unexpected error occurred.',
  };
}

// ─── Google provider (singleton) ─────────────────────────────────────────────

const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Register a new user with email and password.
 * @returns {{ data: UserCredential | null, error: { code, message } | null }}
 */
export async function registerWithEmail(email, password) {
  return run(() => createUserWithEmailAndPassword(auth, email, password));
}

/**
 * Sign in an existing user with email and password.
 * @returns {{ data: UserCredential | null, error: { code, message } | null }}
 */
export async function signInWithEmail(email, password) {
  return run(() => signInWithEmailAndPassword(auth, email, password));
}

/**
 * Sign in (or register) via Google OAuth popup.
 * @returns {{ data: UserCredential | null, error: { code, message } | null }}
 */
export async function signInWithGoogle() {
  return run(() => signInWithPopup(auth, googleProvider));
}

/**
 * Sign out the current user.
 * @returns {{ data: true | null, error: { code, message } | null }}
 */
export async function logOut() {
  return run(async () => {
    await signOut(auth);
    return true;
  });
}

/**
 * Send a password-reset email.
 * @returns {{ data: true | null, error: { code, message } | null }}
 */
export async function resetPassword(email) {
  return run(async () => {
    await sendPasswordResetEmail(auth, email);
    return true;
  });
}

/**
 * Update the current user's display name and/or photo URL.
 * @param {{ displayName?: string, photoURL?: string }} updates
 * @returns {{ data: true | null, error: { code, message } | null }}
 */
export async function updateUserProfile(updates) {
  return run(async () => {
    if (!auth.currentUser) throw { code: 'auth/no-current-user', message: 'No user is signed in.' };
    await updateProfile(auth.currentUser, updates);
    return true;
  });
}

/**
 * Subscribe to auth-state changes.
 * Returns the unsubscribe function.
 *
 * @param {(user: import('firebase/auth').User | null) => void} callback
 * @returns {() => void} unsubscribe
 */
export function onAuthStateChange(callback) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Direct access to the auth instance for advanced use.
 */
export { auth };
