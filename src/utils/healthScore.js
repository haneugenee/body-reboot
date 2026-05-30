const reverseScoredIds = new Set([
  'diet_late_meal',
  'diet_fast_food',
  'diet_sugary_drink',
  'diet_outside_food',
  'diet_alcohol_frequency',
  'diet_alcohol_amount',
])

const sectionTotals = {
  식습관: 9,
  신체활동: 6,
}

const improvementMessages = {
  diet_breakfast: '아침식사 빈도를 조금 늘려보세요.',
  diet_late_meal: '늦은 저녁식사와 야식 횟수를 줄여보세요.',
  diet_veggie_fruit: '채소와 과일을 하루에 한 번 더 추가해보세요.',
  diet_protein: '끼니마다 단백질 식품을 조금씩 챙겨보세요.',
  diet_fast_food: '인스턴트식품 대신 집밥이나 일반식 비중을 늘려보세요.',
  diet_sugary_drink: '단 음료를 물이나 무가당 음료로 바꿔보세요.',
  diet_outside_food: '외식·배달 대신 직접 준비한 식사를 늘려보세요.',
  diet_alcohol_frequency: '음주 빈도를 한 단계 줄여보세요.',
  diet_alcohol_amount: '한 번 마실 때 음주량을 줄여보세요.',
  activity_daily: '점심시간 산책처럼 일상 속 움직임을 늘려보세요.',
  activity_steps: '하루 걸음 수를 조금씩 늘려보세요.',
  activity_aerobic: '주간 유산소 운동 시간을 조금 더 늘려보세요.',
  activity_strength: '근력운동을 주 1회 이상부터 꾸준히 시작해보세요.',
  activity_duration: '운동 시간을 30분 이상으로 점차 늘려보세요.',
  activity_intensity: '가벼운 활동에서 중간 강도 활동으로 단계적으로 올려보세요.',
}

const getRawScore = (questionId, optionIndex) =>
  reverseScoredIds.has(questionId) ? 3 - optionIndex : optionIndex

const toHundredScale = (scoreSum, questionCount) =>
  Math.round((scoreSum / (questionCount * 3)) * 100)

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
    const rawScore = optionIndex >= 0 ? getRawScore(question.id, optionIndex) : 0

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

  const dietScore = toHundredScale(dietScoreSum, sectionTotals.식습관)
  const activityScore = toHundredScale(activityScoreSum, sectionTotals.신체활동)
  const lifestyleScore = Math.round((dietScore + activityScore) / 2)

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
