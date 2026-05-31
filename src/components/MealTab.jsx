import { useState } from 'react'

const mealCategories = [
  {
    key: 'breakfast',
    label: '아침',
    message: '출근 전 간단하게 챙길 수 있는 아침 선택을 제안합니다.',
  },
  {
    key: 'lunch',
    label: '점심',
    message: '외식, 편의점, 도시락 상황에서 균형 잡는 방법을 제안합니다.',
  },
  {
    key: 'dinner',
    label: '저녁',
    message: '야근이나 외식 상황에서도 과식을 줄이는 선택을 제안합니다.',
  },
  {
    key: 'smart',
    label: '똑똑하게 먹기',
    message:
      '국밥, 중식, 튀김, 고기, 분식처럼 자주 먹는 메뉴를 조절하는 팁을 제공합니다.',
  },
]

const breakfastCards = [
  {
    title: '편의점에서 살 수 있는 아침',
    contextLabel: '예시 메뉴',
    menu: '삶은 달걀 2개 + 바나나 1개 + 무가당 두유',
    nutrition:
      '아침을 거르지 않으면서 단백질과 탄수화물을 간단히 보충할 수 있어요.',
    tips: [
      '단 음료 대신 물이나 무가당 두유 선택',
      '빵만 먹기보다 달걀 함께 먹기',
      '과일을 곁들여 포만감 보완',
    ],
    caution: '단 음료 + 달콤한 빵 + 가공육 조합',
    action: '편의점에서도 단백질 하나를 추가해보세요.',
  },
  {
    title: '집에 구비해두는 간단 아침',
    contextLabel: '예시 메뉴',
    menu: '삶은 달걀 + 바나나 또는 사과 + 플레인 요거트',
    nutrition:
      '아침 준비 시간이 짧고, 단백질과 탄수화물을 함께 챙겨 점심 과식을 줄이는 데 도움이 돼요.',
    tips: [
      '달걀, 두유, 요거트처럼 단백질 식품 하나 포함',
      '바나나, 사과, 방울토마토처럼 바로 먹을 수 있는 식품 준비',
      '단맛 강한 시리얼보다 오트밀, 통밀빵, 플레인 요거트 선택',
    ],
    healthyExamples: [
      '삶은 달걀 2개 + 바나나 1개',
      '플레인 요거트 + 견과류 한 줌 + 과일 조금',
      '무가당 두유 + 통밀빵 1장 + 삶은 달걀',
      '오트밀 + 우유 또는 두유 + 바나나 조금',
      '사과 + 삶은 달걀 + 아메리카노 또는 물',
    ],
    caution:
      '커피만 마시고 아침을 거르거나, 달콤한 빵과 단 음료로만 먹는 습관',
    action: '출근 전 3분 아침으로 점심 폭식과 오전 공복감을 줄여보세요.',
  },
  {
    title: '카페에서 고르는 아침',
    contextLabel: '예시 메뉴',
    menu: '아메리카노 + 채소·달걀 샌드위치 반쪽 또는 플레인 요거트',
    nutrition: '카페에서도 당류와 포화지방을 줄이는 선택이 가능해요.',
    tips: [
      '달달한 라떼보다 아메리카노',
      '크림빵보다 샌드위치 선택',
      '음료와 디저트는 둘 중 하나만',
    ],
    caution: '달달한 음료 + 케이크/크림빵 조합',
    action: '카페 아침은 음료의 당류를 줄이는 것부터 시작해보세요.',
  },
]

