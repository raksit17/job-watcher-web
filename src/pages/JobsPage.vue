<script setup lang="ts">
import {
  computed,
  onMounted,
  ref,
  watch,
} from 'vue'

import { RouterLink } from 'vue-router'

import { getJobs,getJobSources } from '@/api/jobs.api'
import { timeAgo } from '@/utils/date'

import type {
  Job,
  JobsResponse,
} from '@/types/job'

const jobs = ref<Job[]>([])
const sources = ref<string[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// filters
const search = ref('')
const source = ref('all')
const hours = ref(24)

// pagination
const page = ref(1)
const limit = ref(20)

const total = ref(0)
const totalPages = ref(0)

let searchTimer:
  | ReturnType<typeof setTimeout>
  | undefined

const hasPreviousPage = computed(() => {
  return page.value > 1
})

const hasNextPage = computed(() => {
  return page.value < totalPages.value
})
async function loadSources() {
  try {
    sources.value =
      await getJobSources()
  } catch (err) {
    console.error(
      'Cannot load sources',
      err,
    )
  }
}
function formatSource(value: string) {
  return value
    .trim()
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) =>
      char.toUpperCase(),
    )
}
async function loadJobs() {
  loading.value = true
  error.value = null

  try {
    const result: JobsResponse =
      await getJobs({
        search: search.value,
        source: source.value,
        hours: hours.value,
        page: page.value,
        limit: limit.value,
      })

    jobs.value = result.items

    total.value =
      result.pagination.total

    totalPages.value =
      result.pagination.totalPages
  } catch (err) {
    error.value =
      err instanceof Error
        ? err.message
        : 'Cannot load jobs'
  } finally {
    loading.value = false
  }
}

function setHours(value: number) {
  hours.value = value
  page.value = 1

  loadJobs()
}

function setSource(value: string) {
  source.value = value
  page.value = 1

  loadJobs()
}

function previousPage() {
  if (!hasPreviousPage.value) {
    return
  }

  page.value--

  loadJobs()
}

function nextPage() {
  if (!hasNextPage.value) {
    return
  }

  page.value++

  loadJobs()
}

function goToPage(value: number) {
  if (
    value < 1 ||
    value > totalPages.value
  ) {
    return
  }

  page.value = value

  loadJobs()
}

watch(search, () => {
  clearTimeout(searchTimer)

  searchTimer = setTimeout(() => {
    page.value = 1
    loadJobs()
  }, 350)
})

watch(limit, () => {
  page.value = 1
  loadJobs()
})

onMounted(async () => {
  await Promise.all([
    loadJobs(),
    loadSources(),
  ])
})
</script>

<template>
  <main class="page">
    <!-- Header -->

    <header class="page-header">
      <div>
        <RouterLink
          to="/"
          class="back-link"
        >
          ← New Jobs
        </RouterLink>

        <h1>
          All Jobs
        </h1>

        <p>
          ค้นหาและดูงานทั้งหมดที่ scraper
          เก็บไว้
        </p>
      </div>

      <div class="total-count">
        {{ total.toLocaleString() }}
        jobs
      </div>
    </header>

    <!-- Filters -->

    <section class="filters">
      <div class="search-box">
        <span>⌕</span>

        <input
          v-model="search"
          type="text"
          placeholder="Search job, company, technology..."
        />

        <button
          v-if="search"
          class="clear-search"
          @click="search = ''"
        >
          ×
        </button>
      </div>

      <div class="filter-groups">
        <!-- Time -->

        <div class="filter-group">
          <span class="filter-label">
            Discovered
          </span>

          <button
            class="chip"
            :class="{
              active: hours === 1,
            }"
            @click="setHours(1)"
          >
            1 hour
          </button>

          <button
            class="chip"
            :class="{
              active: hours === 24,
            }"
            @click="setHours(24)"
          >
            24 hours
          </button>

          <button
            class="chip"
            :class="{
              active: hours === 168,
            }"
            @click="setHours(168)"
          >
            7 days
          </button>

          <button
            class="chip"
            :class="{
              active: hours === 720,
            }"
            @click="setHours(720)"
          >
            30 days
          </button>
        </div>

        <!-- Source -->

      <div class="filter-group">
  <span class="filter-label">
    Source
  </span>

  <!-- All -->

  <button
    class="chip"
    :class="{
      active: source === 'all',
    }"
    @click="setSource('all')"
  >
    All
  </button>

  <!-- Dynamic sources -->

  <button
    v-for="item in sources"
    :key="item"
    class="chip"
    :class="{
      active: source === item,
    }"
    @click="setSource(item)"
  >
    {{ formatSource(item) }}
  </button>
