import React from 'react'

export default function Header() {
  return (
    <header className="app-header">
      <div className="brand-group">
        <span className="brand-badge" aria-label="BODY REBOOT 로고">
          <img src="/body-reboot-logo-new.png" alt="BODY REBOOT 이미지" />
        </span>
        <div className="brand-text">
          <p className="brand-kicker">3040 직장인 건강 루틴</p>
          <h1>BODY REBOOT</h1>
        </div>
      </div>
    </header>
  )
}
