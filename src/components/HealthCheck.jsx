import React, { useMemo, useState } from 'react'
import HealthCheckStart from './HealthCheckStart.jsx'
import HealthSurvey from './HealthSurvey.jsx'
import HealthCheckResult from './HealthCheckResult.jsx'
import { calculateHealthResult } from '../utils/healthScore.js'
import {
  appendHealthCheckHistory,
  clearCurrentHealthCheck,
  loadHealthCheckState,
  saveHealthCheckData,
} from '../utils/storage.js'

const surveyQuestions = [
  {
    id: 'diet_breakfast',
    section: '식습관',
    prompt: '아침식사는 얼마나 자주 하나요?',
    options: ['거의 안 함', '주 1~2회', '주 3~5회', '거의 매일'],
  },
  {
    id: 'diet_late_meal',
    section: '식습관',
    prompt: '야식 또는 늦은 저녁식사는 얼마나 자주 하나요?',
    options: ['거의 없음', '주 1~2회', '주 3~5회', '거의 매일'],
  },
  {
    id: 'diet_veggie_fruit',
    section: '식습관',
    prompt:
      '채소 또는 과일은 하루에 얼마나 자주 먹나요? (예시: 나물, 샐러드, 쌈채소, 과일 등)',
    options: ['거의 먹지 않음', '하루 1회', '하루 2회', '하루 3회 이상'],
  },
  {
    id: 'diet_protein',
    section: '식습관',
    prompt: '생선, 육류, 달걀, 두부, 콩류 같은 단백질 식품을 얼마나 챙겨 먹나요?',
    options: ['거의 먹지 않음', '하루 1회', '하루 2회', '거의 매 끼니'],
  },
  {
    id: 'diet_fast_food',
    section: '식습관',
    prompt:
      '패스트푸드 및 인스턴트식품은 얼마나 자주 먹나요? (예시: 라면, 햄·소시지, 편의점 도시락, 패스트푸드 등)',
    options: ['거의 없음', '주 1~2회', '주 3~5회', '거의 매일'],
  },
  {
    id: 'diet_sugary_drink',
    section: '식습관',
    prompt:
      '단 음료는 얼마나 자주 마시나요? (예시: 탄산음료, 달달한 커피, 에너지드링크, 가당 주스 등)',
    options: ['거의 없음', '주 1~2회', '주 3~5회', '거의 매일'],
  },
  {
    id: 'diet_outside_food',
    section: '식습관',
    prompt: '외식·배달·편의점 음식으로 식사를 해결하는 빈도는 어느 정도인가요?',
    options: ['거의 없음', '주 1~2회', '주 3~5회', '거의 매일'],
  },
  {
    id: 'diet_alcohol_frequency',
    section: '식습관',
    prompt: '술은 얼마나 자주 마시나요?',
    options: ['마시지 않음', '월 1~2회', '주 1~2회', '주 3회 이상'],
  },
  {
    id: 'diet_alcohol_amount',
    section: '식습관',
    prompt: '술을 마실 때 한 번에 보통 얼마나 마시나요?',
    options: ['마시지 않음', '1~2잔', '소주 반 병 정도', '소주 1병 이상'],
  },
  {
    id: 'activity_daily',
    section: '신체활동',
    prompt:
      '일상생활에서 신체활동을 얼마나 하는 편인가요? (예시: 계단 이용, 출퇴근 걷기, 점심시간 산책, 업무 중 이동 등)',
    options: ['거의 안 함', '가끔 함', '자주 함', '매우 자주 함'],
  },
  {
    id: 'activity_steps',
    section: '신체활동',
    prompt: '평소 하루 평균 걸음 수는 어느 정도인가요?',
    options: ['3,000보 미만', '3,000~4,999보', '5,000~7,999보', '8,000보 이상'],
  },
  {
    id: 'activity_aerobic',
    section: '신체활동',
    prompt:
      '숨이 약간 차는 유산소 운동은 주당 얼마나 하나요? (예시: 빠르게 걷기, 자전거, 조깅, 등산 등)',
    options: [
      '거의 안 함',
      '주 30분 미만',
      '주 30분~2시간 30분 미만',
      '주 2시간 30분 이상',
    ],
  },
  {
    id: 'activity_strength',
    section: '신체활동',
    prompt: '근력운동은 주 몇 회 하나요? (예시: 웨이트, 팔굽혀펴기, 스쿼트, 기구운동 등)',
    options: ['거의 안 함', '주 1회', '주 2회', '주 3회 이상'],
  },
  {
    id: 'activity_duration',
    section: '신체활동',
    prompt: '운동을 한 번 할 때 평균 지속시간은 어느 정도인가요?',
    options: ['10분 미만', '10~29분', '30~59분', '60분 이상'],
  },
  {
    id: 'activity_intensity',
    section: '신체활동',
    prompt: '운동 강도는 보통 어느 정도인가요?',
    options: [
      '거의 움직이지 않음',
      '가벼운 활동 중심',
      '중간 강도 활동 중심',
      '고강도 활동 중심',
    ],
  },
]

export default function HealthCheck() {
  const restoredState = useMemo(() => loadHealthCheckState(), [])

  const [step, setStep] = useState(restoredState.scores ? 'result' : 'profile')
  const [profile, setProfile] = useState(restoredState.profile)
  const [surveyResponses, setSurveyResponses] = useState(restoredState.responses)
  const [savedResult, setSavedResult] = useState(restoredState.scores)

  const calculatedResult = useMemo(
    () => calculateHealthResult(profile, surveyQuestions, surveyResponses),
    [profile, surveyResponses],
  )
  const result = savedResult ?? calculatedResult

  const emptyProfile = {
    nickname: '',
    height: '',
    weight: '',
  }

  const handleCompleteSurvey = () => {
    const latestResult = calculateHealthResult(profile, surveyQuestions, surveyResponses)

    setSavedResult(latestResult)
    setStep('result')

    saveHealthCheckData({
      profile,
      responses: surveyResponses,
      scores: latestResult,
    })

    appendHealthCheckHistory({
      profile,
      scores: latestResult,
    })
  }

  const handleRestartHealthCheck = () => {
    setProfile(emptyProfile)
    setSurveyResponses({})
    setSavedResult(null)
    setStep('profile')
    clearCurrentHealthCheck()
  }

  if (step === 'profile') {
    return (
      <HealthCheckStart
        profile={profile}
        setProfile={setProfile}
        onStartSurvey={() => setStep('survey')}
      />
    )
  }

  if (step === 'survey') {
    return (
      <HealthSurvey
        questions={surveyQuestions}
        responses={surveyResponses}
        setResponses={setSurveyResponses}
        onBack={() => setStep('profile')}
        onComplete={handleCompleteSurvey}
      />
    )
  }

  return (
    <HealthCheckResult
      profile={profile}
      result={result}
      onEditResponses={() => setStep('survey')}
      onRestart={handleRestartHealthCheck}
    />
  )
}
