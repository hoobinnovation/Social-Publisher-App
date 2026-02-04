import { defineStore } from "pinia";

interface SnackbarState {
  show: boolean;
  message: string;
  color: "success" | "error" | "info";
}

export const useUiStore = defineStore("ui", {
  state: (): { snackbar: SnackbarState } => ({
    snackbar: {
      show: false,
      message: "",
      color: "info"
    }
  }),
  actions: {
    showSuccess(message: string) {
      this.snackbar = { show: true, message, color: "success" };
    },
    showError(message: string) {
      this.snackbar = { show: true, message, color: "error" };
    },
    clear() {
      this.snackbar.show = false;
    }
  }
});
