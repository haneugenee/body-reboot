import React, { useEffect, useMemo, useState } from 'react'
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
    prompt: '아침 식사를 규칙적으로 한다.',
    options: ['거의 안 함', '주 1~2회', '주 3~5회', '거의 매일'],
    scores: [1, 2, 3, 4],
  },
  {
    id: 'diet_skip_meal',
    section: '식습관',
    prompt: '바쁜 업무로 식사를 거르는 경우가 많다.',
    options: ['거의 아님', '가끔 그렇다', '자주 그렇다', '항상 그렇다'],
    scores: [4, 3, 2, 1],
  },
  {
    id: 'diet_delivery_fastfood',
    section: '식습관',
    prompt: '배달음식 또는 패스트푸드를 자주 먹는다.',
    options: ['안 함', '1~2회', '3~5회', '6~7회'],
    scores: [4, 3, 2, 1],
  },
  {
    id: 'diet_late_night',
    section: '식습관',
    prompt: '야식을 자주 먹는다.',
    options: ['안 함', '1~2회', '3~5회', '6~7회'],
    scores: [4, 3, 2, 1],
  },
  {
    id: 'diet_sugary_drink',
    section: '식습관',
    prompt: '탄산음료와 같은 가당 음료를 자주 마신다.',
    options: ['거의 아님', '가끔 그렇다', '자주 그렇다', '항상 그렇다'],
    scores: [4, 3, 2, 1],
  },
  {
    id: 'diet_vegetable_effort',
    section: '식습관',
    prompt: '채소를 매 끼니마다 섭취하려고 노력한다.',
    options: ['거의 아님', '가끔 그렇다', '자주 그렇다', '항상 그렇다'],
    scores: [1, 2, 3, 4],
  },
  {
    id: 'diet_spicy_salty',
    section: '식습관',
    prompt: '짜거나 자극적인 음식을 선호한다.',
    options: ['거의 아님', '가끔 그렇다', '자주 그렇다', '항상 그렇다'],
    scores: [4, 3, 2, 1],
  },
  {
    id: 'diet_protein_include',
    section: '식습관',
    prompt: '단백질 식품을 식사에 포함하려고 한다. (예: 계란, 두부, 생선, 육류 등)',
    options: ['거의 아님', '가끔 그렇다', '자주 그렇다', '항상 그렇다'],
    scores: [1, 2, 3, 4],
  },
  {
    id: 'diet_nutrition_label',
    section: '식습관',
    prompt: '식품 구매 시 영양성분표를 확인하는 편이다.',
    options: ['거의 아님', '가끔 그렇다', '자주 그렇다', '항상 그렇다'],
    scores: [1, 2, 3, 4],
  },
  {
    id: 'diet_health_choice',
    section: '식습관',
    prompt: '건강을 고려하여 식사를 선택하려고 노력한다.',
    options: ['거의 아님', '가끔 그렇다', '자주 그렇다', '항상 그렇다'],
    scores: [1, 2, 3, 4],
  },
  {
    id: 'activity_aerobic',
    section: '신체활동',
    prompt:
      '숨이 차거나 심박수가 올라가는 유산소 활동을 한다. (예: 빠르게 걷기, 달리기, 자전거 타기, 축구 등)',
    options: ['안 함', '1~2회', '3~5회', '6~7회'],
    scores: [1, 2, 3, 4],
  },
  {
    id: 'activity_strength',
    section: '신체활동',
    prompt:
      '웨이트 트레이닝과 같은 근력 운동을 한다. (예: 헬스, 스쿼트, 팔굽혀펴기, 근력 기구 운동 등)',
    options: ['안 함', '1~2회', '3~5회', '6~7회'],
    scores: [1, 2, 3, 4],
  },
  {
    id: 'activity_moderate',
    section: '신체활동',
    prompt:
      '중간 정도 강도의 신체활동을 한다. (예: 계단 오르기, 가벼운 물건 나르기, 보통 속도 자전거 타기 등)',
    options: ['안 함', '1~2회', '3~5회', '6~7회'],
    scores: [1, 2, 3, 4],
  },
  {
    id: 'activity_stretching',
    section: '신체활동',
    prompt: '스트레칭과 같은 가벼운 운동을 한다.',
    options: ['안 함', '1~2회', '3~5회', '6~7회'],
    scores: [1, 2, 3, 4],
  },
  {
    id: 'activity_commute_walk',
    section: '신체활동',
    prompt: '출퇴근 시 걷기나 계단 이용을 실천하는 편이다.',
    options: ['거의 아님', '가끔 그렇다', '자주 그렇다', '항상 그렇다'],
    scores: [1, 2, 3, 4],
  },
  {
    id: 'activity_weekend_active',
    section: '신체활동',
    prompt:
      '주말에 활동적인 여가생활을 하는 편이다. (예: 산책, 등산, 운동, 자전거 등)',
    options: ['거의 아님', '가끔 그렇다', '자주 그렇다', '항상 그렇다'],
    scores: [1, 2, 3, 4],
  },
  {
    id: 'activity_break_sitting',
    section: '신체활동',
    prompt: '오래 앉아 있는 시간을 줄이기 위해 중간중간 일어나 움직이려고 한다.',
    options: ['거의 아님', '가끔 그렇다', '자주 그렇다', '항상 그렇다'],
    scores: [1, 2, 3, 4],
  },
  {
    id: 'activity_fitness_decline',
    section: '신체활동',
    prompt: '운동 부족으로 체력 저하를 느낀 적이 있다.',
    options: ['거의 아님', '가끔 그렇다', '자주 그렇다', '항상 그렇다'],
    scores: [4, 3, 2, 1],
  },
  {
    id: 'activity_too_tired',
    section: '신체활동',
    prompt: '업무 후 피곤함 때문에 운동을 하지 못하는 경우가 많다.',
    options: ['거의 아님', '가끔 그렇다', '자주 그렇다', '항상 그렇다'],
    scores: [4, 3, 2, 1],
  },
  {
    id: 'activity_plan_practice',
    section: '신체활동',
    prompt: '건강관리를 위해 운동 계획을 세우고 실천하려고 한다.',
    options: ['거의 아님', '가끔 그렇다', '자주 그렇다', '항상 그렇다'],
    scores: [1, 2, 3, 4],
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

  useEffect(() => {
    const resetScrollToTop = () => {
      const appMain = document.querySelector('.app-main')
      if (appMain) {
        appMain.scrollTop = 0
        appMain.scrollTo({ top: 0, behavior: 'auto' })
      }
      window.scrollTo({ top: 0, behavior: 'auto' })
    }

    resetScrollToTop()
    const frameId = requestAnimationFrame(resetScrollToTop)
    const timeoutId = setTimeout(resetScrollToTop, 0)

    return () => {
      cancelAnimationFrame(frameId)
      clearTimeout(timeoutId)
    }
  }, [step])

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