const lunchCards = [
  {
    title: '편의점 점심 조합',
    contextLabel: '예시 메뉴',
    menu: '삼각김밥 또는 작은 주먹밥 + 삶은 달걀 + 샐러드 + 물',
    nutrition: '편의점 식사도 조합하면 단백질과 채소를 보완할 수 있어요.',
    tips: ['컵라면만 먹지 않기', '단백질 식품 하나 추가', '국물과 단 음료 줄이기'],
    caution: '컵라면 + 삼각김밥 + 단 음료 조합',
    action: '편의점 식사도 조합하면 균형을 맞출 수 있어요.',
  },
  {
    title: '오늘의 외식 추천 메뉴',
    contextLabel: '예시 메뉴',
    menu: '생선구이 정식, 한식 백반, 순두부찌개 정식',
    nutrition: '외식에서도 단백질과 채소 반찬을 함께 챙길 수 있어요.',
    tips: ['국물은 절반 이하로', '밥은 1/3 정도 덜기', '튀김보다 구이·찜 선택'],
    caution: '국물까지 모두 먹기 + 밥 추가',
    action: '외식은 국물, 밥 양, 채소 조절이 핵심이에요.',
  },
  {
    title: '도시락 추천',
    contextLabel: '예시 메뉴',
    menu: '현미밥 또는 잡곡밥 + 닭가슴살/달걀/두부 + 나물/샐러드',
    nutrition: '도시락은 식사량과 나트륨을 직접 조절하기 좋아요.',
    tips: ['밥·단백질·채소 모두 넣기', '소스는 따로 담기', '가공육보다 달걀·두부 활용'],
    caution: '밥 위주 도시락 + 짠 소스 많이 넣기',
    action: '도시락은 양과 재료를 조절할 수 있는 쉬운 방법이에요.',
  },
]

const dinnerCards = [
  {
    title: '야근할 때 편의점식 추천',
    contextLabel: '예시 메뉴',
    menu: '닭가슴살 샐러드 + 작은 주먹밥 또는 무가당 두유',
    nutrition: '늦은 시간 과식을 줄이면서 단백질을 보충할 수 있어요.',
    tips: ['컵라면·튀김 조합 피하기', '단백질 식품 먼저 선택', '단 음료 대신 물 선택'],
    caution: '야근 후 컵라면 + 튀김 + 단 음료',
    action: '야근 식사는 가볍게, 단백질은 챙겨보세요.',
  },
  {
    title: '오늘의 저녁 외식 추천 메뉴',
    contextLabel: '예시 메뉴',
    menu: '생선구이, 순두부찌개 정식, 보쌈 소량, 샤브샤브',
    nutrition: '저녁 외식은 과식과 나트륨 섭취를 줄이는 것이 중요해요.',
    tips: ['국물은 적게 먹기', '밥 양은 조금 줄이기', '채소 반찬 먼저 먹기'],
    caution: '저녁 외식 후 볶음밥/면 사리까지 추가하기',
    action: '저녁 외식은 양 조절만 해도 달라져요.',
  },
  {
    title: '집에서 간단히 먹는 저녁',
    contextLabel: '예시 메뉴',
    menu: '두부참치 채소 비빔밥 또는 닭가슴살 채소 또띠아',
    nutrition: '단백질, 식이섬유, 포만감을 함께 챙길 수 있어요.',
    tips: ['현미밥이나 잡곡밥 활용', '채소를 충분히 넣기', '소스는 적게 넣기'],
    caution: '소스 많이 넣은 비빔밥 또는 또띠아',
    action: '집밥은 재료와 양을 직접 조절할 수 있어요.',
  },
]

