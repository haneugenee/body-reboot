import React from 'react'

import BmiRangeGraph from './BmiRangeGraph.jsx'

export default function HealthCheckResult({
  profile,
  result,
  onEditResponses,
  onRestart,
}) {
  return (
    <section className="result-card">
      <BmiRangeGraph bmiValue={result.bmiValue} />

      <p className="eyebrow">HEALTH RESULT</p>
      <h2>{profile.nickname || '사용자'}님의 건강체크 결과</h2>
      <p className="result-guide">
        현재 상태를 진단하기보다, 앞으로 바꿀 수 있는 생활습관을 확인하는 화면입니다.
      </p>

      <div className="result-bmi-box">
        <p>BMI</p>
        <strong>{result.bmiValue.toFixed(1)}</strong>
        <span>{result.bmiCategory}</span>
      </div>

      <div className="result-score-grid">
        <article>
          <h3>식습관 점수</h3>
          <p>{result.dietScore}점</p>
        </article>
        <article>
          <h3>신체활동 점수</h3>
          <p>{result.activityScore}점</p>
        </article>
        <article className="result-total">
          <h3>종합 생활습관 점수</h3>
          <p>{result.lifestyleScore}점</p>
        </article>
      </div>

      <section className="improvement-card">
        <h3>주요 개선 포인트 TOP 3</h3>
        <ul>
          {result.topImprovements.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <div className="result-actions">
        <button type="button" className="secondary-action" onClick={onEditResponses}>
          응답 수정하기
        </button>
        <button type="button" className="primary-action" onClick={onRestart}>
          건강체크 다시 하기
        </button>
      </div>
    </section>
  )
}
