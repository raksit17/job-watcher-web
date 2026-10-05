<script setup lang="ts">
defineProps<{
  name: string;
}>();
</script>

<template>
  <span class="tech">
    {{ name }}
  </span>
</template>

<style scoped>
.tech {
  display: inline-flex;

  padding: 5px 9px;

  border: 1px solid #e5e7eb;
  border-radius: 6px;

  background: #f8fafc;

  color: #475569;

  font-size: 12px;
  font-weight: 500;
}
</style>