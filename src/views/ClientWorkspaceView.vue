<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Client Workspace</ion-title>
        <v-spacer />
        <v-btn variant="text" @click="goAgency">Back to Clients</v-btn>
      </ion-toolbar>
      <v-tabs v-model="tab" align-tabs="start" grow>
        <v-tab value="connections" @click="navigate('connections')">Connections</v-tab>
        <v-tab value="assets" @click="navigate('assets')">Assets</v-tab>
        <v-tab value="posts" @click="navigate('posts')">Posts</v-tab>
        <v-tab value="approvals" @click="navigate('approvals')">Approvals</v-tab>
        <v-tab value="calendar" @click="navigate('calendar')">Calendar</v-tab>
        <v-tab value="logs" @click="navigate('logs')">Logs</v-tab>
      </v-tabs>
    </ion-header>
    <ion-content>
      <router-view />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/vue";

const router = useRouter();
const route = useRoute();

const tab = computed({
  get: () => String(route.path.split("/").pop() || "connections"),
  set: () => {}
});

const navigate = (segment: string) => {
  router.push(`/client/${route.params.clientId}/${segment}`);
};

const goAgency = () => router.push("/agency");
</script>
