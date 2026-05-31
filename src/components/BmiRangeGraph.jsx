import React from 'react'

const BMI_MIN = 15
const BMI_MAX = 35

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

export default function BmiRangeGraph({ bmiValue }) {
  const normalized = ((bmiValue - BMI_MIN) / (BMI_MAX - BMI_MIN)) * 100
  const pinPosition = clamp(normalized, 0, 100)

  return (
    <section className="bmi-graph-card" aria-label="BMI 구간 그래프">
      <h3>BMI 내 위치</h3>

      <div className="bmi-graph-track-wrap">
        <div className="bmi-graph-track" aria-hidden="true">
          <span className="range underweight" />
          <span className="range normal" />
          <span className="range overweight" />
          <span className="range obesity" />
        </div>

        <div className="bmi-pin" style={{ left: `${pinPosition}%` }}>
          <span className="bmi-pin-value">{bmiValue.toFixed(1)}</span>
          <span className="bmi-pin-dot" />
        </div>
      </div>

      <div className="bmi-range-labels" aria-hidden="true">
        <span>저체중</span>
        <span>정상</span>
        <span>과체중</span>
        <span>비만</span>
      </div>
    </section>
  )
}
