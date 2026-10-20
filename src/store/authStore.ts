import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { db } from '../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const TOKEN_TTL_MS = 55 * 60 * 1000; // 55 minutes

interface TokenEntry {
  token: string;
  storedAt: number;
}

interface AuthStore {
  googleAccessToken: string | null;
  googleTokenStoredAt: number | null;

  // Set token — also writes to Firestore if uid provided
  setGoogleToken: (token: string, uid?: string) => Promise<void>;

  // Get token only if not expired
  getValidToken: () => string | null;

  // Clear token on sign-out
  clearGoogleToken: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      googleAccessToken: null,
      googleTokenStoredAt: null,

      setGoogleToken: async (token: string, uid?: string) => {
        const now = Date.now();
        set({ googleAccessToken: token, googleTokenStoredAt: now });

        // Persist token metadata to Firestore (not the token itself — store TTL marker)
        if (uid) {
          try {
            await setDoc(
              doc(db, 'users', uid, 'private', 'googleToken'),
              { connectedAt: serverTimestamp(), expiresAt: new Date(now + TOKEN_TTL_MS).toISOString() },
              { merge: true }
            );
          } catch {
            // Non-fatal: Firestore write failure doesn't break the app
          }
        }
      },

      getValidToken: () => {
        const { googleAccessToken, googleTokenStoredAt } = get();
        if (!googleAccessToken || !googleTokenStoredAt) return null;
        if (Date.now() - googleTokenStoredAt > TOKEN_TTL_MS) {
          set({ googleAccessToken: null, googleTokenStoredAt: null });
          return null;
        }
        return googleAccessToken;
      },

      clearGoogleToken: () => {
        set({ googleAccessToken: null, googleTokenStoredAt: null });
      },
    }),
    {
      name: 'neev-auth-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        googleAccessToken: state.googleAccessToken,
        googleTokenStoredAt: state.googleTokenStoredAt,
      }),
    }
  )
);
