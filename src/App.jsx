import React, { useState } from 'react'
import Header from './components/Header.jsx'
import BottomNav from './components/BottomNav.jsx'
import TabContent from './components/TabContent.jsx'

const tabs = [
  {
    id: 'health',
    label: '건강체크',
    shortLabel: '체크',
    eyebrow: 'SELF CHECK',
    title: '나의 현재 상태를 가볍게 점검해요',
    description:
      '기본 정보와 생활습관 설문을 통해 BMI와 생활습관 점수를 확인합니다.',
    points: ['체중보다 생활 리듬을 함께 봅니다', '진단이 아닌 교육용 자가점검입니다'],
  },
  {
    id: 'mission',
    label: '미션',
    shortLabel: '미션',
    eyebrow: 'DAILY ACTION',
    title: '퇴근 후에도 가능한 작은 실천',
    description: '오늘의 식단 미션과 운동 미션을 실천하고 기록합니다.',
    points: ['부담 없는 하루 단위 목표', '성공 경험을 쌓는 습관 루틴'],
  },
  {
    id: 'meal',
    label: '식사',
    shortLabel: '식사',
    eyebrow: 'SMART MEAL',
    title: '바쁜 일정 속 식사 선택을 도와요',
    description: '아침, 점심, 저녁, 똑똑하게 먹기 카드를 제공합니다.',
    points: ['회식과 외식 상황까지 고려', '굶기보다 균형 잡힌 선택'],
  },
  {
    id: 'record',
    label: '기록',
    shortLabel: '기록',
    eyebrow: 'PROGRESS',
    title: '변화는 숫자보다 꾸준함에서 시작돼요',
    description: '건강체크 변화 기록과 실천 달력을 확인합니다.',
    points: ['작은 실천의 흐름 확인', '생활습관 변화 중심 기록'],
  },
  {
    id: 'ranking',
    label: '랭킹',
    shortLabel: '랭킹',
    eyebrow: 'TEAM BOOST',
    title: '체중 경쟁 대신 실천을 응원해요',
    description: '체중이 아니라 이번 주 미션 실천 점수로 비교합니다.',
    points: ['건강한 동기부여 중심', '동료와 함께 만드는 리부트 분위기'],
  },
]

export default function App() {
  const [activeTabId, setActiveTabId] = useState(tabs[0].id)
  const activeTab = tabs.find((tab) => tab.id === activeTabId) ?? tabs[0]

  return (
    <div className="app-shell">
      <div className="phone-frame">
        <Header />

        <main className="app-main" aria-live="polite">
          <TabContent tab={activeTab} />
        </main>

        <BottomNav
          tabs={tabs}
          activeTabId={activeTabId}
          onTabChange={setActiveTabId}
        />
      </div>
    </div>
  )
}
