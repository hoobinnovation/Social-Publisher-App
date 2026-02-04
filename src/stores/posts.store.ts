import { defineStore } from "pinia";
import { postsService, PostRecord } from "@/services/posts.service";
import { useAuthStore } from "@/stores/auth.store";
import { useClientsStore } from "@/stores/clients.store";
import { useUiStore } from "@/stores/ui.store";

export const usePostsStore = defineStore("posts", {
  state: () => ({
    posts: [] as PostRecord[],
    currentPost: null as null | PostRecord,
    variants: {} as Record<string, { caption: string; assetIds: string[] }>,
    loading: false
  }),
  actions: {
    async createDraft(title: string, platforms: string[]) {
      const auth = useAuthStore();
      const clients = useClientsStore();
      const ui = useUiStore();
      if (!auth.agencyId || !clients.selectedClientId) {
        ui.showError("Select a client first");
        return null;
      }
      this.loading = true;
      try {
        const { postId } = await postsService.createPost({
          agencyId: auth.agencyId,
          clientId: clients.selectedClientId,
          title,
          platforms
        });
        ui.showSuccess("Draft created");
        await this.fetchPosts();
        return postId;
      } catch (error) {
        ui.showError((error as Error).message || "Failed to create post");
        return null;
      } finally {
        this.loading = false;
      }
    },
    async saveVariant(postId: string, platform: string, caption: string, assetIds: string[]) {
      const auth = useAuthStore();
      const clients = useClientsStore();
      const ui = useUiStore();
      if (!auth.agencyId || !clients.selectedClientId) {
        return;
      }
      this.loading = true;
      try {
        await postsService.updateVariant({
          agencyId: auth.agencyId,
          clientId: clients.selectedClientId,
          postId,
          platform,
          caption,
          assetIds
        });
        this.variants[platform] = { caption, assetIds };
        ui.showSuccess("Variant saved");
      } catch (error) {
        ui.showError((error as Error).message || "Failed to save variant");
      } finally {
        this.loading = false;
      }
    },
    async submit(postId: string) {
      const auth = useAuthStore();
      const clients = useClientsStore();
      const ui = useUiStore();
      if (!auth.agencyId || !clients.selectedClientId) {
        return;
      }
      this.loading = true;
      try {
        await postsService.submitForReview({
          agencyId: auth.agencyId,
          clientId: clients.selectedClientId,
          postId
        });
        ui.showSuccess("Submitted for review");
        await this.fetchPosts();
      } catch (error) {
        ui.showError((error as Error).message || "Submit failed");
      } finally {
        this.loading = false;
      }
    },
    async fetchPosts() {
      const auth = useAuthStore();
      const clients = useClientsStore();
      const ui = useUiStore();
      if (!auth.agencyId || !clients.selectedClientId) {
        return;
      }
      this.loading = true;
      try {
        this.posts = await postsService.listPosts(auth.agencyId, clients.selectedClientId);
      } catch (error) {
        ui.showError((error as Error).message || "Failed to load posts");
      } finally {
        this.loading = false;
      }
    },
    async fetchApprovals() {
      const auth = useAuthStore();
      const clients = useClientsStore();
      const ui = useUiStore();
      if (!auth.agencyId || !clients.selectedClientId) {
        return;
      }
      this.loading = true;
      try {
        this.posts = await postsService.listApprovals(auth.agencyId, clients.selectedClientId);
      } catch (error) {
        ui.showError((error as Error).message || "Failed to load approvals");
      } finally {
        this.loading = false;
      }
    }
  }
});
