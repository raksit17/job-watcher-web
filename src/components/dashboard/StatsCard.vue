<script setup lang="ts">
defineProps<{
  label: string;
  value: number | string;
  description?: string;
}>();
</script>

<template>
  <div class="stat-card">
    <div class="label">
      {{ label }}
    </div>

    <div class="value">
      {{ value }}
    </div>

    <div
      v-if="description"
      class="description"
    >
      {{ description }}
    </div>
  </div>
</template>

<style scoped>
.stat-card {
  padding: 18px;

  border: 1px solid #e5e7eb;
  border-radius: 14px;

  background: #ffffff;
}

.label {
  color: #64748b;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.06em;
  text-transform: uppercase;
}

.value {
  margin-top: 8px;

  color: #0f172a;

  font-size: 28px;
  font-weight: 700;
}

.description {
  margin-top: 5px;

  color: #94a3b8;
  font-size: 12px;
}
</style>