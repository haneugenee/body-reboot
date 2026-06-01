import React, { useMemo, useState } from 'react'
import { getTodayMissionRecord, saveTodayMissionRecord } from '../utils/storage.js'

const dietMissions = [
  {
    title: '식사 속도를 늦추고 15분 이상 천천히 먹기',
    description: '빠르게 먹는 습관을 줄이면 포만감을 느끼는 데 도움이 됩니다.',
  },
  {
    title: '점심 식사에서 채소 반찬 한 가지 이상 먼저 먹기',
    description: '채소를 먼저 먹으면 한 끼 균형을 잡고 과식을 줄이는 데 도움이 됩니다.',
  },
  {
    title: '오늘 단 음료 대신 물 또는 무가당 음료 선택하기',
    description: '음료 선택만 바꿔도 당류 섭취를 줄이고 식습관을 안정적으로 관리할 수 있습니다.',
  },
]

const exerciseMissions = [
  {
    title: '하루 7,000보 이상 걷기',
    description: '출퇴근길, 점심시간, 퇴근 후 걷기를 통해 오늘의 걸음 수를 채워보세요.',
  },
  {
    title: '벽 스쿼트 30개씩 3세트',
    description: '짧은 시간에도 하체 근력을 자극해 하루 활동량을 늘리는 데 도움이 됩니다.',
  },
  {
    title: '한 정거장 일찍 내려서 퇴근하기',
    description: '퇴근 동선에서 걷기 거리를 늘려 자연스럽게 일일 활동량을 높여보세요.',
  },
  {
    title: '5분 허리 스트레칭하기',
    description: '업무 후 뭉친 허리와 골반 주변을 가볍게 풀어 피로 회복에 도움을 줍니다.',
  },
]

const walkingStats = [
  { label: '오늘 걸음 수', value: '5,800보' },
  { label: '이번 주 평균', value: '6,200보' },
  { label: '목표 걸음 수', value: '7,000보' },
  { label: '목표까지 남은 걸음 수', value: '1,200보' },
]

const getScoreByStatus = (status) => {
  if (status === 'complete') return 10
  if (status === 'half') return 5
  if (status === 'record') return 2
  return 0
}

const formatTodayLabel = () => {
  const today = new Date()
  return `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`
}

const getMissionByDate = (missions, date = new Date()) => {
  const dayKey = Math.floor(date.getTime() / 86400000)
  const index = ((dayKey % missions.length) + missions.length) % missions.length
  return missions[index]
}

function MissionCard({ typeLabel, title, description, status, onSelect }) {
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
          완료
        </button>
        <button
          type="button"
          className={`mission-btn half ${status === 'half' ? 'is-selected' : ''}`}
          onClick={() => onSelect('half')}
        >
          절반 성공
        </button>
        <button
          type="button"
          className={`mission-btn record ${status === 'record' ? 'is-selected' : ''}`}
          onClick={() => onSelect('record')}
        >
          출석만 하기
        </button>
      </div>
    </article>
  )
}

export default function MissionTab() {
  const todayRecord = useMemo(() => getTodayMissionRecord(), [])
  const todayDietMission = useMemo(() => getMissionByDate(dietMissions), [])
  const todayExerciseMission = useMemo(() => getMissionByDate(exerciseMissions), [])
  const [dietStatus, setDietStatus] = useState(todayRecord?.diet?.status ?? '')
  const [exerciseStatus, setExerciseStatus] = useState(todayRecord?.exercise?.status ?? '')

  const dietScore = getScoreByStatus(dietStatus)
  const exerciseScore = getScoreByStatus(exerciseStatus)
  const totalScore = dietScore + exerciseScore

  const handleDietSelect = (status) => {
    setDietStatus(status)
    saveTodayMissionRecord('diet', {
      status,
      title: todayDietMission.title,
    })
  }

  const handleExerciseSelect = (status) => {
    setExerciseStatus(status)
    saveTodayMissionRecord('exercise', {
      status,
      title: todayExerciseMission.title,
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
          title={todayDietMission.title}
          description={todayDietMission.description}
          status={dietStatus}
          onSelect={handleDietSelect}
        />
      </section>

      <section className="mission-section">
        <h3>오늘의 운동 미션</h3>
        <MissionCard
          typeLabel="운동 미션"
          title={todayExerciseMission.title}
          description={todayExerciseMission.description}
          status={exerciseStatus}
          onSelect={handleExerciseSelect}
        />
      </section>

      <section className="mission-today-summary" aria-label="오늘 점수 요약">
        <p className="mission-today-date">오늘 기록 · {formatTodayLabel()}</p>
        <div className="mission-today-grid">
          <p>
            식단 점수 <strong>{dietScore}점</strong>
          </p>
          <p>
            운동 점수 <strong>{exerciseScore}점</strong>
          </p>
          <p className="mission-today-total">
            하루 총점 <strong>{totalScore}점</strong>
          </p>
        </div>
      </section>

      <section className="walking-example-card">
        <h3>건강 걷기 앱 연동 예시</h3>
        <p className="walking-note">
          실제 연동 기능은 아니며 건강 앱 기록을 참고해 직접 확인하는 예시 화면입니다.
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
