<script setup lang="ts">
import { computed } from 'vue';

import type { HourlyJobStat } from '@/types/job';

const props = defineProps<{
  data: HourlyJobStat[];
}>();

const maxValue = computed(() => {
  const max = Math.max(
    ...props.data.map((item) => item.count),
    1,
  );

  return max;
});

function barHeight(count: number) {
  return `${(count / maxValue.value) * 100}%`;
}
</script>

<template>
  <section class="chart-card">
    <header class="chart-header">
      <div>
        <h2>New Jobs</h2>

        <p>Last 24 hours</p>
      </div>
    </header>

    <div class="chart">
      <div
        v-for="item in data"
        :key="item.hour"
        class="bar-container"
      >
        <div class="bar-space">
          <div
            class="bar"
            :style="{
              height: barHeight(item.count),
            }"
            :title="`${item.hour}: ${item.count} jobs`"
          />
        </div>

        <span class="hour">
          {{ item.hour }}
        </span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.chart-card {
  padding: 20px;

  border: 1px solid #e5e7eb;
  border-radius: 14px;

  background: white;
}

.chart-header h2 {
  margin: 0;

  font-size: 15px;
  color: #0f172a;
}

.chart-header p {
  margin: 3px 0 0;

  color: #94a3b8;
  font-size: 12px;
}

.chart {
  height: 170px;

  display: flex;
  align-items: flex-end;

  gap: 6px;

  margin-top: 24px;
}

.bar-container {
  flex: 1;

  height: 100%;

  display: flex;
  flex-direction: column;

  justify-content: flex-end;
  align-items: center;
}

.bar-space {
  width: 100%;
  height: 135px;

  display: flex;
  align-items: flex-end;
}

.bar {
  width: 100%;

  min-height: 2px;

  border-radius: 4px 4px 0 0;

  background: #2563eb;

  transition: height 0.25s ease;
}

.bar:hover {
  opacity: 0.75;
}

.hour {
  margin-top: 8px;

  color: #94a3b8;

  font-size: 9px;
}

@media (max-width: 700px) {
  .hour {
    display: none;
  }
}
</style>