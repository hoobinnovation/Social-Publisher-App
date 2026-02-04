<template>
  <v-container class="py-6">
    <v-row>
      <v-col cols="12">
        <h3>Connections</h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col v-for="platform in platforms" :key="platform" cols="12" md="4">
        <v-card>
          <v-card-title>{{ platform }}</v-card-title>
          <v-card-text>
            <div class="mb-2">Status: {{ connectionStatus(platform) }}</div>
            <div v-if="connectionDisplay(platform)" class="text-caption mb-2">
              {{ connectionDisplay(platform) }}
            </div>
            <v-btn
              v-if="connectionStatus(platform) !== 'connected'"
              color="primary"
              :loading="connections.loading"
              @click="connect(platform)"
            >
              Connect
            </v-btn>
            <v-btn
              v-else
              color="error"
              :loading="connections.loading"
              @click="disconnect(platform)"
            >
              Disconnect
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useConnectionsStore } from "@/stores/connections.store";

const connections = useConnectionsStore();

const platforms = ["Facebook", "Instagram", "YouTube", "TikTok", "Google Drive"];

onMounted(() => {
  connections.fetchConnections();
});

const connectionStatus = (platform: string) => {
  const record = connections.connections.find((item) => item.platform === platform);
  return record?.status ?? "disconnected";
};

const connectionDisplay = (platform: string) => {
  const record = connections.connections.find((item) => item.platform === platform);
  return record?.displayName ?? "";
};

const connect = (platform: string) => connections.connect(platform);
const disconnect = (platform: string) => connections.disconnect(platform);
</script>
