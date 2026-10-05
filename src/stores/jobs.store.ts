import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

import {
  getHourlyStats,
  getJobs,
  getJobSources,
  getJobStats,
} from '@/api/jobs.api'

import type {
  HourlyJobStat,
  Job,
  JobStats,
} from '@/types/job'

export const useJobsStore = defineStore('jobs', () => {
  const jobs = ref<Job[]>([])

  const stats = ref<JobStats>({
    newToday: 0,
    lastHour: 0,
    active: 0,
    sources: 0,
  })

  const hourlyStats = ref<HourlyJobStat[]>([])

  // สำคัญ
  const sources = ref<string[]>([])

  const search = ref('')
  const source = ref('all')
  const hours = ref(24)

  const loading = ref(false)
  const error = ref<string | null>(null)

  const jobCount = computed(() => jobs.value.length)

  async function loadDashboard() {
    loading.value = true
    error.value = null

    try {
      const [
        jobResult,
        statResult,
        hourlyResult,
        sourceResult,
      ] = await Promise.all([
        getJobs({
          search: search.value,
          source: source.value,
          hours: hours.value,
          page: 1,
          limit: 50,
        }),

        getJobStats(),

        getHourlyStats(24),

        getJobSources(),
      ])

      jobs.value = jobResult.items
      stats.value = statResult
      hourlyStats.value = hourlyResult

      // สำคัญ
      sources.value = sourceResult
    } catch (err) {
      error.value =
        err instanceof Error
          ? err.message
          : 'Something went wrong'
    } finally {
      loading.value = false
    }
  }

  async function loadSources() {
    try {
      sources.value = await getJobSources()
    } catch (err) {
      console.error(
        'Cannot load job sources',
        err,
      )
    }
  }

  async function refreshJobs() {
    loading.value = true

    try {
      const result = await getJobs({
        search: search.value,
        source: source.value,
        hours: hours.value,
        page: 1,
        limit: 50,
      })

      jobs.value = result.items
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
    refreshJobs()
  }

  function setSource(value: string) {
    source.value = value
    refreshJobs()
  }

  return {
    jobs,
    stats,
    hourlyStats,

    // สำคัญ ต้อง return ออกมา
    sources,

    search,
    source,
    hours,

    loading,
    error,

    jobCount,

    loadDashboard,
    loadSources,

    refreshJobs,
    setHours,
    setSource,
  }
})