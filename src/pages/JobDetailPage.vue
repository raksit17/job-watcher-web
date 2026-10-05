<script setup lang="ts">
import {
  computed,
  onMounted,
  ref,
} from 'vue'

import {
  RouterLink,
  useRoute,
} from 'vue-router'

import { getJob } from '@/api/jobs.api'
import { timeAgo } from '@/utils/date'

import type { Job } from '@/types/job'

const route = useRoute()

const job = ref<Job | null>(null)

const loading = ref(true)
const error = ref<string | null>(null)

const id = computed(() => {
  return String(route.params.id)
})

const discoveredAgo = computed(() => {
  if (!job.value) {
    return ''
  }

  return timeAgo(
    job.value.discoveredAt,
  )
})

async function loadJob() {
  loading.value = true
  error.value = null

  try {
    job.value =
      await getJob(id.value)
  } catch (err) {
    error.value =
      err instanceof Error
        ? err.message
        : 'Cannot load job'
  } finally {
    loading.value = false
  }
}

function formatDate(
  value: string | null,
) {
  if (!value) {
    return '-'
  }

  return new Intl.DateTimeFormat(
    'en-GB',
    {
      dateStyle: 'medium',
      timeStyle: 'short',
    },
  ).format(new Date(value))
}

onMounted(() => {
  loadJob()
})
</script>

