<template>
  <ion-app>
    <v-app>
      <router-view />
      <v-snackbar v-model="ui.snackbar.show" :color="ui.snackbar.color" location="top end">
        {{ ui.snackbar.message }}
        <template #actions>
          <v-btn variant="text" @click="ui.clear">Close</v-btn>
        </template>
      </v-snackbar>
    </v-app>
  </ion-app>
</template>

<script setup lang="ts">
import { IonApp } from "@ionic/vue";
import { onMounted } from "vue";
import { useUiStore } from "@/stores/ui.store";
import { useAuthStore } from "@/stores/auth.store";

const ui = useUiStore();
const auth = useAuthStore();

onMounted(() => {
  auth.initAuthListener();
});
</script>
