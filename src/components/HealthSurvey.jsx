import { useMemo, useState } from 'react'

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
                    {option}
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
        최근 1~2주를 떠올리며 가장 가까운 답을 선택해주세요.
      </p>

      {renderQuestionGroup('식습관')}
      {renderQuestionGroup('신체활동')}

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