<template>
  <main class="page">
    <!-- Back -->

    <RouterLink
      to="/jobs"
      class="back-link"
    >
      ← Back to jobs
    </RouterLink>

    <!-- Loading -->

    <div
      v-if="loading"
      class="state-card"
    >
      Loading job...
    </div>

    <!-- Error -->

    <div
      v-else-if="error"
      class="state-card error"
    >
      <h2>
        Cannot load job
      </h2>

      <p>
        {{ error }}
      </p>

      <button @click="loadJob">
        Retry
      </button>
    </div>

    <!-- Job -->

    <template v-else-if="job">
      <!-- Header -->

      <section class="job-header">
        <div class="header-main">
          <div class="badges">
            <span
              class="status"
              :class="{
                active: job.isActive,
                inactive: !job.isActive,
              }"
            >
              {{
                job.isActive
                  ? 'Active'
                  : 'Inactive'
              }}
            </span>

            <span class="source">
              {{ job.source }}
            </span>

            <span class="found">
              Found
              {{ discoveredAgo }}
            </span>
          </div>

          <h1>
            {{ job.title }}
          </h1>

          <h2>
            {{
              job.company ??
              'Unknown company'
            }}
          </h2>

          <div class="job-meta">
            <span
              v-if="job.location"
            >
              📍
              {{ job.location }}
            </span>

            <span
              v-if="job.salaryText"
            >
              💰
              {{ job.salaryText }}
            </span>
          </div>
        </div>

        <a
          :href="job.jobUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="original-button"
        >
          Open Original
          ↗
        </a>
      </section>

      <!-- Technologies -->

      <section
        v-if="
          job.technologies.length
        "
        class="technology-section"
      >
        <span
          v-for="technology in job.technologies"
          :key="technology"
          class="technology"
        >
          {{ technology }}
        </span>
      </section>

      <!-- Main Layout -->

      <div class="content-layout">
        <!-- Left -->

        <div class="content-main">
          <!-- Description -->

          <section class="content-card">
            <h2>
              Job Description
            </h2>

            <div
              v-if="job.description"
              class="description"
            >
              {{
                job.description
              }}
            </div>

            <p
              v-else
              class="empty-text"
            >
              No description available.
            </p>
          </section>

          <!-- Requirements -->

          <section class="content-card">
            <h2>
              Requirements
            </h2>

            <ul
              v-if="
                job.requirements.length
              "
              class="requirements"
            >
              <li
                v-for="(
                  requirement,
                  index
                ) in job.requirements"
                :key="index"
              >
                {{ requirement }}
              </li>
            </ul>

            <p
              v-else
              class="empty-text"
            >
              No requirements available.
            </p>
          </section>

          <!-- Technologies -->

          <section class="content-card">
            <h2>
              Technologies
            </h2>

            <div
              v-if="
                job.technologies.length
              "
              class="technology-list"
            >
              <span
                v-for="technology in job.technologies"
                :key="technology"
                class="technology large"
              >
                {{ technology }}
              </span>
            </div>

            <p
              v-else
              class="empty-text"
            >
              No technology information.
            </p>
          </section>
        </div>

        <!-- Right Sidebar -->

        <aside class="sidebar">
          <section class="sidebar-card">
            <h3>
              Job Information
            </h3>

            <div class="info-row">
              <span>
                Source
              </span>

              <strong>
                {{ job.source }}
              </strong>
            </div>

            <div class="info-row">
              <span>
                External ID
              </span>

              <strong>
                {{ job.externalId }}
              </strong>
            </div>

            <div class="info-row">
              <span>
                Location
              </span>

              <strong>
                {{
                  job.location ??
                  '-'
                }}
              </strong>
            </div>

            <div class="info-row">
              <span>
                Salary
              </span>

              <strong>
                {{
                  job.salaryText ??
                  '-'
                }}
              </strong>
            </div>
          </section>

          <section class="sidebar-card">
            <h3>
              Timeline
            </h3>

            <div class="timeline">
              <div class="timeline-item">
                <span class="timeline-dot" />

                <div>
                  <small>
                    Posted
                  </small>

                  <strong>
                    {{
                      formatDate(
                        job.postedAt,
                      )
                    }}
                  </strong>
                </div>
              </div>

              <div class="timeline-item">
                <span class="timeline-dot important" />

                <div>
                  <small>
                    Discovered
                  </small>

                  <strong>
                    {{
                      formatDate(
                        job.discoveredAt,
                      )
                    }}
                  </strong>

                  <span class="ago">
                    {{
                      timeAgo(
                        job.discoveredAt,
                      )
                    }}
                  </span>
                </div>
              </div>

              <div class="timeline-item">
                <span class="timeline-dot" />

                <div>
                  <small>
                    Last seen
                  </small>

                  <strong>
                    {{
                      formatDate(
                        job.lastSeenAt,
                      )
                    }}
                  </strong>

                  <span class="ago">
                    {{
                      timeAgo(
                        job.lastSeenAt,
                      )
                    }}
                  </span>
                </div>
              </div>
            </div>
          </section>

          <section class="sidebar-card">
            <h3>
              Database
            </h3>

            <div class="info-row">
              <span>
                Created
              </span>

              <strong>
                {{
                  formatDate(
                    job.createdAt,
                  )
                }}
              </strong>
            </div>

            <div class="info-row">
              <span>
                Updated
              </span>

              <strong>
                {{
                  formatDate(
                    job.updatedAt,
                  )
                }}
              </strong>
            </div>
          </section>

          <a
            :href="job.jobUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="sidebar-open-button"
          >
            Open Job on
            {{ job.source }}
            ↗
          </a>
        </aside>
      </div>
    </template>
  </main>
</template>

<style scoped>
.page {
  max-width: 1200px;

  margin: 0 auto;

  padding: 28px 24px 60px;
}

.back-link {
  display: inline-block;

  margin-bottom: 18px;

  color: #2563eb;

  text-decoration: none;

  font-size: 13px;
  font-weight: 600;
}

/* Header */

.job-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  gap: 24px;

  padding: 26px;

  border: 1px solid #e2e8f0;
  border-radius: 16px;

  background: white;
}

.header-main {
  min-width: 0;
}

.badges {
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  gap: 8px;

  margin-bottom: 13px;
}

