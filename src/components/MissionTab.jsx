import React, { useMemo, useState } from 'react'
import { getTodayMissionRecord, saveTodayMissionRecord } from '../utils/storage.js'

const DIET_TITLE = '식사 속도를 늦추고 15분 이상 천천히 먹기'
const EXERCISE_TITLE = '하루 7,000보 도전하기'

const walkingStats = [
  { label: '오늘 걸음 수', value: '5,800보' },
  { label: '이번 주 평균', value: '6,200보' },
  { label: '목표 걸음 수', value: '7,000보' },
  { label: '목표까지 남은 걸음 수', value: '1,200보' },
]

function MissionCard({ typeLabel, title, description, status, onSelect }) {
  const statusText =
    status === 'complete'
      ? `${typeLabel}: 완료로 기록되었습니다.`
      : status === 'half'
        ? `${typeLabel}: 절반 성공으로 기록되었습니다.`
        : ''

  return (
    <article className="mission-card">
      <span className="mission-type">{typeLabel}</span>
      <h3>{title}</h3>
      <p>{description}</p>

      <div className="mission-actions">
        <button
          type="button"
          className={`mission-btn complete ${status === 'complete' ? 'is-selected' : ''}`}
          onClick={() => onSelect('complete')}
        >
          완료 +10점
        </button>
        <button
          type="button"
          className={`mission-btn half ${status === 'half' ? 'is-selected' : ''}`}
          onClick={() => onSelect('half')}
        >
          절반 성공 +5점
        </button>
      </div>

      {statusText && <p className="mission-status">{statusText}</p>}
    </article>
  )
}

export default function MissionTab() {
  const todayRecord = useMemo(() => getTodayMissionRecord(), [])
  const [dietStatus, setDietStatus] = useState(todayRecord?.diet?.status ?? '')
  const [exerciseStatus, setExerciseStatus] = useState(
    todayRecord?.exercise?.status ?? '',
  )

  const handleDietSelect = (status) => {
    setDietStatus(status)
    saveTodayMissionRecord('diet', {
      status,
      title: DIET_TITLE,
    })
  }

  const handleExerciseSelect = (status) => {
    setExerciseStatus(status)
    saveTodayMissionRecord('exercise', {
      status,
      title: EXERCISE_TITLE,
    })
  }

  return (
    <section className="mission-tab-panel">
      <div className="mission-hero-card">
        <p className="eyebrow">TODAY MISSION</p>
        <h2>오늘의 미션</h2>
        <p>거창한 목표보다 오늘 할 수 있는 작은 실천을 기록해보세요.</p>
      </div>

      <section className="mission-section">
        <h3>오늘의 식단 미션</h3>
        <MissionCard
          typeLabel="식단 미션"
          title={DIET_TITLE}
          description="빠르게 먹는 습관을 줄이면 포만감을 느끼는 데 도움이 됩니다."
          status={dietStatus}
          onSelect={handleDietSelect}
        />
      </section>

      <section className="mission-section">
        <h3>오늘의 운동 미션</h3>
        <MissionCard
          typeLabel="운동 미션"
          title={EXERCISE_TITLE}
          description="출퇴근길, 점심시간, 퇴근 후 걷기를 더해 오늘의 걸음 수를 늘려보세요."
          status={exerciseStatus}
          onSelect={handleExerciseSelect}
        />
      </section>

      <section className="walking-example-card">
        <h3>건강 걷기 앱 연동 예시</h3>
        <p className="walking-note">
          실제 연동 기능은 아니며, 건강 앱 기록을 참고해 직접 확인하는 예시 화면입니다.
        </p>
        <div className="walking-grid">
          {walkingStats.map((item) => (
            <article key={item.label}>
              <p>{item.label}</p>
              <strong>{item.value}</strong>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}
