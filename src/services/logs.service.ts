import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/services/firebase";

export const logsService = {
  async listLogs(agencyId: string, clientId: string, postId?: string) {
    const refCollection = collection(db, "agencies", agencyId, "clients", clientId, "logs");
    const q = postId ? query(refCollection, where("postId", "==", postId)) : query(refCollection);
    const snapshot = await getDocs(q);
    return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
  }
};
