import React from 'react'

export default function Header() {
  return (
    <header className="app-header">
      <div>
        <p className="brand-kicker">3040 직장인 건강 루틴</p>
        <h1>BODY REBOOT</h1>
        <p className="brand-name">바디 리부트</p>
      </div>
      <span className="brand-badge" aria-label="BODY REBOOT 로고">
        <img src="/body-reboot-logo.png" alt="BODY REBOOT 이미지" />
      </span>
    </header>
  )
}