const smartCards = [
  {
    title: '국밥 먹을 때',
    contextLabel: '예시 상황',
    menu: '국밥, 설렁탕, 순대국, 해장국을 먹을 때',
    nutrition: '국밥은 나트륨과 밥 양 조절이 중요해요.',
    tips: ['국물은 절반 이하로', '밥은 조금 덜어내기', '김치·깍두기는 적당량만'],
    caution: '국물까지 모두 먹기 + 밥 추가 + 짠 반찬 많이 먹기',
    action: '국밥은 국물과 밥 양만 조절해도 달라져요.',
  },
  {
    title: '중식 먹을 때',
    contextLabel: '예시 상황',
    menu: '짜장면, 짬뽕, 볶음밥, 탕수육을 먹을 때',
    nutrition: '중식은 기름, 나트륨, 탄수화물 양 조절이 중요해요.',
    tips: ['곱빼기보다 보통 선택', '탕수육 소스는 찍어 먹기', '짬뽕 국물은 적게 먹기'],
    caution: '면 + 탕수육 + 단 음료 조합',
    action: '중식은 양, 소스, 국물만 조절해도 부담이 줄어요.',
  },
  {
    title: '돈가스/튀김류 먹을 때',
    contextLabel: '예시 상황',
    menu: '돈가스, 치킨가스, 튀김덮밥, 튀김정식을 먹을 때',
    nutrition: '튀김류는 지방과 소스 양을 줄이는 것이 중요해요.',
    tips: ['소스는 찍어 먹기', '밥 양은 조금 줄이기', '샐러드 먼저 먹기'],
    caution: '대형 돈가스 + 밥 추가 + 단 음료',
    action: '튀김 메뉴는 소스와 밥 양부터 줄여보세요.',
  },
  {
    title: '고기 먹을 때',
    contextLabel: '예시 상황',
    menu: '삼겹살, 갈비, 제육, 보쌈, 회식 고기 메뉴를 먹을 때',
    nutrition: '고기 메뉴는 포화지방과 과식을 조절하는 것이 중요해요.',
    tips: ['쌈채소와 함께 먹기', '마무리 볶음밥 줄이기', '술과 면 사리는 함께 줄이기'],
    caution: '고기 + 술 + 볶음밥/냉면까지 이어지는 과식',
    action: '고기 메뉴는 채소와 함께, 마무리 탄수화물은 줄여보세요.',
  },
  {
    title: '분식 먹을 때',
    contextLabel: '예시 상황',
    menu: '떡볶이, 김밥, 라면, 튀김, 순대를 먹을 때',
    nutrition: '분식은 탄수화물과 나트륨이 많아 조합을 줄이는 것이 중요해요.',
    tips: ['여러 메뉴를 한 번에 먹지 않기', '튀김은 개수 정하기', '국물과 소스는 적게 먹기'],
    caution: '떡볶이 + 튀김 + 라면 조합',
    action: '분식은 여러 메뉴 조합을 줄이는 것부터 시작해보세요.',
  },
]

const recipeCards = [
  {
    label: '퇴근 후',
    title: '닭가슴살 채소 또띠아',
    situation: '야식이나 배달음식이 당길 때',
    ingredients: '통밀 또띠아, 닭가슴살, 양상추, 파프리카, 양배추, 플레인 요거트 소스',
    points: [
      '단백질을 보충하면서 포만감을 높일 수 있음',
      '채소 섭취를 늘리는 데 도움이 됨',
      '튀긴 음식이나 고열량 야식 대체식으로 활용 가능',
    ],
    tip: '소스는 마요네즈보다 플레인 요거트나 머스터드를 활용하면 부담을 줄일 수 있음',
  },
  {
    label: '집밥',
    title: '두부참치 채소 비빔밥',
    situation: '집에 있는 재료로 빠르게 저녁을 먹고 싶을 때',
    ingredients: '현미밥 또는 잡곡밥, 두부, 참치, 상추 또는 양배추, 오이, 김가루, 저염 간장 양념',
    points: [
      '두부와 참치로 단백질을 보충할 수 있음',
      '채소와 잡곡밥을 함께 먹어 포만감을 높일 수 있음',
      '양념 양을 조절하면 나트륨 섭취를 줄이는 데 도움이 됨',
    ],
    tip: '참치는 기름을 가볍게 제거하고, 양념장은 한 번에 붓지 말고 조금씩 넣어 간을 맞추기',
  },
  {
    label: '간식 대체',
    title: '그릭요거트 견과 볼',
    situation: '아침을 거르기 쉬운 날 또는 늦은 밤 가벼운 간식이 필요할 때',
    ingredients: '무가당 그릭요거트, 견과류, 바나나 또는 베리류, 오트밀 소량',
    points: [
      '단백질과 식이섬유를 함께 챙길 수 있음',
      '단 음료나 과자 대신 선택하기 좋음',
      '준비 시간이 짧아 바쁜 직장인에게 적합함',
    ],
    tip: '시럽이나 초코 토핑은 줄이고, 과일로 단맛을 보충하기',
  },
]

