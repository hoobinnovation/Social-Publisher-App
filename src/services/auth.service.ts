import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/services/firebase";

export interface UserProfile {
  agencyId: string;
  role: "owner" | "member" | "viewer";
}

export const authService = {
  async login(email: string, password: string) {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  },
  async register(email: string, password: string) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  },
  async logout() {
    await signOut(auth);
  },
  async reset(email: string) {
    await sendPasswordResetEmail(auth, email);
  },
  onAuthChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  },
  async getProfile(uid: string): Promise<UserProfile | null> {
    const ref = doc(db, "users", uid);
    const snapshot = await getDoc(ref);
    return snapshot.exists() ? (snapshot.data() as UserProfile) : null;
  },
  async ensureProfile(uid: string, profile: UserProfile) {
    const ref = doc(db, "users", uid);
    await setDoc(ref, profile, { merge: true });
  }
};
