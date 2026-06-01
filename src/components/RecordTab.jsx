import React, { useMemo, useState } from 'react'
import MiniTrendChart from './MiniTrendChart.jsx'
import {
  createBodyChangeRecord,
  getCurrentStreakDays,
  getBodyChangeHistory,
  getDailyMissionRecords,
  getMissionRecordByDate,
  getTodayKey,
  getWeeklyMissionScore,
  loadHealthCheckState,
  saveBodyChangeRecord,
} from '../utils/storage.js'

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

const toStatusLabel = (status) => {
  if (status === 'complete') return '완료'
  if (status === 'half') return '절반 성공'
  if (status === 'record') return '출석만 하기'
  return '없음'
}

const getSafeRange = (values, fallbackMin, fallbackMax) => {
  const safeValues = values.filter((value) => Number.isFinite(value))
  if (safeValues.length === 0) return { min: fallbackMin, max: fallbackMax }

  const minValue = Math.min(...safeValues)
  const maxValue = Math.max(...safeValues)
  if (maxValue - minValue < 0.1) {
    return {
      min: Math.max(0, minValue - 1),
      max: maxValue + 1,
    }
  }

  return {
    min: Math.max(0, minValue - 2),
    max: maxValue + 2,
  }
}

export default function RecordTab() {
  const restoredHealth = useMemo(() => loadHealthCheckState(), [])
  const missionRecords = useMemo(() => getDailyMissionRecords(), [])
  const weeklyMissionScore = useMemo(() => getWeeklyMissionScore(), [])
  const currentStreakDays = useMemo(() => getCurrentStreakDays(), [])
  const todayKey = getTodayKey()
  const [selectedDate, setSelectedDate] = useState(todayKey)
  const [bodyChangeHistory, setBodyChangeHistory] = useState(() => getBodyChangeHistory())
  const [currentWeight, setCurrentWeight] = useState('')
  const [bodyChangeMessage, setBodyChangeMessage] = useState('')
  const [calendarMonth] = useState(() => {
    const today = new Date()
    return { year: today.getFullYear(), monthIndex: today.getMonth() }
  })

  const sortedBodyHistory = useMemo(
    () =>
      [...bodyChangeHistory]
        .map((item, index) => ({ ...item, _index: index }))
        .sort((a, b) => {
          if (a.date !== b.date) return a.date.localeCompare(b.date)
          return a._index - b._index
        }),
    [bodyChangeHistory],
  )
  const bodyTrendData = sortedBodyHistory.slice(-8)
  const bodyHistoryCount = sortedBodyHistory.length
  const latestBodyRecord = sortedBodyHistory[sortedBodyHistory.length - 1] ?? null
  const weightValues = bodyTrendData.map((item) => Number(item.weight ?? 0))
  const bmiValues = bodyTrendData.map((item) => Number(item.bmi ?? 0))
  const weightRange = getSafeRange(weightValues, 40, 120)
  const bmiRange = getSafeRange(bmiValues, 15, 35)

  const selectedMissionRecord =
    getMissionRecordByDate(selectedDate) ?? missionRecords[selectedDate] ?? null
  const selectedDiet = selectedMissionRecord?.diet ?? null
  const selectedExercise = selectedMissionRecord?.exercise ?? null
  const selectedTotalScore = Number(selectedMissionRecord?.totalScore ?? 0)
  const statusMessage =
    bodyHistoryCount === 0
      ? '아직 체중 변화 기록이 없습니다.'
      : bodyHistoryCount === 1
        ? '체중 기록을 한 번 더 추가하면 변화 그래프를 확인할 수 있어요.'
        : '최근 체중과 BMI 변화를 확인할 수 있어요.'

  const handleSaveBodyChange = (event) => {
    event.preventDefault()
    const numericWeight = Number(currentWeight)

    if (!Number.isFinite(numericWeight) || numericWeight <= 0) {
      setBodyChangeMessage('체중을 올바르게 입력해주세요.')
      return
    }

    const nextRecord = createBodyChangeRecord({ weight: numericWeight })
    if (!nextRecord) {
      setBodyChangeMessage('기록을 저장할 수 없습니다. 키와 체중 정보를 확인해주세요.')
      return
    }

    saveBodyChangeRecord(nextRecord)
    setBodyChangeHistory((current) => [...current, nextRecord])
    setCurrentWeight('')
    setBodyChangeMessage('')
  }

  const monthlyCalendarCells = useMemo(() => {
    const firstDate = new Date(calendarMonth.year, calendarMonth.monthIndex, 1)
    const firstWeekday = firstDate.getDay()
    const daysInMonth = new Date(calendarMonth.year, calendarMonth.monthIndex + 1, 0).getDate()
    const cells = []

    for (let i = 0; i < firstWeekday; i += 1) {
      cells.push({ key: `empty-${i}`, isEmpty: true })
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      const month = String(calendarMonth.monthIndex + 1).padStart(2, '0')
      const dayText = String(day).padStart(2, '0')
      const dateKey = `${calendarMonth.year}-${month}-${dayText}`
      const dailyRecord = missionRecords[dateKey]
      const score = Number(dailyRecord?.totalScore ?? 0)

      cells.push({
        key: dateKey,
        isEmpty: false,
        dateKey,
        day,
        score,
        hasRecord: Boolean(dailyRecord),
        isToday: dateKey === todayKey,
      })
    }

    return cells
  }, [calendarMonth.monthIndex, calendarMonth.year, missionRecords, todayKey])

  return (
    <section className="record-tab-panel">
      <div className="record-hero-card">
        <p className="eyebrow">MY PROGRESS</p>
        <h2>나의 변화 기록</h2>
        <p>{statusMessage}</p>
      </div>

      <section className="record-trend-wrap">
        <h3>체중 변화 기록</h3>
        <p className="trend-note">
          닉네임과 키는 기존 정보를 사용하고, 현재 체중만 입력해 BMI 변화를 기록합니다.
        </p>

        <form className="body-change-form" onSubmit={handleSaveBodyChange}>
          <p className="body-change-meta">
            닉네임: <strong>{restoredHealth.profile.nickname || '-'}</strong>
          </p>
          <p className="body-change-meta">
            키(cm): <strong>{restoredHealth.profile.height || '-'}</strong>
          </p>
          <label className="form-field">
            <span>현재 체중(kg)</span>
            <input
              type="number"
              value={currentWeight}
              placeholder="예) 77"
              onChange={(event) => setCurrentWeight(event.target.value)}
            />
          </label>
          <button type="submit" className="primary-action body-change-add-btn">
            추가하기
          </button>
          {bodyChangeMessage && <p className="form-message">{bodyChangeMessage}</p>}
        </form>
      </section>

      <section className="record-trend-wrap">
        <h3>체중/BMI 변화 그래프</h3>
        {latestBodyRecord && (
          <p className="trend-note">
            최근 BMI 분류: <strong>{latestBodyRecord.bmiCategory || '-'}</strong>
          </p>
        )}
        {bodyTrendData.length <= 1 ? (
          <p className="trend-note">체중 기록을 추가하면 변화 그래프가 표시됩니다.</p>
        ) : (
          <div className="trend-grid">
            <MiniTrendChart
              title="체중 변화"
              data={bodyTrendData}
              valueKey="weight"
              unit="kg"
              min={weightRange.min}
              max={weightRange.max}
            />
            <MiniTrendChart
              title="BMI 변화"
              data={bodyTrendData}
              valueKey="bmi"
              unit="bmi"
              min={bmiRange.min}
              max={bmiRange.max}
            />
          </div>
        )}
      </section>

      <section className="mission-calendar-card">
        <h3>월간 실천 달력</h3>
        <p className="month-label">
          {calendarMonth.year}년 {calendarMonth.monthIndex + 1}월
        </p>

        <div className="month-weekday-row">
          {WEEKDAY_LABELS.map((weekday) => (
            <span key={weekday}>{weekday}</span>
          ))}
        </div>

        <div className="month-calendar-grid">
          {monthlyCalendarCells.map((cell) => {
            if (cell.isEmpty) {
              return <span key={cell.key} className="month-empty-cell" aria-hidden="true" />
            }

            const isSelected = selectedDate === cell.dateKey

            return (
              <button
                key={cell.key}
                type="button"
                className={`month-date-cell ${cell.isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''} ${cell.hasRecord ? 'has-record' : 'no-record'}`}
                onClick={() => setSelectedDate(cell.dateKey)}
              >
                <span className="month-day-number">{cell.day}</span>
                <span className="month-day-score">{cell.hasRecord ? `${cell.score}점` : ''}</span>
              </button>
            )
          })}
        </div>
      </section>

      <section className="weekly-summary-card">
        <h3>이번 주 실천 요약</h3>
        <div className="weekly-summary-grid">
          <p>
            이번 주 점수: <strong>{weeklyMissionScore}점</strong>
          </p>
          <p>
            연속 실천일: <strong>{currentStreakDays}일</strong>
          </p>
        </div>
        <p className="weekly-summary-note">
          이번 주 점수는 월요일부터 오늘까지의 미션 실천 점수입니다.
        </p>
      </section>

      <section className="mission-detail-card">
        <h4 className="mission-detail-title-compact">선택 날짜 기록</h4>

        {!selectedMissionRecord && (
          <p className="mission-detail-empty">
            아직 기록이 없습니다. 오늘의 미션을 선택하면 이곳에 표시됩니다.
          </p>
        )}

        {selectedMissionRecord && (
          <div className="mission-detail-compact">
            <div>
              <dt>날짜</dt>
              <dd>{selectedDate}</dd>
            </div>
            <div>
              <dt>실천 점수</dt>
              <dd>{selectedTotalScore}점</dd>
            </div>
            <div>
              <dt>식단 미션</dt>
              <dd>{toStatusLabel(selectedDiet?.status)}</dd>
            </div>
            <div>
              <dt>운동 미션</dt>
              <dd>{toStatusLabel(selectedExercise?.status)}</dd>
            </div>
          </div>
        )}
      </section>
    </section>
  )
}
