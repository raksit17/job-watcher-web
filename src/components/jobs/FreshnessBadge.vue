<script setup lang="ts">
import { computed } from 'vue';
import { minutesSince } from '@/utils/date';

const props = defineProps<{
  discoveredAt: string;
}>();

const age = computed(() =>
  minutesSince(props.discoveredAt),
);

const status = computed(() => {
  if (age.value < 15) {
    return 'just-now';
  }

  if (age.value < 360) {
    return 'new';
  }

  return null;
});
</script>

<template>
  <span
    v-if="status"
    class="freshness"
    :class="status"
  >
    <span class="dot" />

    {{ status === 'just-now' ? 'JUST NOW' : 'NEW' }}
  </span>
</template>

<style scoped>
.freshness {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  padding: 5px 9px;

  border-radius: 999px;

  font-size: 11px;
  font-weight: 700;
}

.dot {
  width: 6px;
  height: 6px;

  border-radius: 50%;

  background: currentColor;
}

.just-now {
  background: #fee2e2;
  color: #dc2626;
}

.new {
  background: #dcfce7;
  color: #16a34a;
}
</style>