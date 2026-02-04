import { addDoc, collection, doc, getDocs, orderBy, query, updateDoc } from "firebase/firestore";
import { db } from "@/services/firebase";

export interface ClientInput {
  name: string;
  timezone: string;
  status?: "active" | "archived";
}

export const clientsService = {
  async listClients(agencyId: string) {
    const ref = collection(db, "agencies", agencyId, "clients");
    const snapshot = await getDocs(query(ref, orderBy("name")));
    return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
  },
  async createClient(agencyId: string, data: ClientInput) {
    const ref = collection(db, "agencies", agencyId, "clients");
    const docRef = await addDoc(ref, { ...data, status: data.status ?? "active" });
    return docRef.id;
  },
  async updateClient(agencyId: string, clientId: string, data: Partial<ClientInput>) {
    const ref = doc(db, "agencies", agencyId, "clients", clientId);
    await updateDoc(ref, data);
  },
  async archiveClient(agencyId: string, clientId: string) {
    const ref = doc(db, "agencies", agencyId, "clients", clientId);
    await updateDoc(ref, { status: "archived" });
  }
};
