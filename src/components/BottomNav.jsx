import React from 'react'

export default function BottomNav({ tabs, activeTabId, onTabChange }) {
  return (
    <nav className="bottom-nav" aria-label="주요 메뉴">
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId

        return (
          <button
            className={`nav-button ${isActive ? 'is-active' : ''}`}
            type="button"
            key={tab.id}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="nav-dot" aria-hidden="true" />
            <span className="nav-label">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
