<script setup lang="ts">
import type { Job } from '@/types/job';

import JobCard from './JobCard.vue';

defineProps<{
  jobs: Job[];
  loading?: boolean;
}>();
</script>

<template>
  <section>
    <div
      v-if="loading && !jobs.length"
      class="loading"
    >
      Loading jobs...
    </div>

    <div
      v-else-if="!jobs.length"
      class="empty"
    >
      <div class="empty-icon">
        📭
      </div>

      <h3>No new jobs</h3>

      <p>
        ยังไม่มีงานใหม่ในช่วงเวลานี้
      </p>
    </div>

    <div
      v-else
      class="job-list"
    >
      <JobCard
        v-for="job in jobs"
        :key="job.id"
        :job="job"
      />
    </div>
  </section>
</template>

<style scoped>
.job-list {
  display: grid;
  gap: 12px;
}

.loading,
.empty {
  padding: 70px 20px;

  text-align: center;

  border: 1px dashed #cbd5e1;
  border-radius: 14px;

  color: #64748b;
}

.empty-icon {
  margin-bottom: 10px;
  font-size: 28px;
}

.empty h3 {
  margin: 0;
  color: #0f172a;
}

.empty p {
  margin-top: 6px;
}
</style>