/* UI extras: bottom nav, favorites, recent, sticky summary, copy, SW banner, toast */

const UI_FAV_KEY = 'wos3475_favs';
const UI_RECENT_KEY = 'wos3475_recent';
const UI_TOOLS = [
  { id: 'buildingModal', label: 'Building', icon: 'bi-building-gear', group: 'calc' },
  { id: 'troopsModal', label: 'Troops', icon: 'bi-people-fill', group: 'calc' },
  { id: 'warAcademyModal', label: 'War Acad.', icon: 'bi-mortarboard-fill', group: 'calc' },
  { id: 'charmModal', label: 'Charm', icon: 'bi-gem', group: 'calc' },
  { id: 'chiefGearModal', label: 'Chief Gear', icon: 'bi-shield-fill', group: 'calc' },
  { id: 'heroGearModal', label: 'Hero Gear', icon: 'bi-award-fill', group: 'calc' },
  { id: 'svsModal', label: 'SvS', icon: 'bi-trophy-fill', group: 'event' },
  { id: 'rfcModal', label: 'RFC', icon: 'bi-fire', group: 'event' },
  { id: 'asciiModal', label: 'ASCII', icon: 'bi-palette-fill', group: 'extra' }
];

function uiLoadList(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; } catch (e) { return []; }
}
function uiSaveList(key, arr) {
  try { localStorage.setItem(key, JSON.stringify(arr)); } catch (e) {}
}

function uiToggleFav(modalId, ev) {
  if (ev) { ev.stopPropagation(); ev.preventDefault(); }
  let favs = uiLoadList(UI_FAV_KEY);
  if (favs.includes(modalId)) favs = favs.filter(x => x !== modalId);
  else favs = [modalId, ...favs].slice(0, 8);
  uiSaveList(UI_FAV_KEY, favs);
  uiRenderHomeExtras();
  uiSyncFavButtons();
}

function uiIsFav(modalId) {
  return uiLoadList(UI_FAV_KEY).includes(modalId);
}

function uiPushRecent(modalId) {
  let r = uiLoadList(UI_RECENT_KEY).filter(x => x !== modalId);
  r.unshift(modalId);
  uiSaveList(UI_RECENT_KEY, r.slice(0, 6));
  uiRenderHomeExtras();
}

function uiToolMeta(id) {
  return UI_TOOLS.find(t => t.id === id);
}

function uiRenderHomeExtras() {
  const favEl = document.getElementById('uiFavGrid');
  const recentEl = document.getElementById('uiRecentGrid');
  const favs = uiLoadList(UI_FAV_KEY);
  const recent = uiLoadList(UI_RECENT_KEY);
  if (favEl) {
    if (!favs.length) {
      favEl.innerHTML = '<div class="ui-empty">Pin tools with ★ on any menu card</div>';
    } else {
      favEl.innerHTML = favs.map(id => {
        const t = uiToolMeta(id);
        if (!t) return '';
        return `<button type="button" class="ui-chip" onclick="openModal('${id}')"><i class="bi ${t.icon}"></i>${t.label}</button>`;
      }).join('');
    }
  }
  if (recentEl) {
    if (!recent.length) {
      recentEl.innerHTML = '<div class="ui-empty">Recently opened tools appear here</div>';
    } else {
      recentEl.innerHTML = recent.map(id => {
        const t = uiToolMeta(id);
        if (!t) return '';
        return `<button type="button" class="ui-chip muted" onclick="openModal('${id}')"><i class="bi ${t.icon}"></i>${t.label}</button>`;
      }).join('');
    }
  }
}

function uiSyncFavButtons() {
  document.querySelectorAll('[data-fav-for]').forEach(btn => {
    const id = btn.getAttribute('data-fav-for');
    const on = uiIsFav(id);
    btn.classList.toggle('on', on);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.innerHTML = on ? '<i class="bi bi-star-fill"></i>' : '<i class="bi bi-star"></i>';
  });
}

