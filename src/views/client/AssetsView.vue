<template>
  <v-container class="py-6">
    <v-row align="center">
      <v-col cols="12" md="6">
        <h3>Assets</h3>
      </v-col>
      <v-col cols="12" md="6" class="text-end">
        <v-form @submit.prevent="handleUpload">
          <v-file-input v-model="file" label="Select file" show-size />
          <v-btn type="submit" color="primary" :loading="assets.uploading">Upload</v-btn>
        </v-form>
      </v-col>
    </v-row>

    <v-row>
      <v-col v-for="asset in assets.assets" :key="asset.id" cols="12" md="4">
        <v-card>
          <v-img v-if="asset.contentType.startsWith('image')" :src="asset.url" height="180" />
          <video v-else-if="asset.contentType.startsWith('video')" :src="asset.url" controls class="w-100" />
          <v-card-text>
            <div>{{ asset.name }}</div>
            <div class="text-caption">Status: {{ asset.status }}</div>
            <v-btn color="error" variant="text" @click="deleteAsset(asset.id)">Delete</v-btn>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col v-if="assets.assets.length === 0" cols="12">
        <v-alert type="info">No assets uploaded yet.</v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useAssetsStore } from "@/stores/assets.store";

const assets = useAssetsStore();
const file = ref<File | null>(null);

onMounted(() => {
  assets.fetchAssets();
});

const handleUpload = async () => {
  if (!file.value) {
    return;
  }
  await assets.upload(file.value);
  file.value = null;
};

const deleteAsset = (assetId: string) => assets.softDelete(assetId);
</script>
