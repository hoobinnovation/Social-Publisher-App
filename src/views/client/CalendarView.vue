<template>
  <v-container class="py-6">
    <v-row>
      <v-col cols="12">
        <h3>Calendar</h3>
      </v-col>
    </v-row>
    <v-card>
      <v-card-text>
        <v-data-table :headers="headers" :items="calendar.schedules">
          <template #item.actions="{ item }">
            <v-btn size="small" color="primary" @click="openSchedule(item)">Schedule</v-btn>
          </template>
          <template #no-data>
            <v-alert type="info">No scheduled posts yet.</v-alert>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>

    <v-dialog v-model="dialog" max-width="420">
      <v-card>
        <v-card-title>Schedule Post</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveSchedule">
            <v-text-field v-model="publishAt" type="datetime-local" label="Publish at" required />
            <v-btn type="submit" color="primary" block>Save</v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useCalendarStore } from "@/stores/calendar.store";

const calendar = useCalendarStore();
const dialog = ref(false);
const publishAt = ref("");
const selectedId = ref("");

const headers = [
  { title: "Title", value: "title" },
  { title: "Status", value: "status" },
  { title: "Publish At", value: "publishAt" },
  { title: "Actions", value: "actions", sortable: false }
];

onMounted(() => {
  calendar.fetchSchedules();
});

const openSchedule = (item: { id: string }) => {
  selectedId.value = item.id;
  publishAt.value = "";
  dialog.value = true;
};

const saveSchedule = async () => {
  await calendar.createSchedule(selectedId.value, publishAt.value);
  dialog.value = false;
};
</script>
