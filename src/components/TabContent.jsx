import React from 'react'

import HealthCheck from './HealthCheck.jsx'
import MealTab from './MealTab.jsx'
import MissionTab from './MissionTab.jsx'
import RankingTab from './RankingTab.jsx'
import RecordTab from './RecordTab.jsx'

export default function TabContent({ tab }) {
  if (tab.id === 'health') return <HealthCheck />
  if (tab.id === 'mission') return <MissionTab />
  if (tab.id === 'meal') return <MealTab />
  if (tab.id === 'record') return <RecordTab />
  if (tab.id === 'ranking') return <RankingTab />

  return (
    <section className="tab-panel">
      <div className="hero-card">
        <p className="eyebrow">{tab.eyebrow}</p>
        <h2>{tab.title}</h2>
        <p>{tab.description}</p>
      </div>

      <div className="notice-card">
        <span className="notice-pill">준비 중</span>
        <h3>{tab.label} 기능은 다음 단계에서 구현됩니다</h3>
        <p>
          지금은 전체 화면 흐름과 브랜드 분위기를 먼저 확인하는 단계입니다.
          계산, 저장, 그래프, 달력, 랭킹 로직은 아직 포함하지 않았습니다.
        </p>
      </div>

      <div className="direction-card">
        <h3>최종 기능 방향</h3>
        <ul>
          {tab.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
