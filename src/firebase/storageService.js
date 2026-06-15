/**
 * storageService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Firebase Storage service.
 *
 * Covers:
 *   • uploadFile    – upload with real-time progress callback
 *   • deleteFile    – delete by storage path
 *   • getDownloadUrl – fetch a signed download URL for a path
 *   • listFiles     – list all items under a storage prefix
 *
 * Storage paths follow the security-rule pattern:
 *   users/{userId}/documents/{category}/{fileName}
 *
 * All functions return { data, error } — callers never need try/catch.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { storage } from '../config/firebase.js';

// ─── helpers ─────────────────────────────────────────────────────────────────

function normalizeError(err) {
  const map = {
    'storage/object-not-found': 'File not found in storage.',
    'storage/unauthorized': 'You do not have permission to access this file.',
    'storage/canceled': 'Upload was cancelled.',
    'storage/unknown': 'An unknown storage error occurred.',
    'storage/quota-exceeded': 'Storage quota exceeded.',
  };
  return {
    code: err.code || 'storage/unknown',
    message: map[err.code] || err.message || 'An unexpected storage error occurred.',
  };
}

// ─── Path helpers ─────────────────────────────────────────────────────────────

/**
 * Build the canonical storage path for a user document.
 * Pattern: users/{userId}/documents/{category}/{sanitisedFileName}
 *
 * @param {string} userId
 * @param {string} category   – e.g. 'tax-returns', 'identity'
 * @param {string} fileName
 */
export function buildDocumentPath(userId, category, fileName) {
  const safe = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `users/${userId}/documents/${category}/${safe}`;
}

// ─── Upload ───────────────────────────────────────────────────────────────────

/**
 * Upload a File to Firebase Storage with optional progress reporting.
 *
 * @param {string}   storagePath  – full path inside the bucket
 * @param {File}     file         – browser File object
 * @param {{
 *   onProgress?: (pct: number) => void,
 *   metadata?:   object,
 * }} options
 * @returns {Promise<{ data: { downloadUrl: string, path: string } | null, error: object | null }>}
 */
export function uploadFile(storagePath, file, { onProgress, metadata = {} } = {}) {
  return new Promise((resolve) => {
    const storageRef = ref(storage, storagePath);
    const task = uploadBytesResumable(storageRef, file, {
      contentType: file.type,
      ...metadata,
    });

    task.on(
      'state_changed',
      (snapshot) => {
        if (onProgress) {
          const pct = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          );
          onProgress(pct);
        }
      },
      (err) => {
        resolve({ data: null, error: normalizeError(err) });
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(task.snapshot.ref);
          resolve({ data: { downloadUrl, path: storagePath }, error: null });
        } catch (err) {
          resolve({ data: null, error: normalizeError(err) });
        }
      },
    );
  });
}

// ─── Delete ───────────────────────────────────────────────────────────────────

/**
 * Delete a file from Firebase Storage by its full storage path.
 *
 * @param {string} storagePath
 * @returns {Promise<{ data: true | null, error: object | null }>}
 */
export async function deleteFile(storagePath) {
  try {
    await deleteObject(ref(storage, storagePath));
    return { data: true, error: null };
  } catch (err) {
    console.error('[storageService.deleteFile]', err);
    return { data: null, error: normalizeError(err) };
  }
}

// ─── Download URL ─────────────────────────────────────────────────────────────

/**
 * Get a public download URL for a file that already exists in Storage.
 *
 * @param {string} storagePath
 * @returns {Promise<{ data: string | null, error: object | null }>}
 */
export async function getFileDownloadUrl(storagePath) {
  try {
    const url = await getDownloadURL(ref(storage, storagePath));
    return { data: url, error: null };
  } catch (err) {
    console.error('[storageService.getFileDownloadUrl]', err);
    return { data: null, error: normalizeError(err) };
  }
}

// ─── List files ───────────────────────────────────────────────────────────────

/**
 * List all files under a storage path prefix.
 * Returns an array of { name, fullPath }.
 *
 * @param {string} storagePrefix  – e.g. 'users/{uid}/documents/'
 * @returns {Promise<{ data: Array<{ name: string, fullPath: string }> | null, error: object | null }>}
 */
export async function listFiles(storagePrefix) {
  try {
    const result = await listAll(ref(storage, storagePrefix));
    const items = result.items.map((item) => ({
      name: item.name,
      fullPath: item.fullPath,
    }));
    return { data: items, error: null };
  } catch (err) {
    console.error('[storageService.listFiles]', err);
    return { data: null, error: normalizeError(err) };
  }
}

/**
 * Direct access to the Storage instance for advanced use.
 */
export { storage };
