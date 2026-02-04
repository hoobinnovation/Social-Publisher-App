<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Create Account</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <v-container class="py-6">
        <v-card class="mx-auto" max-width="480">
          <v-card-title>Register</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleRegister">
              <v-text-field v-model="form.email" type="email" label="Email" required />
              <v-text-field v-model="form.password" type="password" label="Password" required />
              <v-btn :loading="auth.loading" type="submit" color="primary" block>Create account</v-btn>
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

const handleRegister = async () => {
  await auth.register(form.email, form.password);
  if (auth.user) {
    await router.push("/agency");
  }
};

const goLogin = () => router.push("/login");
</script>
