/**
 * firestoreService.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Generic Firestore CRUD layer.
 *
 * All public functions return { data, error, loading } or, for real-time
 * subscriptions, return an unsubscribe function.
 *
 * Collection-specific services import and use these primitives so
 * Firestore SDK calls are never scattered across the app.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../config/firebase.js';

// ─── helpers ─────────────────────────────────────────────────────────────────

/**
 * Wraps a Firestore call and returns { data, error }.
 * Never throws — callers decide how to handle errors.
 */
async function run(fn) {
  try {
    const data = await fn();
    return { data, error: null };
  } catch (err) {
    console.error('[firestoreService]', err);
    return { data: null, error: normalizeError(err) };
  }
}

function normalizeError(err) {
  return {
    code: err.code || 'firestore/unknown',
    message: err.message || 'An unexpected Firestore error occurred.',
  };
}

/**
 * Converts a Firestore DocumentSnapshot to a plain object that always
 * includes the document `id`.
 */
function docToData(snapshot) {
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() };
}

/**
 * Converts a Firestore QuerySnapshot to an array of plain objects.
 */
function queryToData(snapshot) {
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// ─── Constraint builder ───────────────────────────────────────────────────────

/**
 * Builds an array of Firestore query constraints from a plain config object.
 *
 * @param {{
 *   where?: Array<[field: string, op: string, value: any]>,
 *   orderBy?: Array<[field: string, direction?: 'asc'|'desc']> | [string, string?],
 *   limit?: number,
 * }} constraints
 */
function buildConstraints(constraints = {}) {
  const parts = [];

  if (constraints.where) {
    for (const [field, op, value] of constraints.where) {
      parts.push(where(field, op, value));
    }
  }

  if (constraints.orderBy) {
    const ob = constraints.orderBy;
    if (typeof ob[0] === 'string') {
      // Single: ['field', 'asc']
      parts.push(orderBy(ob[0], ob[1] || 'asc'));
    } else {
      // Multiple: [['field1','asc'],['field2','desc']]
      for (const [field, dir = 'asc'] of ob) {
        parts.push(orderBy(field, dir));
      }
    }
  }

  if (constraints.limit) {
    parts.push(limit(constraints.limit));
  }

  return parts;
}

// ─── Single-document operations ───────────────────────────────────────────────

/**
 * Fetch a single document by collection path and document id.
 * @returns {{ data: object | null, error: object | null }}
 */
export async function getDocument(collectionPath, id) {
  return run(async () => {
    const snap = await getDoc(doc(db, collectionPath, id));
    return docToData(snap);
  });
}

/**
 * Create or overwrite a document with a known id.
 * Automatically merges `createdAt` and `updatedAt` server timestamps.
 * @returns {{ data: string, error: object | null }}  data = document id
 */
export async function setDocument(collectionPath, id, data) {
  return run(async () => {
    const ref = doc(db, collectionPath, id);
    await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
    return id;
  });
}

/**
 * Add a new document with an auto-generated id.
 * Automatically adds `createdAt` and `updatedAt` server timestamps.
 * @returns {{ data: string, error: object | null }}  data = new document id
 */
export async function addDocument(collectionPath, data) {
  return run(async () => {
    const ref = await addDoc(collection(db, collectionPath), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return ref.id;
  });
}

/**
 * Partially update specific fields in an existing document.
 * Automatically updates `updatedAt` server timestamp.
 * @returns {{ data: string, error: object | null }}  data = document id
 */
export async function updateDocument(collectionPath, id, data) {
  return run(async () => {
    await updateDoc(doc(db, collectionPath, id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return id;
  });
}

/**
 * Permanently delete a document.
 * @returns {{ data: true, error: object | null }}
 */
export async function deleteDocument(collectionPath, id) {
  return run(async () => {
    await deleteDoc(doc(db, collectionPath, id));
    return true;
  });
}

// ─── Collection queries ───────────────────────────────────────────────────────

/**
 * Fetch multiple documents from a collection with optional constraints.
 *
 * @param {string} collectionPath
 * @param {{
 *   where?: Array<[field, op, value]>,
 *   orderBy?: [field, dir?] | Array<[field, dir?]>,
 *   limit?: number,
 * }} constraints
 * @returns {{ data: object[], error: object | null }}
 */
export async function getDocuments(collectionPath, constraints = {}) {
  return run(async () => {
    const parts = buildConstraints(constraints);
    const q = query(collection(db, collectionPath), ...parts);
    const snap = await getDocs(q);
    return queryToData(snap);
  });
}

// ─── Real-time subscriptions ──────────────────────────────────────────────────

/**
 * Subscribe to a single document in real time.
 *
 * @param {string} collectionPath
 * @param {string} id
 * @param {(data: object | null, error: object | null) => void} callback
 * @returns {() => void} unsubscribe function
 */
export function subscribeToDocument(collectionPath, id, callback) {
  const ref = doc(db, collectionPath, id);
  return onSnapshot(
    ref,
    (snap) => callback(docToData(snap), null),
    (err) => {
      console.error('[subscribeToDocument]', err);
      callback(null, normalizeError(err));
    },
  );
}

/**
 * Subscribe to a collection query in real time.
 *
 * @param {string} collectionPath
 * @param {{
 *   where?: Array<[field, op, value]>,
 *   orderBy?: [field, dir?] | Array<[field, dir?]>,
 *   limit?: number,
 * }} constraints
 * @param {(data: object[], error: object | null) => void} callback
 * @returns {() => void} unsubscribe function
 */
export function subscribeToCollection(collectionPath, constraints = {}, callback) {
  const parts = buildConstraints(constraints);
  const q = query(collection(db, collectionPath), ...parts);
  return onSnapshot(
    q,
    (snap) => callback(queryToData(snap), null),
    (err) => {
      console.error('[subscribeToCollection]', err);
      callback([], normalizeError(err));
    },
  );
}

/**
 * Direct access to the Firestore instance for advanced use.
 */
export { db };
