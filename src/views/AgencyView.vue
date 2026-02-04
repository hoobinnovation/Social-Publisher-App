<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Agency Dashboard</ion-title>
        <v-spacer />
        <v-btn variant="text" @click="handleLogout">Logout</v-btn>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <v-container class="py-6">
        <v-row align="center" class="mb-4">
          <v-col cols="12" md="6">
            <h2>Clients</h2>
          </v-col>
          <v-col cols="12" md="6" class="text-end">
            <v-btn color="primary" @click="dialog = true">Add Client</v-btn>
          </v-col>
        </v-row>

        <v-card>
          <v-card-text>
            <v-data-table :items="clients.clients" :loading="clients.loading" :headers="headers">
              <template #item.actions="{ item }">
                <v-btn size="small" variant="text" @click="openEdit(item)">Edit</v-btn>
                <v-btn size="small" variant="text" @click="archive(item.id)">Archive</v-btn>
                <v-btn size="small" color="primary" @click="goClient(item.id)">Open</v-btn>
              </template>
              <template #no-data>
                <v-alert type="info">No clients yet. Add one to get started.</v-alert>
              </template>
            </v-data-table>
          </v-card-text>
        </v-card>

        <v-dialog v-model="dialog" max-width="500">
          <v-card>
            <v-card-title>{{ editMode ? "Edit Client" : "Add Client" }}</v-card-title>
            <v-card-text>
              <v-form @submit.prevent="saveClient">
                <v-text-field v-model="form.name" label="Client Name" required />
                <v-text-field v-model="form.timezone" label="Timezone" required />
                <v-btn type="submit" color="primary" :loading="clients.loading" block>Save</v-btn>
              </v-form>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-container>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/vue";
import { useClientsStore } from "@/stores/clients.store";
import { useAuthStore } from "@/stores/auth.store";

const router = useRouter();
const clients = useClientsStore();
const auth = useAuthStore();
const dialog = ref(false);
const editMode = ref(false);
const editingId = ref("");
const form = ref({ name: "", timezone: "" });

const headers = [
  { title: "Name", value: "name" },
  { title: "Timezone", value: "timezone" },
  { title: "Status", value: "status" },
  { title: "Actions", value: "actions", sortable: false }
];

onMounted(() => {
  clients.fetchClients();
});

const saveClient = async () => {
  if (editMode.value && editingId.value) {
    await clients.editClient(editingId.value, form.value);
  } else {
    await clients.addClient(form.value);
  }
  dialog.value = false;
  editMode.value = false;
  editingId.value = "";
  form.value = { name: "", timezone: "" };
};

const openEdit = (item: { id: string; name: string; timezone: string }) => {
  editMode.value = true;
  editingId.value = item.id;
  form.value = { name: item.name, timezone: item.timezone };
  dialog.value = true;
};

const archive = async (clientId: string) => {
  await clients.archiveClient(clientId);
};

const goClient = (clientId: string) => {
  clients.selectClient(clientId);
  router.push(`/client/${clientId}`);
};

const handleLogout = async () => {
  await auth.logout();
  router.push("/login");
};
</script>
