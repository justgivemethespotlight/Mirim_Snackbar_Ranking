const CHAMPION = { catId: 'bread', name: '포켓몬빵', emoji: '⚡' };

  const categories = [
    { id: 'snack',  label: '과자류',  emoji: '🍪', items: [
      { name: '눈을감자',          emoji: '🥔', tag: '짭짤한 감자칩' },
      { name: '꼬북칩 초코츄러스', emoji: '🍫', tag: '달콤 초코맛' },
      { name: '구운감자',          emoji: '🥔', tag: '고소한 스낵' },
      { name: '포스틱',            emoji: '🌽', tag: '바삭한 과자' }
    ]},
    { id: 'drink',  label: '음료류',  emoji: '🧃', items: [
      { name: '포카리스웨트', emoji: '💧', tag: '이온음료' },
      { name: '파워에이드',   emoji: '⚡', tag: '스포츠음료' },
      { name: '뽀로로 밀크맛', emoji: '🐧', tag: '어린이 음료' },
      { name: '코코팜',       emoji: '🥥', tag: '코코넛 음료' }
    ]},
    { id: 'bread',  label: '빵류',    emoji: '🍞', items: [
      { name: '포켓몬빵', emoji: '⚡', tag: '스티커 수집 필수템' }
    ]},
    { id: 'light',  label: '간식류',  emoji: '🍬', items: [
      { name: '마이쮸',   emoji: '🍬', tag: '새콤달콤 젤리' },
      { name: '푸쵸',    emoji: '🍭', tag: '쫄깃한 캔디' },
      { name: '찹쌀떡',  emoji: '🍡', tag: '쫀득한 떡' },
      { name: '이클립스', emoji: '🌿', tag: '민트 사탕' }
    ]},
    { id: 'single', label: '낱개류',  emoji: '🛒', items: [
      { name: '참붕어빵', emoji: '🐟', tag: '붕어빵 간식' },
      { name: '초코파이', emoji: '🍫', tag: '국민 간식' },
      { name: '마가레트', emoji: '🌼', tag: '버터 쿠키' }
    ]},
    { id: 'ice',    label: '아이스류', emoji: '🍦', items: [
      { name: '빠삐코', emoji: '🧊', tag: '시원한 아이스바' },
      { name: '요맘때', emoji: '🍦', tag: '달콤 소프트 아이스' }
    ]},
    { id: 'frozen', label: '냉동류',  emoji: '❄️', items: [
      { name: '치킨',   emoji: '🍗', tag: '매점 치킨' },
      { name: '핫도그', emoji: '🌭', tag: '바삭한 핫도그' },
      { name: '만두',   emoji: '🥟', tag: '든든한 한 끼' }
    ]}
  ];

  const MEDALS = ['🥇', '🥈', '🥉'];
  let activeCat = 'snack';

  // ensure activeCat points to a valid category
  if (!categories.some(c => c.id === activeCat) && categories.length > 0) {
    activeCat = categories[0].id;
  }

  // compute an overall ranked list by assigning a simple score based on position in each category
  function computeOverallList() {
    const list = [];
    categories.forEach(c => {
      c.items.forEach((item, idx) => {
        // top gets 100, next 95, then 90 ... simple descending weight
        const score = Math.max(0, 100 - idx * 5);
        list.push({
          name: item.name,
          emoji: item.emoji || c.emoji,
          tag: item.tag || '',
          cat: c.label,
          catId: c.id,
          score
        });
      });
    });
    // sort by score desc, then name
    list.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
    return list;
  }

  function goMain() {
    document.getElementById('landing').style.display = 'none';
    document.getElementById('main-page').style.display = 'block';
    const now = new Date();
    document.getElementById('month-label').textContent =
      now.getFullYear() + '년 ' + (now.getMonth()+1) + '월 기준';
    renderAll();
  }

  function goLanding() {
    document.getElementById('main-page').style.display = 'none';
    document.getElementById('landing').style.display = 'flex';
  }

  function renderAll() {
    renderWinnerRow();
    renderTabs();
    renderRanks();
    // show champion as rank (1위) rather than numeric score
    const champNameEl = document.getElementById('champ-name');
    const champCatEl = document.getElementById('champ-cat');
    const champScoreEl = document.getElementById('champ-score');
    const champUnitEl = document.querySelector('.champion-score .unit');
    if (champNameEl) champNameEl.textContent = CHAMPION.name || '—';
    const cat = categories.find(c => c.id === CHAMPION.catId);
    if (champCatEl) champCatEl.textContent = cat ? cat.label : '분야 정보를 추가하면 자동으로 표시됩니다';
    if (champScoreEl) champScoreEl.textContent = '1';
    if (champUnitEl) champUnitEl.textContent = '위';
 }

  function renderWinnerRow() {
    const wrap = document.getElementById('winner-row');
    if (!wrap) return; // avoid throwing when winner-row is not present in HTML
    wrap.innerHTML = categories.map(c => {
       const top = c.items[0];
       const isChamp = c.id === CHAMPION.catId;
       return `<div class="cat-winner-card${isChamp ? ' champ' : ''}" onclick="setTab('${c.id}')">
         <div class="w-emoji">${top ? (top.emoji || c.emoji) : c.emoji}</div>
         <div class="w-cat">${c.label}</div>
         <div class="w-name">${top ? top.name : '미정'}</div>
         <div class="w-rank">🥇 1위</div>
         ${isChamp ? '<div class="champ-tag">👑 종합 1위</div>' : ''}
       </div>`;
     }).join('');
  }

  function renderTabs() {
    const wrap = document.getElementById('cat-tabs');
    wrap.innerHTML = categories.map(c =>
      `<button class="cat-tab${c.id === activeCat ? ' active' : ''}" onclick="setTab('${c.id}')">
        <span class="tab-emoji">${c.emoji}</span>${c.label}
      </button>`
    ).join('');
    // add 전체 tab first, then category tabs
    const allBtn = `<button class="cat-tab${activeCat === 'all' ? ' active' : ''}" onclick="setTab('all')">
      <span class="tab-emoji">🌐</span>전체
    </button>`;
    const catBtns = categories.map(c =>
      `<button class="cat-tab${c.id === activeCat ? ' active' : ''}" onclick="setTab('${c.id}')">
        <span class="tab-emoji">${c.emoji}</span>${c.label}
      </button>`
   ).join('');
    wrap.innerHTML = allBtn + catBtns;
  }

  function setTab(id) {
    activeCat = id;
    renderTabs();
    renderRanks();
    document.getElementById('rank-list').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function renderRanks() {
    const cat = categories.find(c => c.id === activeCat);
    const list = document.getElementById('rank-list');
    if (!cat) {
      list.innerHTML = `<div style="background:#f4f3f0;border-radius:8px;padding:2rem;text-align:center;color:#bbb;font-size:13px;border:1px dashed #ddd;">
        <span style="font-size:28px;display:block;margin-bottom:8px;">⚠️</span>
        <strong style="color:#999;">카테고리 없음</strong> 선택된 카테고리를 찾을 수 없습니다.
      </div>`;
      return;
    }
    if (!cat.items || cat.items.length === 0) {
      list.innerHTML = `<div style="background:#f4f3f0;border-radius:8px;padding:2rem;text-align:center;color:#bbb;font-size:13px;border:1px dashed #ddd;">
        <span style="font-size:28px;display:block;margin-bottom:8px;">🕐</span>
        <strong style="color:#999;">${cat.label}</strong> 메뉴를 곧 업데이트할 예정이에요!
      </div>`;
      return;
    }
    list.innerHTML = cat.items.map((item, i) => {
      const medal = MEDALS[i] || null;
      return `<div class="rank-card${i === 0 ? ' top1' : ''}">
        ${medal
          ? `<div class="rank-medal">${medal}</div>`
          : `<div class="rank-num">${i+1}</div>`}
        <div class="rank-icon">${item.emoji || cat.emoji}</div>
        <div class="rank-info">
          <div class="rank-name">${item.name}</div>
          <div class="rank-tag">${item.tag || ''}</div>
        </div>
      </div>`;
    }).join('');
  }

  // attach safe click handler in case inline onclick doesn't fire
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('#landing .enter-btn');
    if (btn) {
      btn.type = 'button'; // 명시적 타입 지정
      if (typeof goMain === 'function') btn.addEventListener('click', goMain);
    }
  });
    if (activeCat === 'all') {
      const overall = computeOverallList();
      if (!overall.length) {
        list.innerHTML = `<div class="empty-note">전체 항목이 없습니다.</div>`;
        return;
      }
      list.innerHTML = overall.map((item, i) => {
        const medal = MEDALS[i] || null;return `<div class="rank-card${i === 0 ? ' top1' : ''}">
          ${medal ? `<div class="rank-medal">${medal}</div>` : `<div class="rank-num">${i+1}</div>`}
          <div class="rank-icon">${item.emoji}</div>
          <div class="rank-info">
            <div class="rank-name">${item.name}</div>
            <div class="rank-tag">${item.cat}</div>
          </div>
        </div>`;
      }).join('');
      return;
    }
    const cat = categories.find(c => c.id === activeCat);
    if (!cat) {
      list.innerHTML = `<div class="empty-note">선택된 카테고리를 찾을 수 없습니다.</div>`;
      return;
    }
    if (!cat.items || cat.items.length === 0) {
      list.innerHTML = `<div class="empty-note"><strong>${cat.label}</strong> 메뉴를 곧 업데이트할 예정이에요!</div>`;
      return;
    }
    list.innerHTML = cat.items.map((item, i) => {
      const medal = MEDALS[i] || null;
      return `<div class="rank-card${i === 0 ? ' top1' : ''}">
        ${medal ? `<div class="rank-medal">${medal}</div>` : `<div class="rank-num">${i+1}</div>`}
        <div class="rank-icon">${item.emoji || cat.emoji}</div>
        <div class="rank-info">
         <div class="rank-name">${item.name}</div>
          <div class="rank-tag">${item.tag || ''}</div>
        </div>
      </div>`;
    }).join('');
  
  // attach safe click handler in case inline onclick doesn't fire
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('#landing .enter-btn');
    if (btn) {
      btn.type = 'button'; // 명시적 타입 지정
      if (typeof goMain === 'function') btn.addEventListener('click', goMain);
    }
  });
