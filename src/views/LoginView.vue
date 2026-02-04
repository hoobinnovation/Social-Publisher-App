<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>AuraSocial Login</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <v-container class="py-6">
        <v-card class="mx-auto" max-width="480">
          <v-card-title>Welcome back</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleLogin">
              <v-text-field v-model="form.email" type="email" label="Email" required />
              <v-text-field v-model="form.password" type="password" label="Password" required />
              <v-btn :loading="auth.loading" type="submit" color="primary" block>Login</v-btn>
            </v-form>
            <v-divider class="my-4" />
            <v-btn variant="text" @click="goRegister">Create account</v-btn>
            <v-btn variant="text" @click="goReset">Forgot password?</v-btn>
          </v-card-text>
        </v-card>
      </v-container>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from "@ionic/vue";
import { useAuthStore } from "@/stores/auth.store";

const router = useRouter();
const auth = useAuthStore();
const form = reactive({
  email: "",
  password: ""
});

const handleLogin = async () => {
  await auth.login(form.email, form.password);
  if (auth.user) {
    await router.push("/agency");
  }
};

const goRegister = () => router.push("/register");
const goReset = () => router.push("/reset");
</script>
