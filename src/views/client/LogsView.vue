<template>
  <v-container class="py-6">
    <v-row align="center" class="mb-4">
      <v-col cols="12" md="6">
        <h3>Logs</h3>
      </v-col>
      <v-col cols="12" md="6" class="text-end">
        <v-form @submit.prevent="applyFilter">
          <v-text-field v-model="postId" label="Filter by Post ID" />
          <v-btn type="submit" color="primary">Filter</v-btn>
        </v-form>
      </v-col>
    </v-row>
    <v-card>
      <v-card-text>
        <v-data-table :headers="headers" :items="logs.logs">
          <template #no-data>
            <v-alert type="info">No logs found.</v-alert>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useLogsStore } from "@/stores/logs.store";

const logs = useLogsStore();
const postId = ref("");

const headers = [
  { title: "Platform", value: "platform" },
  { title: "Status", value: "status" },
  { title: "Time", value: "time" },
  { title: "Error", value: "errorMessage" }
];

onMounted(() => {
  logs.fetchLogs();
});

const applyFilter = async () => {
  await logs.fetchLogs(postId.value || undefined);
};
</script>
