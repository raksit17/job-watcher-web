<script setup lang="ts">
import { onMounted } from 'vue';

import { useJobsStore } from '@/stores/jobs.store';

import StatsGrid from '@/components/dashboard/StatsGrid.vue';
import NewJobsChart from '@/components/dashboard/NewJobsChart.vue';

import JobFilters from '@/components/jobs/JobFilters.vue';
import JobFeed from '@/components/jobs/JobFeed.vue';

const jobsStore = useJobsStore();

onMounted(() => {
  jobsStore.loadDashboard();
});
</script>

<template>
  <main class="page">
    <header class="page-header">
      <div>
        <h1>
          Job Watcher
        </h1>

        <p>
          งานที่เพิ่งค้นพบ
        </p>
      </div>

      <div class="scraper-status">
        <span class="status-dot" />

        Scraper running
      </div>
    </header>

    <StatsGrid
      :stats="jobsStore.stats"
    />

    <NewJobsChart
      :data="jobsStore.hourlyStats"
    />

    <section class="jobs-section">
      <div class="jobs-header">
        <div>
          <h2>
            New Jobs
          </h2>

          <span>
            {{ jobsStore.jobCount }} jobs
          </span>
        </div>

        <RouterLink
          to="/jobs"
          class="table-link"
        >
          Table View
        </RouterLink>
      </div>

      <JobFilters />

      <div
        v-if="jobsStore.error"
        class="error"
      >
        {{ jobsStore.error }}
      </div>

      <JobFeed
        :jobs="jobsStore.jobs"
        :loading="jobsStore.loading"
      />
    </section>
  </main>
</template>

<style scoped>
.page {
  max-width: 1200px;

  margin: 0 auto;

  padding: 28px 24px 60px;

  display: flex;
  flex-direction: column;

  gap: 20px;
}

.page-header {
  display: flex;

  justify-content: space-between;
  align-items: center;
}

.page-header h1 {
  margin: 0;

  font-size: 25px;

  color: #0f172a;
}

.page-header p {
  margin: 5px 0 0;

  color: #64748b;

  font-size: 14px;
}

.scraper-status {
  display: flex;
  align-items: center;

  gap: 8px;

  padding: 8px 11px;

  border-radius: 999px;

  background: #f0fdf4;

  color: #15803d;

  font-size: 12px;
  font-weight: 600;
}

.status-dot {
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: #22c55e;
}

.jobs-section {
  display: flex;
  flex-direction: column;

  gap: 16px;
}

.jobs-header {
  display: flex;

  justify-content: space-between;
  align-items: center;
}

.jobs-header > div {
  display: flex;
  align-items: baseline;

  gap: 8px;
}

.jobs-header h2 {
  margin: 0;

  font-size: 19px;

  color: #0f172a;
}

.jobs-header span {
  color: #94a3b8;

  font-size: 12px;
}

.table-link {
  text-decoration: none;

  color: #2563eb;

  font-size: 13px;
  font-weight: 600;
}

.error {
  padding: 12px;

  border-radius: 8px;

  background: #fef2f2;

  color: #dc2626;
}

@media (max-width: 600px) {
  .page {
    padding: 20px 14px 40px;
  }

  .page-header {
    align-items: flex-start;
  }

  .scraper-status {
    font-size: 0;

    padding: 8px;
  }
}
</style>