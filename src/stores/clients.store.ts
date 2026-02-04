import { defineStore } from "pinia";
import { clientsService, ClientInput } from "@/services/clients.service";
import { useAuthStore } from "@/stores/auth.store";
import { useUiStore } from "@/stores/ui.store";

export interface ClientRecord extends ClientInput {
  id: string;
}

export const useClientsStore = defineStore("clients", {
  state: () => ({
    clients: [] as ClientRecord[],
    selectedClientId: "",
    selectedClient: null as ClientRecord | null,
    loading: false
  }),
  actions: {
    async fetchClients() {
      const auth = useAuthStore();
      const ui = useUiStore();
      if (!auth.agencyId) {
        return;
      }
      this.loading = true;
      try {
        this.clients = (await clientsService.listClients(auth.agencyId)) as ClientRecord[];
      } catch (error) {
        ui.showError((error as Error).message || "Failed to load clients");
      } finally {
        this.loading = false;
      }
    },
    async addClient(data: ClientInput) {
      const auth = useAuthStore();
      const ui = useUiStore();
      if (!auth.agencyId) {
        return;
      }
      this.loading = true;
      try {
        const id = await clientsService.createClient(auth.agencyId, data);
        this.clients.push({ id, ...data, status: data.status ?? "active" });
        ui.showSuccess("Client added");
      } catch (error) {
        ui.showError((error as Error).message || "Failed to add client");
      } finally {
        this.loading = false;
      }
    },
    async editClient(clientId: string, data: Partial<ClientInput>) {
      const auth = useAuthStore();
      const ui = useUiStore();
      if (!auth.agencyId) {
        return;
      }
      this.loading = true;
      try {
        await clientsService.updateClient(auth.agencyId, clientId, data);
        const index = this.clients.findIndex((client) => client.id === clientId);
        if (index >= 0) {
          this.clients[index] = { ...this.clients[index], ...data } as ClientRecord;
        }
        ui.showSuccess("Client updated");
      } catch (error) {
        ui.showError((error as Error).message || "Failed to update client");
      } finally {
        this.loading = false;
      }
    },
    async archiveClient(clientId: string) {
      const auth = useAuthStore();
      const ui = useUiStore();
      if (!auth.agencyId) {
        return;
      }
      this.loading = true;
      try {
        await clientsService.archiveClient(auth.agencyId, clientId);
        this.clients = this.clients.map((client) =>
          client.id === clientId ? { ...client, status: "archived" } : client
        );
        ui.showSuccess("Client archived");
      } catch (error) {
        ui.showError((error as Error).message || "Failed to archive client");
      } finally {
        this.loading = false;
      }
    },
    selectClient(clientId: string) {
      this.selectedClientId = clientId;
      this.selectedClient = this.clients.find((client) => client.id === clientId) ?? null;
    }
  }
});
