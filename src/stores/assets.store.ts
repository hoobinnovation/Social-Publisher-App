import { defineStore } from "pinia";
import { assetsService, AssetRecord } from "@/services/assets.service";
import { useAuthStore } from "@/stores/auth.store";
import { useClientsStore } from "@/stores/clients.store";
import { useUiStore } from "@/stores/ui.store";

export const useAssetsStore = defineStore("assets", {
  state: () => ({
    assets: [] as AssetRecord[],
    uploading: false
  }),
  actions: {
    async fetchAssets() {
      const auth = useAuthStore();
      const clients = useClientsStore();
      const ui = useUiStore();
      if (!auth.agencyId || !clients.selectedClientId) {
        return;
      }
      try {
        this.assets = await assetsService.listAssets(auth.agencyId, clients.selectedClientId);
      } catch (error) {
        ui.showError((error as Error).message || "Failed to load assets");
      }
    },
    async upload(file: File) {
      const auth = useAuthStore();
      const clients = useClientsStore();
      const ui = useUiStore();
      if (!auth.agencyId || !clients.selectedClientId) {
        ui.showError("Select a client first");
        return;
      }
      this.uploading = true;
      try {
        await assetsService.uploadAsset(auth.agencyId, clients.selectedClientId, file);
        ui.showSuccess("Asset uploaded");
        await this.fetchAssets();
      } catch (error) {
        ui.showError((error as Error).message || "Upload failed");
      } finally {
        this.uploading = false;
      }
    },
    async softDelete(assetId: string) {
      const auth = useAuthStore();
      const clients = useClientsStore();
      const ui = useUiStore();
      if (!auth.agencyId || !clients.selectedClientId) {
        return;
      }
      try {
        await assetsService.deleteAssetSoft(auth.agencyId, clients.selectedClientId, assetId);
        ui.showSuccess("Asset deleted");
        await this.fetchAssets();
      } catch (error) {
        ui.showError((error as Error).message || "Delete failed");
      }
    }
  }
});
