import { defineStore } from "pinia";
import { logsService } from "@/services/logs.service";
import { useAuthStore } from "@/stores/auth.store";
import { useClientsStore } from "@/stores/clients.store";
import { useUiStore } from "@/stores/ui.store";

export const useLogsStore = defineStore("logs", {
  state: () => ({
    logs: [] as Array<Record<string, unknown>>
  }),
  actions: {
    async fetchLogs(postId?: string) {
      const auth = useAuthStore();
      const clients = useClientsStore();
      const ui = useUiStore();
      if (!auth.agencyId || !clients.selectedClientId) {
        return;
      }
      try {
        this.logs = await logsService.listLogs(auth.agencyId, clients.selectedClientId, postId);
      } catch (error) {
        ui.showError((error as Error).message || "Failed to load logs");
      }
    }
  }
});
