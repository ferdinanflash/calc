// Main menu / modal open-close

// ---------- MAIN MENU / MODALS ----------
function openModal(id){
  const m=document.getElementById(id);
  if(!m) return;
  m.classList.add('open');
  m.setAttribute('aria-hidden','false');
  document.body.classList.add('modal-open');
  if(typeof uiPushRecent==='function') uiPushRecent(id);
  if(id==='buildingModal') initBuilding();
  if(id==='troopsModal') renderTroopDB();
  if(id==='warAcademyModal') initWarAcademy();
  if(id==='charmModal') renderCharmDB();
  if(id==='chiefGearModal') renderGearDB();
  if(id==='svsModal'){ loadSVS(); renderSVS(); }
  if(id==='rfcModal') initRFC();
  if(id==='asciiModal') initAsciiArt();
  if(id==='asciiEditorModal') initAsciiEditor();
}
function closeModal(id){
  const m=document.getElementById(id);
  if(!m) return;
  m.classList.remove('open');
  m.setAttribute('aria-hidden','true');
  if(!document.querySelector('.modal.open')) document.body.classList.remove('modal-open');
}
document.addEventListener('click',e=>{
  if(e.target.classList.contains('modal')) closeModal(e.target.id);
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    document.querySelectorAll('.modal.open').forEach(m=>closeModal(m.id));
  }
});


// Prepare calculator interfaces and their local assets while the app is online.
// Modals remain closed; this only builds their data-driven contents for offline use.
function warmCalculatorData(){
  const tasks = [
    ['Building', () => initBuilding()],
    ['Troops', () => renderTroopDB()],
    ['War Academy', () => initWarAcademy()],
    ['Chief Charm', () => renderCharmDB()],
    ['Chief Gear', () => renderGearDB()],
    ['SvS', () => { loadSVS(); renderSVS(); }],
    ['RFC', () => initRFC()]
  ];
  tasks.forEach(([name, run]) => {
    try { run(); }
    catch (error) { console.warn('[Offline] Could not prepare ' + name + ' calculator:', error); }
  });

  // Include lazy-loaded images in hidden calculators so the service worker can
  // store them before the user disconnects.
  if ('serviceWorker' in navigator) {
    const urls = [...document.querySelectorAll(
      '.modal img[src], .modal source[src], .modal [data-src]'
    )].map(el => el.currentSrc || el.src || el.dataset.src)
      .filter(Boolean);
    const unique = [...new Set(urls)];
    const send = () => {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'CACHE_URLS', urls: unique });
      } else {
        navigator.serviceWorker.ready.then(reg => {
          (reg.active || navigator.serviceWorker.controller)?.postMessage({ type: 'CACHE_URLS', urls: unique });
        }).catch(() => {});
      }
    };
    send();
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', warmCalculatorData, { once: true });
} else {
  warmCalculatorData();
}
