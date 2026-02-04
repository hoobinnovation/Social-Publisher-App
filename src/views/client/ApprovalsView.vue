<template>
  <v-container class="py-6">
    <v-row>
      <v-col cols="12">
        <h3>Approvals</h3>
      </v-col>
    </v-row>
    <v-card>
      <v-card-text>
        <v-data-table :headers="headers" :items="posts.posts" :loading="posts.loading">
          <template #item.actions="{ item }">
            <v-btn size="small" color="success" @click="openApprove(item)">Approve</v-btn>
            <v-btn size="small" color="error" @click="openReject(item)">Reject</v-btn>
          </template>
          <template #no-data>
            <v-alert type="info">No approvals pending.</v-alert>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-dialog v-model="approveDialog" max-width="420">
      <v-card>
        <v-card-title>Approve Post</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="handleApprove">
            <v-text-field v-model="reason" label="Reason (optional)" />
            <v-btn type="submit" color="success" block>Confirm</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog v-model="rejectDialog" max-width="420">
      <v-card>
        <v-card-title>Reject Post</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="handleReject">
            <v-text-field v-model="reason" label="Reason" required />
            <v-btn type="submit" color="error" block>Confirm</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { usePostsStore } from "@/stores/posts.store";
import { useApprovalsStore } from "@/stores/approvals.store";

const posts = usePostsStore();
const approvals = useApprovalsStore();
const approveDialog = ref(false);
const rejectDialog = ref(false);
const selectedId = ref("");
const reason = ref("");

const headers = [
  { title: "Title", value: "title" },
  { title: "Status", value: "status" },
  { title: "Actions", value: "actions", sortable: false }
];

onMounted(() => {
  posts.fetchApprovals();
});

const openApprove = (item: { id: string }) => {
  selectedId.value = item.id;
  reason.value = "";
  approveDialog.value = true;
};

const openReject = (item: { id: string }) => {
  selectedId.value = item.id;
  reason.value = "";
  rejectDialog.value = true;
};

const handleApprove = async () => {
  await approvals.approve(selectedId.value, reason.value || undefined);
  approveDialog.value = false;
  posts.fetchApprovals();
};

const handleReject = async () => {
  await approvals.reject(selectedId.value, reason.value || undefined);
  rejectDialog.value = false;
  posts.fetchApprovals();
};
</script>
