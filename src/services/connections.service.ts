import { collection, getDocs, query } from "firebase/firestore";
import { db } from "@/services/firebase";
import { callFn } from "@/services/functions.client";
import { FUNCTION_NAMES } from "@/config/functions";

export interface ConnectionRecord {
  id: string;
  platform: string;
  status: "connected" | "disconnected" | "error";
  displayName?: string;
}

export const connectionsService = {
  async listConnections(agencyId: string, clientId: string) {
    const ref = collection(db, "agencies", agencyId, "clients", clientId, "connections");
    const snapshot = await getDocs(query(ref));
    return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })) as ConnectionRecord[];
  },
  async oauthStart(platform: string, clientId: string) {
    return callFn<{ platform: string; clientId: string }, { authUrl: string }>(
      FUNCTION_NAMES.oauthStart,
      { platform, clientId }
    );
  },
  async disconnectPlatform(platform: string, clientId: string) {
    return callFn<{ platform: string; clientId: string }, { success: boolean }>(
      FUNCTION_NAMES.disconnectPlatform,
      { platform, clientId }
    );
  }
};