function uiToast(msg) {
  let el = document.getElementById('uiToast');
  if (!el) {
    el = document.createElement('div');
    el.id = 'uiToast';
    el.className = 'ui-toast';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(uiToast._t);
  uiToast._t = setTimeout(() => el.classList.remove('show'), 2200);
}

function uiCopyText(text) {
  if (!text) { uiToast('Nothing to copy'); return; }
  const done = () => uiToast('Copied summary');
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(() => uiFallbackCopy(text, done));
  } else uiFallbackCopy(text, done);
}
function uiFallbackCopy(text, done) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); done(); } catch (e) { uiToast('Copy failed'); }
  document.body.removeChild(ta);
}

/** Build sticky summary bar inside a modal-box */
function uiEnsureStickyBar(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return null;
  const box = modal.querySelector('.modal-box');
  if (!box) return null;
  let bar = box.querySelector('.ui-sticky-bar');
  if (!bar) {
    bar = document.createElement('div');
    bar.className = 'ui-sticky-bar';
    bar.innerHTML = `<div class="ui-sticky-text" data-sticky-text>—</div>
      <button type="button" class="ui-copy-btn" title="Copy summary"><i class="bi bi-clipboard"></i> Copy</button>`;
    box.appendChild(bar);
    bar.querySelector('.ui-copy-btn').addEventListener('click', () => {
      uiCopyText(bar.dataset.copy || bar.querySelector('[data-sticky-text]')?.textContent || '');
    });
  }
  return bar;
}

function uiSetSticky(modalId, displayText, copyText) {
  const bar = uiEnsureStickyBar(modalId);
  if (!bar) return;
  const t = bar.querySelector('[data-sticky-text]');
  if (t) t.textContent = displayText || '—';
  bar.dataset.copy = copyText || displayText || '';
  bar.classList.toggle('empty', !displayText);
}

function uiShowSwBanner() {
  if (document.getElementById('uiSwBanner')) return;
  const b = document.createElement('div');
  b.id = 'uiSwBanner';
  b.className = 'ui-sw-banner';
  b.innerHTML = `<span>New version available</span>
    <button type="button" class="mini-btn" id="uiSwRefresh">Refresh</button>
    <button type="button" class="ui-sw-dismiss" aria-label="Dismiss">×</button>`;
  document.body.appendChild(b);
  b.querySelector('#uiSwRefresh').onclick = () => {
    if (navigator.serviceWorker?.controller) {
      navigator.serviceWorker.controller.postMessage('SKIP_WAITING');
    }
    location.reload();
  };
  b.querySelector('.ui-sw-dismiss').onclick = () => b.remove();
}

function uiInitSwBanner() {
  if (!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.ready.then(reg => {
    reg.addEventListener('updatefound', () => {
      const nw = reg.installing;
      if (!nw) return;
      nw.addEventListener('statechange', () => {
        if (nw.state === 'installed' && navigator.serviceWorker.controller) uiShowSwBanner();
      });
    });
  });
  let refreshing = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshing) return;
    refreshing = true;
    location.reload();
  });
}

function uiEnhanceMenuCards() {
  document.querySelectorAll('.menu-card[onclick]').forEach(card => {
    const m = String(card.getAttribute('onclick') || '').match(/openModal\('([^']+)'\)/);
    if (!m) return;
    const id = m[1];
    if (card.querySelector('[data-fav-for]')) return;
    const star = document.createElement('button');
    star.type = 'button';
    star.className = 'ui-fav-btn';
    star.setAttribute('data-fav-for', id);
    star.setAttribute('aria-label', 'Favorite');
    star.onclick = (e) => uiToggleFav(id, e);
    card.style.position = 'relative';
    card.appendChild(star);
  });
  uiSyncFavButtons();
}

function uiInit() {
  uiEnhanceMenuCards();
  uiRenderHomeExtras();
  uiInitSwBanner();
}

document.addEventListener('DOMContentLoaded', uiInit);
if (document.readyState !== 'loading') uiInit();
