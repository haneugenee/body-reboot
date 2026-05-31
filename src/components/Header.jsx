import React from 'react'

export default function Header() {
  return (
    <header className="app-header">
      <div>
        <p className="brand-kicker">3040 직장인 건강 루틴</p>
        <h1>BODY REBOOT</h1>
        <p className="brand-name">바디 리부트</p>
      </div>
      <span className="brand-badge" aria-label="교육용 자가점검 앱">
        EDU
      </span>
    </header>
  )
}
