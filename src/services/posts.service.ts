import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where
} from "firebase/firestore";
import { db } from "@/services/firebase";
import { callFn } from "@/services/functions.client";
import { FUNCTION_NAMES, USE_FUNCTIONS } from "@/config/functions";

export interface PostPayload {
  agencyId: string;
  clientId: string;
  title: string;
  platforms: string[];
}

export interface PostRecord {
  id: string;
  title: string;
  status: string;
  platforms: string[];
  variants?: Record<string, { caption: string; assetIds: string[] }>;
  publishAt?: string;
}

export const postsService = {
  async createPost(payload: PostPayload) {
    if (USE_FUNCTIONS) {
      return callFn<PostPayload, { postId: string }>(FUNCTION_NAMES.createPost, payload);
    }
    const refCollection = collection(db, "agencies", payload.agencyId, "clients", payload.clientId, "posts");
    const docRef = await addDoc(refCollection, {
      title: payload.title,
      platforms: payload.platforms,
      status: "draft",
      variants: {}
    });
    return { postId: docRef.id };
  },
  async updateVariant(payload: { agencyId: string; clientId: string; postId: string; platform: string; caption: string; assetIds: string[] }) {
    if (USE_FUNCTIONS) {
      return callFn<typeof payload, { success: boolean }>(FUNCTION_NAMES.updateVariant, payload);
    }
    const refDoc = doc(db, "agencies", payload.agencyId, "clients", payload.clientId, "posts", payload.postId);
    await updateDoc(refDoc, {
      [`variants.${payload.platform}`]: {
        caption: payload.caption,
        assetIds: payload.assetIds
      }
    });
    return { success: true };
  },
  async submitForReview(payload: { agencyId: string; clientId: string; postId: string }) {
    if (USE_FUNCTIONS) {
      return callFn<typeof payload, { success: boolean }>(FUNCTION_NAMES.submitForReview, payload);
    }
    const refDoc = doc(db, "agencies", payload.agencyId, "clients", payload.clientId, "posts", payload.postId);
    await updateDoc(refDoc, { status: "in_review" });
    return { success: true };
  },
  async approvePost(payload: { agencyId: string; clientId: string; postId: string; status: "approved" | "rejected"; reason?: string }) {
    if (USE_FUNCTIONS) {
      return callFn<typeof payload, { success: boolean }>(FUNCTION_NAMES.approvePost, payload);
    }
    const refDoc = doc(db, "agencies", payload.agencyId, "clients", payload.clientId, "posts", payload.postId);
    await updateDoc(refDoc, { status: payload.status, reviewReason: payload.reason ?? null });
    return { success: true };
  },
  async schedulePost(payload: { agencyId: string; clientId: string; postId: string; publishAt: string }) {
    if (USE_FUNCTIONS) {
      return callFn<typeof payload, { success: boolean }>(FUNCTION_NAMES.schedulePost, payload);
    }
    const refDoc = doc(db, "agencies", payload.agencyId, "clients", payload.clientId, "posts", payload.postId);
    await updateDoc(refDoc, { status: "scheduled", publishAt: payload.publishAt });
    return { success: true };
  },
  async listPosts(agencyId: string, clientId: string) {
    const refCollection = collection(db, "agencies", agencyId, "clients", clientId, "posts");
    const snapshot = await getDocs(query(refCollection, orderBy("title")));
    return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })) as PostRecord[];
  },
  async listApprovals(agencyId: string, clientId: string) {
    const refCollection = collection(db, "agencies", agencyId, "clients", clientId, "posts");
    const snapshot = await getDocs(query(refCollection, where("status", "==", "in_review")));
    return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })) as PostRecord[];
  }
};