.status,
.source {
  padding: 5px 8px;

  border-radius: 999px;

  font-size: 11px;
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

.source {
  background: #eff6ff;
  color: #2563eb;

  text-transform: capitalize;
}

.found {
  color: #94a3b8;

  font-size: 12px;
}

.job-header h1 {
  margin: 0;

  color: #0f172a;

  font-size: 28px;
  line-height: 1.25;
}

.job-header h2 {
  margin: 8px 0 0;

  color: #64748b;

  font-size: 17px;
  font-weight: 500;
}

.job-meta {
  display: flex;
  flex-wrap: wrap;

  gap: 18px;

  margin-top: 18px;

  color: #475569;

  font-size: 14px;
}

.original-button {
  flex-shrink: 0;

  padding: 10px 15px;

  border-radius: 8px;

  background: #2563eb;

  color: white;

  text-decoration: none;

  font-size: 13px;
  font-weight: 600;
}

.original-button:hover {
  background: #1d4ed8;
}

/* Technology */

.technology-section {
  display: flex;
  flex-wrap: wrap;

  gap: 7px;

  margin-top: 14px;
}

.technology {
  display: inline-flex;

  padding: 5px 9px;

  border: 1px solid #e2e8f0;
  border-radius: 6px;

  background: #f8fafc;

  color: #475569;

  font-size: 12px;
  font-weight: 500;
}

.technology.large {
  padding: 7px 10px;
}

/* Layout */

.content-layout {
  display: grid;

  grid-template-columns:
    minmax(0, 1fr)
    310px;

  gap: 18px;

  margin-top: 22px;
}

.content-main {
  display: flex;
  flex-direction: column;

  gap: 16px;
}

.content-card,
.sidebar-card {
  border: 1px solid #e2e8f0;
  border-radius: 14px;

  background: white;
}

.content-card {
  padding: 22px;
}

.content-card h2 {
  margin: 0 0 18px;

  color: #0f172a;

  font-size: 17px;
}

.description {
  color: #334155;

  font-size: 14px;
  line-height: 1.75;

  white-space: pre-line;
}

.requirements {
  display: flex;
  flex-direction: column;

  gap: 9px;

  margin: 0;
  padding-left: 20px;

  color: #334155;

  font-size: 14px;
  line-height: 1.65;
}

.technology-list {
  display: flex;
  flex-wrap: wrap;

  gap: 8px;
}

.empty-text {
  color: #94a3b8;

  font-size: 13px;
}

/* Sidebar */

.sidebar {
  display: flex;
  flex-direction: column;

  gap: 14px;
}

.sidebar-card {
  padding: 18px;
}

.sidebar-card h3 {
  margin: 0 0 16px;

  color: #0f172a;

  font-size: 14px;
}

.info-row {
  display: flex;
  justify-content: space-between;

  gap: 12px;

  padding: 9px 0;

  border-bottom: 1px solid #f1f5f9;

  font-size: 12px;
}

.info-row:last-child {
  border-bottom: 0;
}

.info-row span {
  color: #94a3b8;
}

.info-row strong {
  max-width: 170px;

  color: #334155;

  text-align: right;

  overflow-wrap: anywhere;
}

/* Timeline */

.timeline {
  position: relative;

  display: flex;
  flex-direction: column;

  gap: 18px;
}

.timeline-item {
  display: flex;

  gap: 10px;
}

.timeline-dot {
  flex-shrink: 0;

  width: 8px;
  height: 8px;

  margin-top: 5px;

  border-radius: 50%;

  background: #cbd5e1;
}

.timeline-dot.important {
  background: #22c55e;
}

.timeline-item div {
  display: flex;
  flex-direction: column;

  gap: 3px;
}

.timeline-item small {
  color: #94a3b8;

  font-size: 10px;

  text-transform: uppercase;
}

.timeline-item strong {
  color: #334155;

  font-size: 12px;
}

.ago {
  color: #64748b;

  font-size: 11px;
}

.sidebar-open-button {
  padding: 11px;

  border-radius: 9px;

  background: #0f172a;

  color: white;

  text-align: center;
  text-decoration: none;

  font-size: 13px;
  font-weight: 600;
}

/* States */

.state-card {
  padding: 60px 20px;

  border: 1px solid #e2e8f0;
  border-radius: 14px;

  background: white;

  text-align: center;

  color: #64748b;
}

.state-card.error {
  color: #dc2626;
}

/* Responsive */

@media (max-width: 900px) {
  .content-layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    order: -1;
  }
}

@media (max-width: 640px) {
  .page {
    padding: 18px 12px 40px;
  }

  .job-header {
    flex-direction: column;

    padding: 18px;
  }

  .job-header h1 {
    font-size: 22px;
  }

  .original-button {
    width: 100%;

    text-align: center;
  }

  .content-card {
    padding: 18px;
  }
}
</style>