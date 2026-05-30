import { useMemo } from 'react'
import { getHealthProfileNickname, getWeeklyMissionScore } from '../utils/storage.js'

const sampleRankings = [
  { name: '민수', score: 75, isMe: false },
  { name: '준호', score: 62, isMe: false },
  { name: '태현', score: 48, isMe: false },
  { name: '성훈', score: 35, isMe: false },
]

export default function RankingTab() {
  const myScore = useMemo(() => getWeeklyMissionScore(), [])
  const myName = useMemo(() => getHealthProfileNickname() || '나', [])

  const rankingRows = useMemo(() => {
    const combined = [
      ...sampleRankings,
      { name: myName, score: myScore, isMe: true },
    ]

    return combined
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score
        if (a.isMe && !b.isMe) return -1
        if (!a.isMe && b.isMe) return 1
        return 0
      })
      .map((row, index) => ({
        ...row,
        rank: index + 1,
      }))
  }, [myName, myScore])

  return (
    <section className="ranking-tab-panel">
      <div className="ranking-header-card">
        <p className="eyebrow">WEEKLY RANKING</p>
        <h2>주간 랭킹</h2>
        <p>
          이번 주 미션 실천 점수를 기준으로 비교합니다. 체중이 아니라 실천을
          비교합니다.
        </p>
      </div>

      <section className="ranking-list-card">
        {rankingRows.map((row) => (
          <div
            key={`${row.name}-${row.isMe ? 'me' : 'sample'}`}
            className={`ranking-row ${row.isMe ? 'is-me' : ''}`}
          >
            <span className="rank-number">{row.rank}</span>
            <span className="rank-name">
              {row.name}
              {row.isMe && <small>내 순위</small>}
            </span>
            <span className="rank-score">{row.score}점</span>
          </div>
        ))}
      </section>
    </section>
  )
}
