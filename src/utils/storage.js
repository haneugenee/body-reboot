const STORAGE_KEYS = {
  profile: 'healthProfile',
  responses: 'preSurveyResponses',
  scores: 'preSurveyScores',
  history: 'healthCheckHistory',
  dailyMissionRecords: 'dailyMissionRecords',
}

const defaultProfile = {
  nickname: '',
  height: '',
  weight: '',
}

const defaultResponses = {}

const isObject = (value) =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const canUseStorage = () =>
  typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'

const safeParse = (rawValue, fallback) => {
  if (!rawValue) return fallback

  try {
    const parsed = JSON.parse(rawValue)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

const safeRead = (key, fallback) => {
  if (!canUseStorage()) return fallback
  return safeParse(window.localStorage.getItem(key), fallback)
}

const safeWrite = (key, value) => {
  if (!canUseStorage()) return

  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Ignore storage quota or serialization errors to keep UI stable.
  }
}

const toDateLabel = (date) =>
  `${date.getFullYear()}. ${date.getMonth() + 1}. ${date.getDate()}.`

const sanitizeProfile = (profile) => {
  if (!isObject(profile)) return defaultProfile

  return {
    nickname: String(profile.nickname ?? ''),
    height: String(profile.height ?? ''),
    weight: String(profile.weight ?? ''),
  }
}

const sanitizeResponses = (responses) => {
  if (!isObject(responses)) return defaultResponses
  return responses
}

const sanitizeScores = (scores) => {
  if (!isObject(scores)) return null

  const requiredKeys = [
    'bmiValue',
    'bmiCategory',
    'dietScore',
    'activityScore',
    'lifestyleScore',
    'topImprovements',
  ]

  const hasAllKeys = requiredKeys.every((key) => key in scores)
  if (!hasAllKeys) return null

  return {
    bmiValue: Number(scores.bmiValue ?? 0),
    bmiCategory: String(scores.bmiCategory ?? ''),
    dietScore: Number(scores.dietScore ?? 0),
    activityScore: Number(scores.activityScore ?? 0),
    lifestyleScore: Number(scores.lifestyleScore ?? 0),
    topImprovements: Array.isArray(scores.topImprovements)
      ? scores.topImprovements.map((item) => String(item))
      : [],
  }
}

export function loadHealthCheckState() {
  const profile = sanitizeProfile(safeRead(STORAGE_KEYS.profile, defaultProfile))
  const responses = sanitizeResponses(
    safeRead(STORAGE_KEYS.responses, defaultResponses),
  )
  const scores = sanitizeScores(safeRead(STORAGE_KEYS.scores, null))

  return {
    profile,
    responses,
    scores,
  }
}

export function saveHealthCheckData({ profile, responses, scores }) {
  safeWrite(STORAGE_KEYS.profile, sanitizeProfile(profile))
  safeWrite(STORAGE_KEYS.responses, sanitizeResponses(responses))
  safeWrite(STORAGE_KEYS.scores, sanitizeScores(scores))
}

export function appendHealthCheckHistory({ profile, scores }) {
  const now = new Date()
  const createdAt = now.toISOString()
  const historyItem = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt,
    dateLabel: toDateLabel(now),
    nickname: String(profile.nickname ?? ''),
    height: Number(profile.height ?? 0),
    weight: Number(profile.weight ?? 0),
    bmi: Number(scores.bmiValue ?? 0),
    bmiCategory: String(scores.bmiCategory ?? ''),
    dietScore: Number(scores.dietScore ?? 0),
    activityScore: Number(scores.activityScore ?? 0),
    totalScore: Number(scores.lifestyleScore ?? 0),
  }

  const history = safeRead(STORAGE_KEYS.history, [])
  const safeHistory = Array.isArray(history) ? history : []
  safeWrite(STORAGE_KEYS.history, [...safeHistory, historyItem])
}

export function getHealthCheckHistory() {
  const history = safeRead(STORAGE_KEYS.history, [])
  return Array.isArray(history) ? history : []
}

export function getTodayKey() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getDailyMissionRecords() {
  const records = safeRead(STORAGE_KEYS.dailyMissionRecords, {})
  return isObject(records) ? records : {}
}

export function getTodayMissionRecord() {
  const records = getDailyMissionRecords()
  return records[getTodayKey()] ?? null
}

const getStatusScore = (status) => {
  if (status === 'complete') return 10
  if (status === 'half') return 5
  if (status === 'record') return 2
  return 0
}

export function saveTodayMissionRecord(type, record) {
  if (type !== 'diet' && type !== 'exercise') return

  const todayKey = getTodayKey()
  const records = getDailyMissionRecords()
  const currentDayRecord = isObject(records[todayKey]) ? records[todayKey] : {}

  const nextDayRecord = {
    ...currentDayRecord,
    [type]: {
      status: record.status,
      score: getStatusScore(record.status),
      title: record.title,
    },
  }

  const dietScore = Number(nextDayRecord.diet?.score ?? 0)
  const exerciseScore = Number(nextDayRecord.exercise?.score ?? 0)

  nextDayRecord.totalScore = dietScore + exerciseScore
  nextDayRecord.updatedAt = new Date().toISOString()

  safeWrite(STORAGE_KEYS.dailyMissionRecords, {
    ...records,
    [todayKey]: nextDayRecord,
  })
}

export function getMissionRecordByDate(dateKey) {
  const records = getDailyMissionRecords()
  return records[dateKey] ?? null
}

export function getRecentDateKeys(days = 7) {
  const safeDays = Math.max(1, Number(days) || 7)
  const keys = []
  const today = new Date()

  for (let i = safeDays - 1; i >= 0; i -= 1) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    keys.push(`${year}-${month}-${day}`)
  }

  return keys
}

export function getWeeklyMissionScore() {
  const records = getDailyMissionRecords()
  const today = new Date()
  const dayOfWeek = today.getDay()
  const daysFromMonday = (dayOfWeek + 6) % 7

  let total = 0

  for (let i = 0; i <= daysFromMonday; i += 1) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const key = `${year}-${month}-${day}`

    total += Number(records[key]?.totalScore ?? 0)
  }

  return total
}

export function getCurrentStreakDays() {
  const records = getDailyMissionRecords()
  const today = new Date()
  let streak = 0

  for (let i = 0; i < 365; i += 1) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const key = `${year}-${month}-${day}`
    const score = Number(records[key]?.totalScore ?? 0)

    if (score >= 1) {
      streak += 1
      continue
    }

    break
  }

  return streak
}

export function getHealthProfileNickname() {
  const profile = sanitizeProfile(safeRead(STORAGE_KEYS.profile, defaultProfile))
  return String(profile.nickname ?? '').trim()
}

export function clearCurrentHealthCheck() {
  if (!canUseStorage()) return

  try {
    window.localStorage.removeItem(STORAGE_KEYS.profile)
    window.localStorage.removeItem(STORAGE_KEYS.responses)
    window.localStorage.removeItem(STORAGE_KEYS.scores)
  } catch {
    // Ignore storage access errors to keep app usable.
  }
}
