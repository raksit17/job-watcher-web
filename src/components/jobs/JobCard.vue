<script setup lang="ts">
import type { Job } from '@/types/job';

import FreshnessBadge from './FreshnessBadge.vue';
import TechBadge from './TechBadge.vue';

import { timeAgo } from '@/utils/date';

defineProps<{
  job: Job;
}>();
</script>

<template>
  <article class="job-card">
    <div class="job-top">
      <FreshnessBadge
        :discovered-at="job.discoveredAt"
      />

      <span class="found-time">
        {{ timeAgo(job.discoveredAt) }}
      </span>
    </div>

    <div class="job-main">
      <div>
        <h2 class="job-title">
          {{ job.title }}
        </h2>

        <div class="company">
          {{ job.company ?? 'Unknown company' }}
        </div>
      </div>

      <div class="meta">
        <span v-if="job.location">
          📍 {{ job.location }}
        </span>

        <span v-if="job.salaryText">
          💰 {{ job.salaryText }}
        </span>
      </div>

      <div
        v-if="job.technologies.length"
        class="technologies"
      >
        <TechBadge
          v-for="technology in job.technologies.slice(0, 5)"
          :key="technology"
          :name="technology"
        />

        <span
          v-if="job.technologies.length > 5"
          class="more-tech"
        >
          +{{ job.technologies.length - 5 }}
        </span>
      </div>
    </div>

    <footer class="job-footer">
      <span class="source">
        {{ job.source }}
      </span>

      <a
        :href="job.jobUrl"
        target="_blank"
        rel="noopener noreferrer"
        class="open-job"
      >
        Open Job
        <span>→</span>
      </a>
    </footer>
  </article>
</template>

<style scoped>
.job-card {
  padding: 20px;

  border: 1px solid #e5e7eb;
  border-radius: 14px;

  background: white;

  transition:
    transform 0.15s ease,
    border-color 0.15s ease,
    box-shadow 0.15s ease;
}

.job-card:hover {
  transform: translateY(-1px);

  border-color: #cbd5e1;

  box-shadow:
    0 5px 18px
    rgba(15, 23, 42, 0.06);
}

.job-top {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 12px;
}

.found-time {
  font-size: 12px;
  color: #64748b;
}

.job-main {
  display: flex;
  flex-direction: column;
  gap: 13px;
}

.job-title {
  margin: 0;

  font-size: 18px;
  font-weight: 700;

  color: #0f172a;
}

.company {
  margin-top: 4px;

  color: #64748b;
  font-size: 14px;
}

.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 18px;

  font-size: 13px;
  color: #475569;
}

.technologies {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
}

.more-tech {
  padding: 5px 8px;

  color: #64748b;
  font-size: 12px;
}

.job-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-top: 18px;
  padding-top: 14px;

  border-top: 1px solid #f1f5f9;
}

.source {
  text-transform: capitalize;

  font-size: 12px;
  font-weight: 600;

  color: #64748b;
}

.open-job {
  display: inline-flex;
  align-items: center;
  gap: 5px;

  text-decoration: none;

  font-size: 13px;
  font-weight: 600;

  color: #2563eb;
}

.open-job:hover {
  text-decoration: underline;
}
</style>