</div>
      </div>
    </section>

    <!-- Error -->

    <div
      v-if="error"
      class="error"
    >
      {{ error }}

      <button @click="loadJobs">
        Retry
      </button>
    </div>

    <!-- Table -->

    <section class="table-card">
      <div class="table-toolbar">
        <div>
          <strong>
            Jobs
          </strong>

          <span>
            {{ total.toLocaleString() }}
            results
          </span>
        </div>

        <select
          v-model.number="limit"
          class="limit-select"
        >
          <option :value="10">
            10 / page
          </option>

          <option :value="20">
            20 / page
          </option>

          <option :value="50">
            50 / page
          </option>

          <option :value="100">
            100 / page
          </option>
        </select>
      </div>

      <!-- Loading -->

      <div
        v-if="loading && !jobs.length"
        class="state"
      >
        Loading jobs...
      </div>

      <!-- Empty -->

      <div
        v-else-if="!loading && !jobs.length"
        class="state"
      >
        <div class="state-icon">
          📭
        </div>

        <strong>
          No jobs found
        </strong>

        <p>
          ลองเปลี่ยนคำค้นหรือช่วงเวลา
        </p>
      </div>

      <!-- Desktop Table -->

      <div
        v-else
        class="table-wrapper"
      >
        <table>
          <thead>
            <tr>
              <th>
                Job
              </th>

              <th>
                Location
              </th>

              <th>
                Salary
              </th>

              <th>
                Source
              </th>

              <th>
                Found
              </th>

              <th>
                Status
              </th>

              <th />
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="job in jobs"
              :key="job.id"
            >
              <!-- Job -->

              <td class="job-column">
                <RouterLink
                  :to="`/jobs/${job.id}`"
                  class="job-title"
                >
                  {{ job.title }}
                </RouterLink>

                <div class="company">
                  {{
                    job.company ??
                    'Unknown company'
                  }}
                </div>

                <div
                  v-if="
                    job.technologies.length
                  "
                  class="technologies"
                >
                  <span
                    v-for="technology in job.technologies.slice(
                      0,
                      4,
                    )"
                    :key="technology"
                    class="tech"
                  >
                    {{ technology }}
                  </span>

                  <span
                    v-if="
                      job.technologies.length >
                      4
                    "
                    class="more-tech"
                  >
                    +{{
                      job.technologies.length -
                      4
                    }}
                  </span>
                </div>
              </td>

              <!-- Location -->

              <td>
                {{
                  job.location ?? '-'
                }}
              </td>

              <!-- Salary -->

              <td>
                {{
                  job.salaryText ?? '-'
                }}
              </td>

              <!-- Source -->

              <td>
                <span class="source-badge">
                  {{ job.source }}
                </span>
              </td>

              <!-- Found -->

              <td>
                <span class="found">
                  {{
                    timeAgo(
                      job.discoveredAt,
                    )
                  }}
                </span>

                <small>
                  {{
                    new Date(
                      job.discoveredAt,
                    ).toLocaleString()
                  }}
                </small>
              </td>

              <!-- Status -->

              <td>
                <span
                  class="status"
                  :class="{
                    active: job.isActive,
                    inactive:
                      !job.isActive,
                  }"
                >
                  {{
                    job.isActive
                      ? 'Active'
                      : 'Inactive'
                  }}
                </span>
              </td>

              <!-- Action -->

              <td class="actions">
                <RouterLink
                  :to="`/jobs/${job.id}`"
                  class="view-button"
                >
                  View
                </RouterLink>

                <a
                  :href="job.jobUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="external-button"
                >
                  ↗
                </a>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->

      <footer
        v-if="totalPages > 0"
        class="pagination"
      >
        <div class="pagination-info">
          Page
          <strong>
            {{ page }}
          </strong>

          of

          <strong>
            {{ totalPages }}
          </strong>
        </div>

        <div class="pagination-buttons">
          <button
            :disabled="
              !hasPreviousPage ||
              loading
            "
            @click="previousPage"
          >
            ←
          </button>

          <button
            v-if="page > 2"
            @click="goToPage(1)"
          >
            1
          </button>

          <span
            v-if="page > 3"
          >
            ...
          </span>

          <button
            v-if="page > 1"
            @click="
              goToPage(page - 1)
            "
          >
            {{ page - 1 }}
          </button>

          <button class="current">
            {{ page }}
          </button>

          <button
            v-if="
              page < totalPages
            "
            @click="
              goToPage(page + 1)
            "
          >
            {{ page + 1 }}
          </button>

          <span
            v-if="
              page <
              totalPages - 2
            "
          >
            ...
          </span>

          <button
            v-if="
              page <
              totalPages - 1
            "
            @click="
              goToPage(
                totalPages,
              )
            "
          >
            {{ totalPages }}
          </button>

          <button
            :disabled="
              !hasNextPage ||
              loading
            "
            @click="nextPage"
          >
            →
          </button>
        </div>
      </footer>
    </section>
  </main>
