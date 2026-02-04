import { defineStore } from "pinia";
import { authService, UserProfile } from "@/services/auth.service";
import { useUiStore } from "@/stores/ui.store";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as null | { uid: string; email: string | null },
    agencyId: "",
    role: "viewer" as UserProfile["role"],
    loading: false
  }),
  actions: {
    initAuthListener() {
      authService.onAuthChange(async (user) => {
        if (user) {
          this.user = { uid: user.uid, email: user.email };
          await this.loadProfile();
        } else {
          this.user = null;
          this.agencyId = "";
          this.role = "viewer";
        }
      });
    },
    async login(email: string, password: string) {
      const ui = useUiStore();
      this.loading = true;
      try {
        const user = await authService.login(email, password);
        this.user = { uid: user.uid, email: user.email };
        await this.loadProfile();
        ui.showSuccess("Login successful");
      } catch (error) {
        ui.showError((error as Error).message || "Login failed");
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async register(email: string, password: string) {
      const ui = useUiStore();
      this.loading = true;
      try {
        const user = await authService.register(email, password);
        this.user = { uid: user.uid, email: user.email };
        await authService.ensureProfile(user.uid, { agencyId: user.uid, role: "owner" });
        await this.loadProfile();
        ui.showSuccess("Account created");
      } catch (error) {
        ui.showError((error as Error).message || "Registration failed");
        throw error;
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      const ui = useUiStore();
      this.loading = true;
      try {
        await authService.logout();
        ui.showSuccess("Logged out");
      } catch (error) {
        ui.showError((error as Error).message || "Logout failed");
      } finally {
        this.loading = false;
      }
    },
    async loadProfile() {
      if (!this.user) {
        return;
      }
      const ui = useUiStore();
      try {
        const profile = await authService.getProfile(this.user.uid);
        if (profile) {
          this.agencyId = profile.agencyId;
          this.role = profile.role;
        } else {
          await authService.ensureProfile(this.user.uid, { agencyId: this.user.uid, role: "owner" });
          this.agencyId = this.user.uid;
          this.role = "owner";
        }
      } catch (error) {
        ui.showError((error as Error).message || "Failed to load profile");
      }
    }
  }
});