const categoryCards = {
  breakfast: breakfastCards,
  lunch: lunchCards,
  dinner: dinnerCards,
  smart: smartCards,
}

function MealDetailCard({ card }) {
  return (
    <article className="meal-detail-card">
      <h3>{card.title}</h3>

      <dl className="meal-detail-grid">
        <div>
          <dt>{card.contextLabel || '예시 메뉴'}</dt>
          <dd>{card.menu}</dd>
        </div>
        <div>
          <dt>영양 포인트</dt>
          <dd>{card.nutrition}</dd>
        </div>
      </dl>

      <div className="meal-detail-block">
        <h4>실천 팁</h4>
        <ul>
          {card.tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </div>

      {card.healthyExamples && (
        <div className="meal-detail-block">
          <h4>건강한 간단 아침 예</h4>
          <ul>
            {card.healthyExamples.map((example) => (
              <li key={example}>{example}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="meal-caution">
        <strong>조절이 필요한 선택:</strong> {card.caution}
      </p>

      <p className="meal-action-line">{card.action}</p>
    </article>
  )
}

function RecipeCard({ recipe }) {
  return (
    <article className="recipe-card">
      <div className="recipe-head">
        <span className="recipe-label">{recipe.label}</span>
        <h4>{recipe.title}</h4>
      </div>

      <dl className="recipe-grid">
        <div>
          <dt>추천 상황</dt>
          <dd>{recipe.situation}</dd>
        </div>
        <div>
          <dt>구성</dt>
          <dd>{recipe.ingredients}</dd>
        </div>
      </dl>

      <div className="recipe-points">
        <h5>포인트</h5>
        <ul>
          {recipe.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>

      <p className="recipe-tip">
        <strong>실천 팁:</strong> {recipe.tip}
      </p>
    </article>
  )
}

export default function MealTab() {
  const [selectedCategory, setSelectedCategory] = useState(mealCategories[0].key)
  const currentCategory =
    mealCategories.find((category) => category.key === selectedCategory) ??
    mealCategories[0]
  const cards = categoryCards[selectedCategory] ?? null

  return (
    <section className="meal-tab-panel">
      <div className="meal-header-card">
        <p className="eyebrow">MEAL GUIDE</p>
        <h2>식사 가이드</h2>
        <p>바쁜 직장인도 상황에 맞게 더 나은 선택을 할 수 있도록 도와줍니다.</p>
      </div>

      <div className="meal-category-row" role="tablist" aria-label="식사 카테고리">
        {mealCategories.map((category) => {
          const isActive = selectedCategory === category.key

          return (
            <button
              key={category.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`meal-category-chip ${isActive ? 'is-active' : ''}`}
              onClick={() => setSelectedCategory(category.key)}
            >
              {category.label}
            </button>
          )
        })}
      </div>

      {!cards && (
        <article className="meal-guide-card">
          <h3>{currentCategory.label}</h3>
          <p>{currentCategory.message}</p>
        </article>
      )}

      {cards && (
        <section className="meal-breakfast-list">
          {cards.map((card) => (
            <MealDetailCard card={card} key={card.title} />
          ))}
        </section>
      )}

      <section className="recipe-section">
        <div className="recipe-section-header">
          <h3>간단 레시피</h3>
          <p>바쁜 퇴근 후에도 부담 없이 따라 할 수 있는 현실적인 한 끼 예시입니다.</p>
        </div>
        <div className="recipe-list">
          {recipeCards.map((recipe) => (
            <RecipeCard key={recipe.title} recipe={recipe} />
          ))}
        </div>
      </section>
    </section>
  )
}

