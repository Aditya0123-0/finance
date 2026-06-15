import { useState, useEffect } from 'react';
import { subscribeToCollection } from '../firebase';

/**
 * Custom hook to subscribe to a Firestore collection in real time.
 * Automatically handles serialization of constraints to prevent infinite loops.
 *
 * @param {string} collectionPath
 * @param {object} [constraints] - { where, orderBy, limit }
 * @returns {{ data: any[], loading: boolean, error: any }}
 */
export function useCollection(collectionPath, constraints = {}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Serialize constraints to prevent infinite re-subscriptions from inline object declarations
  const constraintsKey = JSON.stringify(constraints);

  useEffect(() => {
    if (!collectionPath) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToCollection(collectionPath, constraints, (items, err) => {
      if (err) {
        setError(err);
        setData([]);
      } else {
        setData(items);
        setError(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [collectionPath, constraintsKey]);

  return { data, loading, error };
}

