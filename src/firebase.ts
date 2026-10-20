import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

export const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("https://www.googleapis.com/auth/calendar");
googleProvider.addScope("https://www.googleapis.com/auth/tasks");
// googleProvider.addScope("https://www.googleapis.com/auth/gmail.readonly"); // Blocked: Gmail read/write disabled for sanctuary privacy
googleProvider.addScope("https://www.googleapis.com/auth/photoslibrary.readonly");
googleProvider.addScope("https://www.googleapis.com/auth/drive.readonly");
googleProvider.addScope("https://www.googleapis.com/auth/fitness.activity.read");
googleProvider.addScope("https://www.googleapis.com/auth/fitness.heart_rate.read");
googleProvider.addScope("https://www.googleapis.com/auth/fitness.body.read");
googleProvider.addScope("https://www.googleapis.com/auth/contacts.readonly");
googleProvider.setCustomParameters({ access_type: "offline" });

// Token helpers — delegate to the Zustand store (see src/store/authStore.ts).
// These thin wrappers let non-React code (firebase.ts) interact with the store.
const TOKEN_TTL_MS = 55 * 60 * 1000;

export const storeGoogleToken = (token: string) => {
  // Write through to the Zustand persist layer directly (no uid — context will Firestore-sync)
  try {
    const stored = JSON.parse(localStorage.getItem('neev-auth-store') ?? '{}');
    stored.state = { ...stored.state, googleAccessToken: token, googleTokenStoredAt: Date.now() };
    localStorage.setItem('neev-auth-store', JSON.stringify(stored));
  } catch {
    // Fallback: plain key
    localStorage.setItem("goog_token", token);
    localStorage.setItem("goog_token_ts", Date.now().toString());
  }
};

export const getStoredGoogleToken = (): string | null => {
  try {
    const stored = JSON.parse(localStorage.getItem('neev-auth-store') ?? '{}');
    const token: string | null = stored.state?.googleAccessToken ?? null;
    const ts: number | null = stored.state?.googleTokenStoredAt ?? null;
    if (!token || !ts) return null;
    if (Date.now() - ts > TOKEN_TTL_MS) return null;
    return token;
  } catch {
    return null;
  }
};

export const signInWithGoogle = async (): Promise<{
  user: any;
  accessToken: string | null;
}> => {
  const result = await signInWithPopup(auth, googleProvider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  const accessToken = credential?.accessToken ?? null;
  if (accessToken) storeGoogleToken(accessToken);
  return { user: result.user, accessToken };
};

export const signInWithEmail = async (email: string, pass: string) => {
  const result = await signInWithEmailAndPassword(auth, email, pass);
  return result.user;
};

export const signUpWithEmail = async (email: string, pass: string) => {
  const result = await createUserWithEmailAndPassword(auth, email, pass);
  return result.user;
};

export const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};

export const logOut = async () => {
  // Clear token from Zustand persisted store
  try {
    const stored = JSON.parse(localStorage.getItem('neev-auth-store') ?? '{}');
    if (stored.state) {
      stored.state.googleAccessToken = null;
      stored.state.googleTokenStoredAt = null;
      localStorage.setItem('neev-auth-store', JSON.stringify(stored));
    }
  } catch { /* ignore */ }
  await signOut(auth);
};