</template>

<style scoped>
.page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 24px 60px;
}

/* Header */

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  margin-bottom: 24px;
}

.back-link {
  display: inline-block;

  margin-bottom: 10px;

  color: #2563eb;

  text-decoration: none;

  font-size: 13px;
  font-weight: 600;
}

.page-header h1 {
  margin: 0;

  font-size: 28px;

  color: #0f172a;
}

.page-header p {
  margin: 6px 0 0;

  font-size: 14px;

  color: #64748b;
}

.total-count {
  color: #475569;

  font-size: 14px;
  font-weight: 600;
}

/* Filters */

.filters {
  margin-bottom: 18px;
}

.search-box {
  display: flex;
  align-items: center;

  height: 46px;

  padding: 0 14px;

  border: 1px solid #e2e8f0;
  border-radius: 10px;

  background: #ffffff;
}

.search-box input {
  flex: 1;

  margin-left: 10px;

  border: 0;
  outline: 0;

  background: transparent;

  color: #0f172a;

  font-size: 14px;
}

.clear-search {
  border: 0;

  background: transparent;

  color: #94a3b8;

  cursor: pointer;

  font-size: 20px;
}

.filter-groups {
  display: flex;
  flex-wrap: wrap;

  gap: 20px;

  margin-top: 12px;
}

.filter-group {
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  gap: 7px;
}

.filter-label {
  margin-right: 3px;

  color: #64748b;

  font-size: 12px;
  font-weight: 600;
}

.chip {
  padding: 7px 11px;

  border: 1px solid #e2e8f0;
  border-radius: 999px;

  background: #ffffff;

  color: #64748b;

  cursor: pointer;

  font-size: 12px;

  text-transform: capitalize;
}

.chip:hover {
  border-color: #94a3b8;
}

.chip.active {
  border-color: #2563eb;

  background: #eff6ff;

  color: #2563eb;
}

/* Table */

.table-card {
  overflow: hidden;

  border: 1px solid #e2e8f0;
  border-radius: 14px;

  background: #ffffff;
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 15px 18px;

  border-bottom: 1px solid #e2e8f0;
}

.table-toolbar > div {
  display: flex;
  align-items: center;

  gap: 8px;
}

