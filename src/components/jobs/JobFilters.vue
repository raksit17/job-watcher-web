<script setup lang="ts">
import {
  onMounted,
  ref,
  watch,
} from 'vue'

import {
  useJobsStore,
} from '@/stores/jobs.store'

const jobsStore =
  useJobsStore()

const localSearch =
  ref(jobsStore.search)

let timeout:
  ReturnType<
    typeof setTimeout
  >

watch(
  localSearch,
  (value) => {
    clearTimeout(timeout)

    timeout = setTimeout(
      () => {
        jobsStore.search =
          value

        jobsStore.refreshJobs()
      },
      350,
    )
  },
)

function formatSource(
  source: string,
) {
  const names:
    Record<string, string> = {
      jobthai: 'JobThai',
      jobsdb: 'JobsDB',
      jobtopgun: 'JobTopGun',
      linkedin: 'LinkedIn',
      indeed: 'Indeed',
    }

  return (
    names[source.toLowerCase()] ??
    source
  )
}

const timeFilters = [
  {
    label: '1 hour',
    value: 1,
  },
  {
    label: '24 hours',
    value: 24,
  },
  {
    label: '7 days',
    value: 168,
  },
]

onMounted(() => {
  if (
    jobsStore.sources.length === 0
  ) {
    jobsStore.loadSources()
  }
})
</script>

<template>
  <section class="filters">
    <!-- Search -->

    <div class="search">
      <span>
        🔎
      </span>

      <input
        v-model="localSearch"
        placeholder="Search jobs, company, technology..."
      />
    </div>

    <!-- Filters -->

    <div class="filter-row">
      <!-- Time -->

      <button
        v-for="filter in timeFilters"
        :key="filter.value"
        class="chip"
        :class="{
          active:
            jobsStore.hours ===
            filter.value,
        }"
        @click="
          jobsStore.setHours(
            filter.value,
          )
        "
      >
        {{ filter.label }}
      </button>

      <span class="divider" />

      <!-- All -->

      <button
        class="chip"
        :class="{
          active:
            jobsStore.source ===
            'all',
        }"
        @click="
          jobsStore.setSource(
            'all',
          )
        "
      >
        All
      </button>

      <!-- Dynamic Sources -->

      <button
        v-for="item in jobsStore.sources"
        :key="item"
        class="chip"
        :class="{
          active:
            jobsStore.source ===
            item,
        }"
        @click="
          jobsStore.setSource(item)
        "
      >
        {{ formatSource(item) }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.filters {
  display: flex;
  flex-direction: column;

  gap: 12px;
}

.search {
  height: 44px;

  display: flex;
  align-items: center;

  gap: 10px;

  padding: 0 14px;

  border: 1px solid #e2e8f0;
  border-radius: 10px;

  background: white;
}

.search input {
  width: 100%;

  border: none;
  outline: none;

  font-size: 14px;

  background: transparent;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  gap: 7px;
}

.chip {
  padding: 7px 12px;

  border: 1px solid #e2e8f0;
  border-radius: 999px;

  background: white;

  cursor: pointer;

  color: #64748b;

  font-size: 12px;
}

.chip:hover {
  border-color: #94a3b8;
}

.chip.active {
  border-color: #2563eb;

  background: #eff6ff;

  color: #2563eb;
}

.divider {
  width: 1px;
  height: 28px;

  background: #e2e8f0;

  margin: 0 6px;
}

@media (
  max-width: 640px
) {
  .divider {
    display: none;
  }
}
</style>