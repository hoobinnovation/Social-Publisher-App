import { defineStore } from "pinia";
import { postsService } from "@/services/posts.service";
import { useAuthStore } from "@/stores/auth.store";
import { useClientsStore } from "@/stores/clients.store";
import { useUiStore } from "@/stores/ui.store";

export const useApprovalsStore = defineStore("approvals", {
  actions: {
    async approve(postId: string, reason?: string) {
      const auth = useAuthStore();
      const clients = useClientsStore();
      const ui = useUiStore();
      if (!auth.agencyId || !clients.selectedClientId) {
        return;
      }
      try {
        await postsService.approvePost({
          agencyId: auth.agencyId,
          clientId: clients.selectedClientId,
          postId,
          status: "approved",
          reason
        });
        ui.showSuccess("Post approved");
      } catch (error) {
        ui.showError((error as Error).message || "Approval failed");
      }
    },
    async reject(postId: string, reason?: string) {
      const auth = useAuthStore();
      const clients = useClientsStore();
      const ui = useUiStore();
      if (!auth.agencyId || !clients.selectedClientId) {
        return;
      }
      try {
        await postsService.approvePost({
          agencyId: auth.agencyId,
          clientId: clients.selectedClientId,
          postId,
          status: "rejected",
          reason
        });
        ui.showSuccess("Post rejected");
      } catch (error) {
        ui.showError((error as Error).message || "Rejection failed");
      }
    }
  }
});