.table-toolbar span {
  color: #94a3b8;

  font-size: 12px;
}

.limit-select {
  padding: 7px 9px;

  border: 1px solid #e2e8f0;
  border-radius: 7px;

  background: white;

  color: #475569;
}

.table-wrapper {
  width: 100%;

  overflow-x: auto;
}

table {
  width: 100%;

  border-collapse: collapse;

  text-align: left;
}

thead {
  background: #f8fafc;
}

th {
  padding: 11px 14px;

  color: #64748b;

  font-size: 11px;
  font-weight: 700;

  text-transform: uppercase;
}

td {
  padding: 14px;

  border-top: 1px solid #f1f5f9;

  color: #475569;

  font-size: 13px;

  vertical-align: top;
}

tbody tr:hover {
  background: #fafcff;
}

.job-column {
  min-width: 330px;
}

.job-title {
  color: #0f172a;

  text-decoration: none;

  font-size: 14px;
  font-weight: 700;
}

.job-title:hover {
  color: #2563eb;
}

.company {
  margin-top: 4px;

  color: #64748b;

  font-size: 12px;
}

.technologies {
  display: flex;
  flex-wrap: wrap;

  gap: 5px;

  margin-top: 8px;
}

.tech {
  padding: 3px 6px;

  border-radius: 5px;

  background: #f1f5f9;

  color: #475569;

  font-size: 10px;
}

.more-tech {
  color: #94a3b8;

  font-size: 10px;
}

.source-badge {
  padding: 4px 7px;

  border-radius: 5px;

  background: #f1f5f9;

  font-size: 11px;

  text-transform: capitalize;
}

.found {
  display: block;

  color: #0f172a;

  font-weight: 600;
}

td small {
  display: block;

  margin-top: 4px;

  color: #94a3b8;

  font-size: 10px;
}

.status {
  display: inline-flex;

  padding: 4px 7px;

  border-radius: 999px;

  font-size: 10px;
  font-weight: 700;
}

.status.active {
  background: #dcfce7;
  color: #15803d;
}

.status.inactive {
  background: #f1f5f9;
  color: #64748b;
}

.actions {
  white-space: nowrap;
}

.view-button,
.external-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;

  text-decoration: none;
}

.view-button {
  color: #2563eb;

  font-weight: 600;
}

.external-button {
  margin-left: 10px;

  color: #64748b;
}

/* Pagination */

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 14px 18px;

  border-top: 1px solid #e2e8f0;
}

.pagination-info {
  color: #64748b;

  font-size: 12px;
}

.pagination-buttons {
  display: flex;
  align-items: center;

  gap: 5px;
}

.pagination-buttons button {
  min-width: 32px;
  height: 32px;

  border: 1px solid #e2e8f0;
  border-radius: 6px;

  background: white;

  color: #475569;

  cursor: pointer;
}

.pagination-buttons button:hover:not(:disabled) {
  border-color: #2563eb;

  color: #2563eb;
}

.pagination-buttons button.current {
  border-color: #2563eb;

  background: #2563eb;

  color: white;
}

.pagination-buttons button:disabled {
  cursor: not-allowed;

  opacity: 0.4;
}

.error {
  display: flex;
  justify-content: space-between;

  margin-bottom: 14px;
  padding: 12px;

  border-radius: 8px;

  background: #fef2f2;

  color: #dc2626;
}

.state {
  padding: 80px 20px;

  text-align: center;

  color: #64748b;
}

.state-icon {
  margin-bottom: 10px;

  font-size: 30px;
}

.state p {
  margin: 6px 0 0;
}

/* Mobile */

@media (max-width: 768px) {
  .page {
    padding: 20px 12px 40px;
  }

  .page-header {
    align-items: flex-start;
  }

  .filter-groups {
    flex-direction: column;
  }

  .table-toolbar {
    gap: 10px;
  }

  .pagination {
    flex-direction: column;

    gap: 12px;
  }
}
</style>