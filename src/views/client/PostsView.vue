<template>
  <v-container class="py-6">
    <v-row align="center" class="mb-4">
      <v-col cols="12" md="6">
        <h3>Content Studio</h3>
      </v-col>
      <v-col cols="12" md="6" class="text-end">
        <v-btn color="primary" @click="dialog = true">Create Post</v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title>Drafts</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                v-for="post in posts.posts"
                :key="post.id"
                :title="String(post.title || 'Untitled')"
                :subtitle="String(post.status || 'draft')"
                @click="selectPost(post)"
              />
            </v-list>
            <v-alert v-if="posts.posts.length === 0" type="info">No posts yet.</v-alert>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>Variant Editor</v-card-title>
          <v-card-text>
            <div v-if="selectedPost">
              <v-tabs v-model="activePlatform" align-tabs="start">
                <v-tab v-for="platform in selectedPlatforms" :key="platform" :value="platform">
                  {{ platform }}
                </v-tab>
              </v-tabs>
              <v-window v-model="activePlatform">
                <v-window-item v-for="platform in selectedPlatforms" :key="platform" :value="platform">
                  <v-textarea v-model="variantCaption[platform]" label="Caption" rows="4" />
                  <v-select
                    v-model="variantAssets[platform]"
                    :items="assets.assets"
                    item-title="name"
                    item-value="id"
                    chips
                    multiple
                    label="Attach assets"
                  />
                  <v-btn
                    color="primary"
                    :loading="posts.loading"
                    @click="saveVariant(platform)"
                  >
                    Save Variant
                  </v-btn>
                </v-window-item>
              </v-window>
              <v-divider class="my-4" />
              <v-btn color="success" :loading="posts.loading" @click="submitReview">Submit for review</v-btn>
            </div>
            <v-alert v-else type="info">Select a post to edit variants.</v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>Create Post</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="createPost">
            <v-text-field v-model="newPost.title" label="Title" required />
            <v-select v-model="newPost.platforms" :items="platforms" label="Platforms" multiple chips />
            <v-btn type="submit" color="primary" :loading="posts.loading" block>Create</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { usePostsStore } from "@/stores/posts.store";
import { useAssetsStore } from "@/stores/assets.store";
import type { PostRecord } from "@/services/posts.service";

const posts = usePostsStore();
const assets = useAssetsStore();

const dialog = ref(false);
const newPost = ref({ title: "", platforms: [] as string[] });
const selectedPost = ref<PostRecord | null>(null);
const activePlatform = ref("");
const variantCaption = ref<Record<string, string>>({});
const variantAssets = ref<Record<string, string[]>>({});

const platforms = ["Facebook", "Instagram", "YouTube", "TikTok", "Google Drive"];

const selectedPlatforms = computed(() => selectedPost.value?.platforms || []);

onMounted(() => {
  posts.fetchPosts();
  assets.fetchAssets();
});

const createPost = async () => {
  const postId = await posts.createDraft(newPost.value.title, newPost.value.platforms);
  if (postId) {
    dialog.value = false;
    newPost.value = { title: "", platforms: [] };
  }
};

const selectPost = (post: PostRecord) => {
  selectedPost.value = post;
  const platformsList = post.platforms || [];
  activePlatform.value = platformsList[0] || "";
  platformsList.forEach((platform) => {
    variantCaption.value[platform] = post.variants?.[platform]?.caption || "";
    variantAssets.value[platform] = post.variants?.[platform]?.assetIds || [];
  });
};

const saveVariant = async (platform: string) => {
  if (!selectedPost.value) {
    return;
  }
  await posts.saveVariant(
    selectedPost.value.id as string,
    platform,
    variantCaption.value[platform] || "",
    variantAssets.value[platform] || []
  );
};

const submitReview = async () => {
  if (!selectedPost.value) {
    return;
  }
  await posts.submit(selectedPost.value.id as string);
};
</script>
