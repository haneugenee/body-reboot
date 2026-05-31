import React, { useMemo, useState } from 'react'
import MiniTrendChart from './MiniTrendChart.jsx'
import {
  getCurrentStreakDays,
  getDailyMissionRecords,
  getHealthCheckHistory,
  getMissionRecordByDate,
  getTodayKey,
  getWeeklyMissionScore,
} from '../utils/storage.js'

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

const toStatusLabel = (status) => {
  if (status === 'complete') return '완료'
  if (status === 'half') return '절반 성공'
  if (status === 'record') return '기록만 하기'
  return '없음'
}

const normalizeFiftyScaleScore = (score) => {
  const value = Number(score ?? 0)
  if (value <= 0) return 0
  // Backward compatibility: older records were saved on a 100-point section scale.
  return value > 50 ? Math.round(value / 2) : value
}

export default function RecordTab() {
  const history = useMemo(() => getHealthCheckHistory(), [])
  const missionRecords = useMemo(() => getDailyMissionRecords(), [])
  const weeklyMissionScore = useMemo(() => getWeeklyMissionScore(), [])
  const currentStreakDays = useMemo(() => getCurrentStreakDays(), [])
  const todayKey = getTodayKey()
  const [selectedDate, setSelectedDate] = useState(todayKey)
  const [calendarMonth] = useState(() => {
    const today = new Date()
    return { year: today.getFullYear(), monthIndex: today.getMonth() }
  })

  const sortedHistory = useMemo(
    () =>
      [...history].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      ),
    [history],
  )
  const trendData = useMemo(
    () =>
      sortedHistory.slice(-6).map((item) => ({
        ...item,
        dietScore: normalizeFiftyScaleScore(item.dietScore),
        activityScore: normalizeFiftyScaleScore(item.activityScore),
      })),
    [sortedHistory],
  )

  const count = sortedHistory.length

  const selectedMissionRecord =
    getMissionRecordByDate(selectedDate) ?? missionRecords[selectedDate] ?? null
  const selectedDiet = selectedMissionRecord?.diet ?? null
  const selectedExercise = selectedMissionRecord?.exercise ?? null
  const selectedTotalScore = Number(selectedMissionRecord?.totalScore ?? 0)
  const statusMessage =
    count === 0
      ? '아직 건강체크 기록이 없습니다.'
      : count === 1
        ? '건강체크를 한 번 더 진행하면 변화 그래프를 확인할 수 있어요.'
        : '최근 건강체크 결과를 기준으로 변화 기록을 확인할 수 있어요.'

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

      {count >= 2 && (
        <section className="record-trend-wrap">
          <h3>변화 그래프</h3>
          <p className="trend-note">건강체크를 다시 할 때마다 변화가 누적됩니다.</p>

          <div className="trend-grid">
            <MiniTrendChart
              title="BMI 변화"
              data={trendData}
              valueKey="bmi"
              unit="bmi"
              min={15}
              max={35}
            />
            <MiniTrendChart
              title="식습관 점수 변화"
              data={trendData}
              valueKey="dietScore"
              unit="점"
              min={0}
              max={50}
            />
            <MiniTrendChart
              title="신체활동 점수 변화"
              data={trendData}
              valueKey="activityScore"
              unit="점"
              min={0}
              max={50}
            />
            <MiniTrendChart
              title="종합 점수 변화"
              data={trendData}
              valueKey="totalScore"
              unit="점"
              min={0}
              max={100}
            />
          </div>
        </section>
      )}

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
