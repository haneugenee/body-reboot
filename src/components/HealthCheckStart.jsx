import React, { useState } from 'react'

export default function HealthCheckStart({ profile, setProfile, onStartSurvey }) {
  const [message, setMessage] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target

    setProfile((currentValues) => ({
      ...currentValues,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const hasEmptyValue = Object.values(profile).some((value) => value.trim() === '')

    if (hasEmptyValue) {
      setMessage('닉네임, 키, 체중을 모두 입력해주세요.')
      return
    }

    setMessage('')
    onStartSurvey()
  }

  return (
    <section className="health-check-card" aria-labelledby="health-check-title">
      <p className="eyebrow">SELF CHECK</p>
      <h2 id="health-check-title">기본 정보 입력</h2>
      <p className="health-check-description">
        기본 정보를 입력하면 다음 단계에서 생활습관 설문을 진행합니다.
      </p>

      <div className="health-check-intro" aria-label="앱 소개">
        <p className="health-check-intro-lead">
          바쁜 3040 직장인 남성을 위한 생활 밀착형 비만 관리 솔루션입니다.
        </p>
        <p className="health-check-intro-body">
          거창한 다이어트가 아니라, 식단과 운동의 작은 실천을 쌓아 몸과 습관을
          다시 시작합니다.
        </p>
        <p className="health-check-intro-note">
          이 앱은 의료 진단이 아니라 영양교육 실습용 자가진단입니다.
        </p>
      </div>

      <form className="health-check-form" onSubmit={handleSubmit}>
        <label className="form-field">
          <span>닉네임</span>
          <input
            type="text"
            name="nickname"
            value={profile.nickname}
            placeholder="예) 민수"
            onChange={handleChange}
          />
        </label>

        <label className="form-field">
          <span>키(cm)</span>
          <input
            type="number"
            name="height"
            value={profile.height}
            placeholder="예) 175"
            onChange={handleChange}
          />
        </label>

        <label className="form-field">
          <span>체중(kg)</span>
          <input
            type="number"
            name="weight"
            value={profile.weight}
            placeholder="예) 78"
            onChange={handleChange}
          />
        </label>

        <button className="primary-action" type="submit">
          생활습관 설문 시작하기
        </button>

        {message && <p className="form-message">{message}</p>}
      </form>
    </section>
  )
}
