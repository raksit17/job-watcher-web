<script setup lang="ts">
import type { JobStats } from '@/types/job';

import StatsCard from './StatsCard.vue';

defineProps<{
  stats: JobStats;
}>();
</script>

<template>
  <div class="stats-grid">
    <StatsCard
      label="New today"
      :value="stats.newToday"
      :description="`+${stats.lastHour} last hour`"
    />

    <StatsCard
      label="Last 1 hour"
      :value="stats.lastHour"
      description="Recently discovered"
    />

    <StatsCard
      label="Active"
      :value="stats.active.toLocaleString()"
      description="Currently available"
    />

    <StatsCard
      label="Sources"
      :value="stats.sources"
      description="Job sources"
    />
  </div>
</template>

<style scoped>
.stats-grid {
  display: grid;

  grid-template-columns:
    repeat(4, minmax(0, 1fr));

  gap: 12px;
}

@media (max-width: 800px) {
  .stats-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>