import React, { useMemo, useState } from 'react'

export default function HealthSurvey({
  questions,
  responses,
  setResponses,
  onBack,
  onComplete,
}) {
  const [resultMessage, setResultMessage] = useState('')

  const sections = useMemo(
    () => ({
      식습관: questions.filter((question) => question.section === '식습관'),
      신체활동: questions.filter((question) => question.section === '신체활동'),
    }),
    [questions],
  )

  const handleSelect = (questionId, option) => {
    setResponses((current) => ({
      ...current,
      [questionId]: option,
    }))
    setResultMessage('')
  }

  const handleCheckResult = () => {
    const hasMissingAnswer = questions.some((question) => !responses[question.id])

    if (hasMissingAnswer) {
      setResultMessage('모든 문항에 응답해주세요.')
      return
    }

    setResultMessage('')
    onComplete()
  }

  const renderQuestionGroup = (groupTitle) => (
    <section className="survey-group" key={groupTitle} aria-label={groupTitle}>
      <h3>{groupTitle}</h3>
      <div className="survey-list">
        {sections[groupTitle].map((question) => (
          <article className="survey-question-card" key={question.id}>
            <p>{question.prompt}</p>
            <div className="survey-options" role="group" aria-label={question.prompt}>
              {question.options.map((option) => {
                const isSelected = responses[question.id] === option

                return (
                  <button
                    type="button"
                    key={option}
                    className={`survey-option ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => handleSelect(question.id, option)}
                    aria-pressed={isSelected}
                  >
                    <span className="survey-option-dot" aria-hidden="true" />
                    <span className="survey-option-label">{option}</span>
                  </button>
                )
              })}
            </div>
          </article>
        ))}
      </div>
    </section>
  )

  return (
    <section className="survey-card">
      <p className="eyebrow">LIFESTYLE SURVEY</p>
      <h2>생활습관 설문</h2>
      <p className="survey-guide">
        ※ 모든 질문은 최근 7일을 기준으로 응답해 주세요.
      </p>

      {renderQuestionGroup('식습관')}
      {renderQuestionGroup('신체활동')}

      <section className="survey-reference-card" aria-label="참고 기준">
        <h3>참고 기준</h3>
        <p>
          본 설문은 WHO 신체활동 가이드라인, 국제신체활동설문지(IPAQ),
          국민건강영양조사(KNHANES), 식품의약품안전처 식생활 관련 지침, ACSM
          운동처방 가이드라인을 참고하여 30~40대 사무직 남성의 생활습관 특성에
          맞게 재구성했습니다.
        </p>
        <p className="survey-reference-note">
          ※ 본 설문은 의료 진단이 아닌 영양교육 실습용 자가점검 도구입니다.
        </p>
      </section>

      <div className="survey-actions">
        <button type="button" className="secondary-action" onClick={onBack}>
          이전으로
        </button>
        <button type="button" className="primary-action" onClick={handleCheckResult}>
          결과 확인하기
        </button>
      </div>

      {resultMessage && <p className="form-message">{resultMessage}</p>}
    </section>
  )
}
