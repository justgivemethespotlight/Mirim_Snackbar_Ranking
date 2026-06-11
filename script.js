const categories = [
  {
    id: 'snack',
    label: '🍿 과자류',
    items: []
  },
  {
    id: 'drink',
    label: '🧃 음료류',
    items: []
  },
  {
    id: 'meal',
    label: '🍱 빵류',
    items: []
  },
  {
    id: 'dessert',
    label: '🍰 간식류',
    items: []
  }
];

let activeCat = 'snack';

function goMain() {
  document.getElementById('landing').style.display = 'none';
  document.getElementById('main-page').style.display = 'block';

  const now = new Date();
  document.getElementById('month-label').textContent =
    `${now.getFullYear()}년 ${now.getMonth()+1}월 기준`;

  renderTabs();
  renderRanks();
  renderChampion();
}

function goLanding() {
  document.getElementById('main-page').style.display = 'none';
  document.getElementById('landing').style.display = 'flex';
}

function renderTabs() {
  const wrap = document.getElementById('cat-tabs');
  wrap.innerHTML = categories.map(c =>
    `<button class="cat-tab${c.id === activeCat ? ' active' : ''}"
      onclick="setTab('${c.id}')">${c.label}</button>`
  ).join('');
}

function setTab(id) {
  activeCat = id;
  renderTabs();
  renderRanks();
}

function renderRanks() {
  const cat = categories.find(c => c.id === activeCat);
  const list = document.getElementById('rank-list');

  if (!cat || cat.items.length === 0) {
    list.innerHTML = `<div class="empty-note">
      <i class="ti ti-mood-empty" style="font-size:24px; display:block; margin-bottom:8px; color:#ccc;" aria-hidden="true"></i>
      공사중 <br>좀만 기달려!
    </div>`;
    return;
  }

  list.innerHTML = cat.items
    .sort((a,b) => b.score - a.score)
    .map((item, i) => {
      const cls = i === 0 ? 'r1' : i === 1 ? 'r2' : i === 2 ? 'r3' : 'rn';
      const maxScore = cat.items[0].score;
      const pct = Math.round(item.score / maxScore * 100);
      return `<div class="rank-card">
        <div class="rank-num ${cls}">${i+1}</div>
        <div class="rank-icon">${item.emoji || '🍽️'}</div>
        <div class="rank-info">
          <div class="rank-name">${item.name}</div>
          <div class="rank-tag">${item.tag || ''}</div>
          <div class="rank-bar-wrap"><div class="rank-bar" style="width:${pct}%"></div></div>
        </div>
        <div class="rank-score">
          <div class="score-num">${item.score}</div>
          <div class="score-label">점</div>
        </div>
      </div>`;
    }).join('');
}

function renderChampion() {
  let best = null;
  categories.forEach(cat => {
    if (cat.items.length > 0) {
      const top = [...cat.items].sort((a,b) => b.score - a.score)[0];
      if (!best || top.score > best.score) {
        best = { ...top, catLabel: cat.label };
      }
    }
  });

  if (best) {
    document.getElementById('champ-name').textContent = best.name;
    document.getElementById('champ-cat').textContent = best.catLabel + ' 1위';
    document.getElementById('champ-score').textContent = best.score;
  } else {
    document.getElementById('champ-name').textContent = '—';
    document.getElementById('champ-cat').textContent = '분야 정보를 추가하면 자동으로 표시됩니다';
    document.getElementById('champ-score').textContent = '—';
  }
}
