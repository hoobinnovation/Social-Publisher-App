import { defineStore } from "pinia";
import { connectionsService, ConnectionRecord } from "@/services/connections.service";
import { useAuthStore } from "@/stores/auth.store";
import { useClientsStore } from "@/stores/clients.store";
import { useUiStore } from "@/stores/ui.store";

export const useConnectionsStore = defineStore("connections", {
  state: () => ({
    connections: [] as ConnectionRecord[],
    loading: false
  }),
  actions: {
    async fetchConnections() {
      const auth = useAuthStore();
      const clients = useClientsStore();
      const ui = useUiStore();
      if (!auth.agencyId || !clients.selectedClientId) {
        return;
      }
      this.loading = true;
      try {
        this.connections = await connectionsService.listConnections(auth.agencyId, clients.selectedClientId);
      } catch (error) {
        ui.showError((error as Error).message || "Failed to load connections");
      } finally {
        this.loading = false;
      }
    },
    async connect(platform: string) {
      const clients = useClientsStore();
      const ui = useUiStore();
      if (!clients.selectedClientId) {
        ui.showError("Select a client first");
        return;
      }
      this.loading = true;
      try {
        const { authUrl } = await connectionsService.oauthStart(platform, clients.selectedClientId);
        ui.showSuccess("Redirecting to OAuth");
        window.location.href = authUrl;
      } catch (error) {
        ui.showError((error as Error).message || "OAuth start failed");
      } finally {
        this.loading = false;
      }
    },
    async disconnect(platform: string) {
      const clients = useClientsStore();
      const ui = useUiStore();
      if (!clients.selectedClientId) {
        ui.showError("Select a client first");
        return;
      }
      this.loading = true;
      try {
        await connectionsService.disconnectPlatform(platform, clients.selectedClientId);
        ui.showSuccess("Disconnected");
        await this.fetchConnections();
      } catch (error) {
        ui.showError((error as Error).message || "Disconnect failed");
      } finally {
        this.loading = false;
      }
    }
  }
});
