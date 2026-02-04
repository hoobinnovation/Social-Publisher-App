import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { db, storage } from "@/services/firebase";

export interface AssetRecord {
  id: string;
  name: string;
  url: string;
  contentType: string;
  status: "active" | "deleted";
}

export const assetsService = {
  async uploadAsset(agencyId: string, clientId: string, file: File) {
    const storageRef = ref(storage, `agencies/${agencyId}/clients/${clientId}/assets/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    const refCollection = collection(db, "agencies", agencyId, "clients", clientId, "assets");
    const docRef = await addDoc(refCollection, {
      name: file.name,
      url,
      contentType: file.type,
      status: "active"
    });
    return docRef.id;
  },
  async listAssets(agencyId: string, clientId: string) {
    const refCollection = collection(db, "agencies", agencyId, "clients", clientId, "assets");
    const snapshot = await getDocs(query(refCollection));
    return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })) as AssetRecord[];
  },
  async deleteAssetSoft(agencyId: string, clientId: string, assetId: string) {
    const refDoc = doc(db, "agencies", agencyId, "clients", clientId, "assets", assetId);
    await updateDoc(refDoc, { status: "deleted" });
  },
  async deleteAssetHard(agencyId: string, clientId: string, assetId: string) {
    const refDoc = doc(db, "agencies", agencyId, "clients", clientId, "assets", assetId);
    await deleteDoc(refDoc);
  }
};
