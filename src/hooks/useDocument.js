import { useState, useEffect } from 'react';
import { subscribeToDocument } from '../firebase';

/**
 * Custom hook to subscribe to a single Firestore document in real time.
 *
 * @param {string} collectionPath
 * @param {string} docId
 * @returns {{ data: any | null, loading: boolean, error: any }}
 */
export function useDocument(collectionPath, docId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!collectionPath || !docId) {
      setData(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToDocument(collectionPath, docId, (docData, err) => {
      if (err) {
        setError(err);
        setData(null);
      } else {
        setData(docData);
        setError(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [collectionPath, docId]);

  return { data, loading, error };
}

