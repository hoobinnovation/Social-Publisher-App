<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Reset Password</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <v-container class="py-6">
        <v-card class="mx-auto" max-width="480">
          <v-card-title>Reset your password</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleReset">
              <v-text-field v-model="email" type="email" label="Email" required />
              <v-btn :loading="auth.loading" type="submit" color="primary" block>Send reset</v-btn>
            </v-form>
            <v-divider class="my-4" />
            <v-btn variant="text" @click="goLogin">Back to login</v-btn>
          </v-card-text>
        </v-card>
      </v-container>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/vue";
import { authService } from "@/services/auth.service";
import { useUiStore } from "@/stores/ui.store";
import { useAuthStore } from "@/stores/auth.store";

const router = useRouter();
const ui = useUiStore();
const auth = useAuthStore();
const email = ref("");

const handleReset = async () => {
  auth.loading = true;
  try {
    await authService.reset(email.value);
    ui.showSuccess("Reset email sent");
  } catch (error) {
    ui.showError((error as Error).message || "Reset failed");
  } finally {
    auth.loading = false;
  }
};

const goLogin = () => router.push("/login");
</script>
