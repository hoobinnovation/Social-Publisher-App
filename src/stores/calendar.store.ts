import { defineStore } from "pinia";
import { postsService } from "@/services/posts.service";
import { useAuthStore } from "@/stores/auth.store";
import { useClientsStore } from "@/stores/clients.store";
import { useUiStore } from "@/stores/ui.store";

export const useCalendarStore = defineStore("calendar", {
  state: () => ({
    schedules: [] as Array<Record<string, unknown>>
  }),
  actions: {
    async fetchSchedules() {
      const auth = useAuthStore();
      const clients = useClientsStore();
      const ui = useUiStore();
      if (!auth.agencyId || !clients.selectedClientId) {
        return;
      }
      try {
        this.schedules = await postsService.listPosts(auth.agencyId, clients.selectedClientId);
      } catch (error) {
        ui.showError((error as Error).message || "Failed to load schedules");
      }
    },
    async createSchedule(postId: string, publishAt: string) {
      const auth = useAuthStore();
      const clients = useClientsStore();
      const ui = useUiStore();
      if (!auth.agencyId || !clients.selectedClientId) {
        return;
      }
      try {
        await postsService.schedulePost({
          agencyId: auth.agencyId,
          clientId: clients.selectedClientId,
          postId,
          publishAt
        });
        ui.showSuccess("Post scheduled");
        await this.fetchSchedules();
      } catch (error) {
        ui.showError((error as Error).message || "Schedule failed");
      }
    },
    async reschedule(postId: string, publishAt: string) {
      return this.createSchedule(postId, publishAt);
    }
  }
});
