import React, { useMemo, useState } from 'react'
import MiniTrendChart from './MiniTrendChart.jsx'
import {
  getCurrentStreakDays,
  getDailyMissionRecords,
  getHealthCheckHistory,
  getMissionRecordByDate,
  getRecentDateKeys,
  getTodayKey,
  getWeeklyMissionScore,
} from '../utils/storage.js'

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토']

const formatCalendarLabel = (dateKey) => {
  const [year, month, day] = dateKey.split('-').map((value) => Number(value))
  const date = new Date(year, month - 1, day)

  return {
    monthDay: `${month}/${day}`,
    weekday: WEEKDAY_LABELS[date.getDay()],
  }
}

const toStatusLabel = (status) => {
  if (status === 'complete') return '완료'
  if (status === 'half') return '절반 성공'
  return '아직 기록 없음'
}

export default function RecordTab() {
  const history = useMemo(() => getHealthCheckHistory(), [])
  const missionRecords = useMemo(() => getDailyMissionRecords(), [])
  const dateKeys = useMemo(() => getRecentDateKeys(7), [])
  const weeklyMissionScore = useMemo(() => getWeeklyMissionScore(), [])
  const currentStreakDays = useMemo(() => getCurrentStreakDays(), [])
  const [selectedDate, setSelectedDate] = useState(getTodayKey())

  const sortedHistory = useMemo(
    () =>
      [...history].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      ),
    [history],
  )
  const trendData = sortedHistory.slice(-6)

  const count = sortedHistory.length
  const latest = count > 0 ? sortedHistory[count - 1] : null
  const previous = count > 1 ? sortedHistory[count - 2] : null

  const selectedMissionRecord =
    getMissionRecordByDate(selectedDate) ?? missionRecords[selectedDate] ?? null
  const selectedDiet = selectedMissionRecord?.diet ?? null
  const selectedExercise = selectedMissionRecord?.exercise ?? null
  const selectedTotalScore = Number(selectedMissionRecord?.totalScore ?? 0)
  const shortMissionTitle = (title) => {
    if (!title) return '기록 없음'
    return title.length > 20 ? `${title.slice(0, 20)}...` : title
  }

  const statusMessage =
    count === 0
      ? '아직 건강체크 기록이 없습니다.'
      : count === 1
        ? '건강체크를 한 번 더 진행하면 변화 그래프를 확인할 수 있어요.'
        : '최근 건강체크 결과를 기준으로 변화 기록을 확인할 수 있어요.'

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
              max={100}
            />
            <MiniTrendChart
              title="신체활동 점수 변화"
              data={trendData}
              valueKey="activityScore"
              unit="점"
              min={0}
              max={100}
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

      {latest && (
        <section className="record-summary-card">
          <h3>최근 건강체크 요약</h3>
          <dl className="record-grid">
            <div>
              <dt>날짜</dt>
              <dd>{latest.dateLabel || '-'}</dd>
            </div>
            <div>
              <dt>닉네임</dt>
              <dd>{latest.nickname || '-'}</dd>
            </div>
            <div>
              <dt>BMI</dt>
              <dd>
                {Number(latest.bmi).toFixed(1)} ({latest.bmiCategory})
              </dd>
            </div>
            <div>
              <dt>식습관 점수</dt>
              <dd>{latest.dietScore}점</dd>
            </div>
            <div>
              <dt>신체활동 점수</dt>
              <dd>{latest.activityScore}점</dd>
            </div>
            <div>
              <dt>종합 점수</dt>
              <dd>{latest.totalScore}점</dd>
            </div>
          </dl>
        </section>
      )}

      {latest && previous && (
        <section className="record-compare-card">
          <h3>최근 2회 비교</h3>
          <ul>
            <li>
              BMI 변화: {Number(previous.bmi).toFixed(1)} {'->'}{' '}
              {Number(latest.bmi).toFixed(1)}
            </li>
            <li>
              식습관 점수 변화: {previous.dietScore}점 {'->'} {latest.dietScore}점
            </li>
            <li>
              신체활동 점수 변화: {previous.activityScore}점 {'->'}{' '}
              {latest.activityScore}점
            </li>
            <li>
              종합 점수 변화: {previous.totalScore}점 {'->'} {latest.totalScore}점
            </li>
          </ul>
        </section>
      )}

      <section className="mission-calendar-card">
        <h3>실천 달력</h3>
        <div className="mission-calendar-grid">
          {dateKeys.map((dateKey) => {
            const dailyRecord = missionRecords[dateKey]
            const totalScore = Number(dailyRecord?.totalScore ?? 0)
            const dateInfo = formatCalendarLabel(dateKey)
            const isSelected = selectedDate === dateKey

            return (
              <button
                type="button"
                key={dateKey}
                className={`date-chip ${isSelected ? 'is-selected' : ''}`}
                onClick={() => setSelectedDate(dateKey)}
              >
                <span className="date-month-day">{dateInfo.monthDay}</span>
                <span className="date-weekday">{dateInfo.weekday}</span>
                <span className="date-score">
                  {dailyRecord ? `${totalScore}점` : '기록 없음'}
                </span>
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
        <h3>선택한 날짜의 미션 기록 상세</h3>

        {!selectedMissionRecord && (
          <p className="mission-detail-empty">이 날짜에는 아직 미션 기록이 없습니다.</p>
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
              <dd>
                {selectedDiet?.status === 'complete' ? '완료' : '미완료'} ·{' '}
                {shortMissionTitle(selectedDiet?.title)}
              </dd>
            </div>
            <div>
              <dt>운동 미션</dt>
              <dd>
                {selectedExercise?.status === 'complete' ? '완료' : '미완료'} ·{' '}
                {shortMissionTitle(selectedExercise?.title)}
              </dd>
            </div>
          </div>
        )}

        {selectedMissionRecord && false && (
          <div className="mission-detail-grid">
            <div>
              <dt>식단 미션 제목</dt>
              <dd>{selectedDiet?.title || '아직 기록 없음'}</dd>
            </div>
            <div>
              <dt>식단 미션 상태</dt>
              <dd>{toStatusLabel(selectedDiet?.status)}</dd>
            </div>
            <div>
              <dt>식단 미션 점수</dt>
              <dd>{selectedDiet?.score ? `${selectedDiet.score}점` : '아직 기록 없음'}</dd>
            </div>
            <div>
              <dt>운동 미션 제목</dt>
              <dd>{selectedExercise?.title || '아직 기록 없음'}</dd>
            </div>
            <div>
              <dt>운동 미션 상태</dt>
              <dd>{toStatusLabel(selectedExercise?.status)}</dd>
            </div>
            <div>
              <dt>운동 미션 점수</dt>
              <dd>
                {selectedExercise?.score ? `${selectedExercise.score}점` : '아직 기록 없음'}
              </dd>
            </div>
            <div className="mission-detail-total">
              <dt>해당 날짜 총점</dt>
              <dd>{Number(selectedMissionRecord.totalScore ?? 0)}점</dd>
            </div>
          </div>
        )}
      </section>
    </section>
  )
}
