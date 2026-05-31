const improvementMessages = {
  diet_breakfast: '아침식사 빈도를 조금 늘려보세요.',
  diet_skip_meal: '바쁜 날에도 간단한 식사를 챙겨 결식을 줄여보세요.',
  diet_delivery_fastfood: '배달·패스트푸드 횟수를 한 단계 줄여보세요.',
  diet_late_night: '야식은 횟수부터 줄여보며 수면 전 공복 시간을 확보해보세요.',
  diet_sugary_drink: '단 음료를 물이나 무가당 음료로 바꿔보세요.',
  diet_vegetable_effort: '매 끼니 채소를 조금씩 추가해 식사 균형을 맞춰보세요.',
  diet_spicy_salty: '짠맛·자극적인 메뉴는 빈도와 양을 함께 줄여보세요.',
  diet_protein_include: '한 끼에 단백질 식품을 한 가지 이상 포함해보세요.',
  diet_nutrition_label: '식품 구매 전 영양성분표를 확인하는 습관을 들여보세요.',
  diet_health_choice: '메뉴를 고를 때 건강 기준 한 가지를 먼저 정해보세요.',
  activity_aerobic: '유산소 활동 횟수를 조금씩 늘려 심폐지구력을 키워보세요.',
  activity_strength: '근력운동을 주 1~2회부터 규칙적으로 시작해보세요.',
  activity_moderate: '일상에서 중간 강도 활동 시간을 조금 더 확보해보세요.',
  activity_stretching: '가벼운 스트레칭을 자주 넣어 몸의 긴장을 풀어보세요.',
  activity_commute_walk: '출퇴근 동선에서 걷기·계단 비중을 조금 더 늘려보세요.',
  activity_weekend_active: '주말 여가를 활동형 일정으로 한 번 바꿔보세요.',
  activity_break_sitting: '오래 앉아 있을 때 1시간마다 짧게 움직여보세요.',
  activity_fitness_decline: '체력 저하 신호가 느껴질 때 짧은 운동부터 재시작해보세요.',
  activity_too_tired: '피곤한 날용 짧은 운동 루틴을 미리 정해두세요.',
  activity_plan_practice: '주간 운동 계획을 작게 세우고 실천 체크를 해보세요.',
}

const getRawScore = (question, optionIndex) => {
  if (optionIndex < 0) return 0
  if (Array.isArray(question.scores) && question.scores.length > optionIndex) {
    return Number(question.scores[optionIndex] ?? 0)
  }
  return optionIndex + 1
}

const toFiftyScale = (scoreSum) => Math.round((scoreSum / 40) * 50)

const getBmiCategory = (bmi) => {
  if (bmi < 18.5) return '저체중'
  if (bmi < 23) return '정상'
  if (bmi < 25) return '과체중'
  return '비만'
}

export function calculateHealthResult(profile, questions, responses) {
  const heightInMeters = Number(profile.height) / 100
  const weight = Number(profile.weight)
  const bmiValue =
    heightInMeters > 0 && weight > 0
      ? Number((weight / (heightInMeters * heightInMeters)).toFixed(1))
      : 0

  const scoredQuestions = questions.map((question, index) => {
    const selectedValue = responses[question.id]
    const optionIndex = question.options.findIndex((option) => option === selectedValue)
    const rawScore = getRawScore(question, optionIndex)

    return {
      ...question,
      order: index,
      rawScore,
      message: improvementMessages[question.id],
    }
  })

  const dietScoreSum = scoredQuestions
    .filter((question) => question.section === '식습관')
    .reduce((sum, question) => sum + question.rawScore, 0)

  const activityScoreSum = scoredQuestions
    .filter((question) => question.section === '신체활동')
    .reduce((sum, question) => sum + question.rawScore, 0)

  const dietScore = toFiftyScale(dietScoreSum)
  const activityScore = toFiftyScale(activityScoreSum)
  const lifestyleScore = dietScore + activityScore

  const topImprovements = [...scoredQuestions]
    .sort((a, b) => {
      if (a.rawScore !== b.rawScore) return a.rawScore - b.rawScore
      return a.order - b.order
    })
    .slice(0, 3)
    .map((question) => question.message)

  return {
    bmiValue,
    bmiCategory: getBmiCategory(bmiValue),
    dietScore,
    activityScore,
    lifestyleScore,
    topImprovements,
  }
}
