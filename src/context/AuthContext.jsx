import { createContext, useState, useEffect, useMemo } from 'react';
import {
  onAuthStateChange,
  signInWithEmail,
  registerWithEmail,
  signInWithGoogle,
  logOut,
  resetPassword,
  updateAuthProfile,
  ensureUserProfile,
  subscribeToUserProfile,
  updateUserProfile,
} from '../firebase';

export const AuthContext = createContext({
  currentUser: null,
  userProfile: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  loginWithGoogle: async () => {},
  logout: async () => {},
  resetPasswordEmail: async () => {},
  updateProfile: async () => {},
});

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeProfile = null;

    const unsubscribeAuth = onAuthStateChange(async (user) => {
      // Clean up previous profile listener if any
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (user) {
        try {
          // Ensure a profile document exists in Firestore for the authenticated user
          await ensureUserProfile(user);

          // Subscribe to real-time updates of the user's profile
          unsubscribeProfile = subscribeToUserProfile(user.uid, (profile, error) => {
            if (error) {
              console.error('[AuthContext] Profile subscription error:', error);
            }
            // Once profile data is received (even if null or error), we are no longer loading
            setUserProfile(profile);
            setCurrentUser(user);
            setLoading(false);
          });
        } catch (err) {
          console.error('[AuthContext] Error syncing user profile:', err);
          setCurrentUser(user);
          setUserProfile(null);
          setLoading(false);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) {
        unsubscribeProfile();
      }
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    const result = await signInWithEmail(email, password);
    if (result.error) setLoading(false);
    return result;
  };

  const register = async (email, password, additionalProfileData = {}) => {
    setLoading(true);
    const result = await registerWithEmail(email, password);
    if (result.data?.user) {
      const user = result.data.user;
      // We can pre-populate profile properties
      await ensureUserProfile({
        uid: user.uid,
        email: user.email,
        displayName: additionalProfileData.displayName || user.displayName,
        photoURL: additionalProfileData.photoURL || user.photoURL,
        ...additionalProfileData,
      });
    } else {
      setLoading(false);
    }
    return result;
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    const result = await signInWithGoogle();
    if (result.error) setLoading(false);
    return result;
  };

  const logout = async () => {
    setLoading(true);
    const result = await logOut();
    setLoading(false);
    return result;
  };

  const resetPasswordEmail = async (email) => {
    return resetPassword(email);
  };

  const updateProfile = async (updates) => {
    if (!currentUser) {
      return { data: null, error: { code: 'auth/no-current-user', message: 'No user is signed in.' } };
    }
    setLoading(true);

    const authUpdates = {};
    const profileUpdates = {};

    if (updates.displayName !== undefined) {
      authUpdates.displayName = updates.displayName;
      profileUpdates.displayName = updates.displayName;
    }
    if (updates.photoURL !== undefined) {
      authUpdates.photoURL = updates.photoURL;
      profileUpdates.photoURL = updates.photoURL;
    }
    if (updates.phone !== undefined) {
      profileUpdates.phone = updates.phone;
    }

    // Update Auth profile first
    if (Object.keys(authUpdates).length > 0) {
      const authResult = await updateAuthProfile(authUpdates);
      if (authResult.error) {
        setLoading(false);
        return authResult;
      }
    }

    // Update Firestore user profile
    if (Object.keys(profileUpdates).length > 0) {
      const profileResult = await updateUserProfile(currentUser.uid, profileUpdates);
      if (profileResult.error) {
        setLoading(false);
        return profileResult;
      }
    }

    setLoading(false);
    return { data: true, error: null };
  };

  const value = useMemo(
    () => ({
      currentUser,
      userProfile,
      loading,
      login,
      register,
      loginWithGoogle,
      logout,
      resetPasswordEmail,
      updateProfile,
    }),
    [currentUser, userProfile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

