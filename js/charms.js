// Chief Charm

// ---------- CHIEF CHARMS ----------
// 18 independent charm slots: 3 charms per gear piece across 6 pieces
// (Helmet+Watch = Lancer, Jacket+Pants = Infantry, Ring+Cane = Marksman).
// Levels/materials come from WOS_DB.charmSteps / WOS_DB.charmCost (database.js),
// matching https://wostools.net/chief-charms-calculator (checked 2026-09-28):
// Level 1-18 with sub-levels from Lv.4 onward (4.1-4.3, ..., 16.1-16.8, 17.1-17.8),
// Jewel Secrets only needed for Lv.12-18, SvS/KoI points = charm score x 70.
let charmVals = [];
function charmSlotList(){
  return WOS_DB.chiefCharmsPieces.flatMap(p=>[1,2,3].map(n=>({piece:p,n})));
}
function ensureCharmVals(){
  const slots=charmSlotList();
  if(!Array.isArray(charmVals)||charmVals.length!==slots.length) charmVals=slots.map(()=>({c:0,t:0}));
}
function charmLevelOpts(){
  return WOS_DB.charmSteps.map((s,i)=>`<option value="${i}">${s.label==='0'?'0 (None)':s.label}</option>`).join('');
}
function charmMaxIdx(){return WOS_DB.charmSteps.length-1;}

// Material icons (Charm Guide / Charm Design / Jewel Secrets): images/charms/material-*.webp
const chMatImg=(k,nm)=>`<img class="mat-ic" src="images/charms/material-${k}.webp" alt="${nm}" loading="lazy">`;
const CH_GUIDE=chMatImg('guide','Charm Guide'), CH_DESIGN=chMatImg('design','Charm Design'), CH_SECRET=chMatImg('secrets','Jewel Secrets');

// Charm icons: images/charms/charm-{type}-{LL}.webp (Lv.1-16 available; Lv.17-18 fall back to Lv.16 art).
const CHARM_ICON_MAX=16;
function charmBaseLevel(idx){
  const st=WOS_DB.charmSteps[idx]; return st?Math.floor(parseFloat(st.label)||0):0;
}
function charmIconHtml(type,idx){
  type=String(type).toLowerCase();
  const lv=charmBaseLevel(idx);
  if(lv<=0) return '<span class="charm-ic empty" title="No charm"></span>';
  const shown=Math.min(lv,CHARM_ICON_MAX), lab=WOS_DB.charmSteps[idx].label;
  const t=lv>CHARM_ICON_MAX?`Lv.${lab} (icon for Lv.${CHARM_ICON_MAX} shown)`:`Lv.${lab}`;
  return `<span class="charm-ic" title="${t}"><img src="images/charms/charm-${type}-${String(shown).padStart(2,'0')}.webp" alt="${type} charm Lv.${lab}" loading="lazy"></span>`;
}
function charmUpdateIcons(i){
  const slot=charmSlotList()[i], v=charmVals[i]; if(!slot||!v) return;
  const c=document.getElementById('chIcC'+i), t=document.getElementById('chIcT'+i);
  if(c) c.innerHTML=charmIconHtml(slot.piece.type,v.c);
  if(t) t.innerHTML=charmIconHtml(slot.piece.type,v.t);
}

function charmApplyMin(i){
  const t=document.getElementById('chTar'+i), v=charmVals[i]; if(!t||!v) return;
  for(const o of t.options) o.disabled=+o.value<v.c; // target can't be below current
}
function syncCharmControls(){
  ensureCharmVals();
  charmVals.forEach((v,i)=>{
    const c=document.getElementById('chCur'+i),t=document.getElementById('chTar'+i);
    if(c)c.value=v.c; if(t)t.value=v.t;
    charmApplyMin(i);
    charmUpdateIcons(i);
  });
  calcCharmSummary();
}
function charmSetCur(i,val){
  const v=charmVals[i]; v.c=+val;
  if(v.t<v.c){v.t=v.c; const t=document.getElementById('chTar'+i); if(t)t.value=v.t;}
  charmApplyMin(i);
  charmUpdateIcons(i);
  calcCharmSummary();
}
function charmSetTar(i,val){
  const v=charmVals[i]; v.t=Math.max(+val,v.c);
  const t=document.getElementById('chTar'+i); if(t)t.value=v.t;
  charmUpdateIcons(i);
  calcCharmSummary();
}
function charmSetAllTarget(idx){ensureCharmVals();charmVals.forEach(v=>{v.t=Math.min(idx,charmMaxIdx());if(v.t<v.c)v.t=v.c;});syncCharmControls();}
function charmMatchCurrentToTarget(){ensureCharmVals();charmVals.forEach(v=>v.c=v.t);syncCharmControls();}
function charmResetAll(){charmVals=charmSlotList().map(()=>({c:0,t:0}));syncCharmControls();}

function calcCharmTotals(){
  ensureCharmVals();
  const slots=charmSlotList();
  const totals={guides:0,designs:0,secrets:0,score:0,steps:0};
  const byType={};
  WOS_DB.troopTypes.forEach(t=>byType[t]={guides:0,designs:0,secrets:0,score:0});
  slots.forEach((slot,i)=>{
    const v=charmVals[i]; if(v.t<v.c) v.t=v.c;
    const c=WOS_DB.charmCost(v.c,v.t);
    totals.guides+=c.guides; totals.designs+=c.designs; totals.secrets+=c.secrets; totals.score+=c.score; totals.steps+=Math.max(0,v.t-v.c);
    const bt=byType[slot.piece.type]; bt.guides+=c.guides; bt.designs+=c.designs; bt.secrets+=c.secrets; bt.score+=c.score;
  });
  return {totals,byType,slots};
}
function calcCharmSummary(){
  const {totals,byType}=calcCharmTotals();
  const points=totals.score*WOS_DB.charmRules.pointsPerScore;
  const invG=valNum('chAvailG'), invD=valNum('chAvailD'), invS=valNum('chAvailS');
  const needG=Math.max(0,totals.guides-invG), needD=Math.max(0,totals.designs-invD), needS=Math.max(0,totals.secrets-invS);

  const req=document.getElementById('chTotalResult');
  if(req) req.innerHTML=[
    [CH_GUIDE+' Charm Guides',fmt(totals.guides)],
    [CH_DESIGN+' Charm Designs',fmt(totals.designs)],
    [CH_SECRET+' Jewel Secrets',fmt(totals.secrets)],
    ['<i class="bi bi-arrow-up-circle-fill"></i> Upgrade Steps',fmt(totals.steps)],
    ['<i class="bi bi-trophy-fill"></i> SvS / KoI Points',fmt(points)]
  ].map(x=>statCard(x[1],x[0])).join('');

  const need=document.getElementById('chNeedResult');
  const allCovered=needG===0&&needD===0&&needS===0;
  if(need) need.innerHTML=[
    [CH_GUIDE+' Guides',needG],[CH_DESIGN+' Designs',needD],[CH_SECRET+' Secrets',needS]
  ].map(x=>statCard(fmt(x[1]),x[0],x[1]===0?'ok':'warn')).join('')
   +`<div class="notice">${allCovered?'✅ The entered resources are sufficient for all upgrades.':'⚠️ More resources are required above to reach the target.'}</div>`;

  const byTypeEl=document.getElementById('chByType');
  if(byTypeEl) byTypeEl.innerHTML=WOS_DB.troopTypes.map(t=>{
    const b=byType[t]; const pts=b.score*WOS_DB.charmRules.pointsPerScore;
    return `<div class="tree-item"><b>${troopIcon(t)} ${t}</b><span>${fmt(b.guides)} Guides · ${fmt(b.designs)} Designs · ${fmt(b.secrets)} Secrets · ${fmt(pts)} pts</span></div>`;
  }).join('');
}

function renderCharmDB(){
 const m=document.getElementById('charmModal'); if(!m)return; const b=m.querySelector('.modal-box');
 ensureCharmVals();
 if(b.dataset.built){syncCharmControls();return;} // already built: keep the DOM (and typed resources), just refresh
 const slots=charmSlotList(), lvlOpts=charmLevelOpts();
 const rowsByType=WOS_DB.troopTypes.map(type=>{
   const rows=slots.map((s,i)=>({s,i})).filter(x=>x.s.piece.type===type).map(({s,i})=>
     `<div class="charm-row"><span class="charm-ic-wrap" id="chIcC${i}"></span><span>${s.piece.name} #${s.n}</span>
      <select id="chCur${i}" onchange="charmSetCur(${i},this.value)">${lvlOpts}</select>
      <span>→</span>
      <select id="chTar${i}" onchange="charmSetTar(${i},this.value)">${lvlOpts}</select>
      <span class="charm-ic-wrap" id="chIcT${i}"></span>
      </div>`).join('');
   return `<div class="bc-section"><h3>${troopIcon(type)} ${type}</h3><div class="research-list">${rows}</div></div>`;
 }).join('');

 b.innerHTML=`<button class="modal-close" onclick="closeModal('charmModal')">×</button><div class="modal-title"><i class="bi bi-gem"></i> Chief Charm</div><div class="modal-sub">18 independent charm slots — 3 charms per gear piece (Helmet+Watch = Lancer, Jacket+Pants = Infantry, Ring+Cane = Marksman). Levels 1–18, with sub-levels starting at Lv.4. Chief Charm unlocks at Furnace Lv.25; Lv.16 requires Gen 7 state.</div>
 <div class="bc-toolbar">
   <button class="mini-btn" onclick="charmSetAllTarget(32)">Set All Desired Lv.11</button>
   <button class="mini-btn" onclick="charmSetAllTarget(57)">Set All Desired Lv.16</button>
   <button class="mini-btn" onclick="charmSetAllTarget(${charmMaxIdx()})">Set All Desired Lv.18</button>
   <button class="mini-btn" onclick="charmMatchCurrentToTarget()">Mark All Complete</button>
   <button class="mini-btn" onclick="charmResetAll()">Reset All</button>
 </div>
 ${rowsByType}
 <div class="bc-section"><h3><i class="bi bi-bag-fill"></i> Available Resources</h3><div class="bc-grid">
   <label>${CH_GUIDE} Charm Guides<input id="chAvailG" type="number" min="0" value="0" oninput="calcCharmSummary()"></label>
   <label>${CH_DESIGN} Charm Designs<input id="chAvailD" type="number" min="0" value="0" oninput="calcCharmSummary()"></label>
   <label>${CH_SECRET} Jewel Secrets<input id="chAvailS" type="number" min="0" value="0" oninput="calcCharmSummary()"></label>
 </div></div>
 <div class="bc-section result"><h3><i class="bi bi-bar-chart-fill"></i> Total Materials Required</h3><div id="chTotalResult" class="result-grid"></div></div>
 <div class="bc-section result"><h3><i class="bi bi-exclamation-triangle-fill"></i> Still Needed (After Available)</h3><div id="chNeedResult" class="result-grid"></div></div>
 <div class="bc-section"><h3><i class="bi bi-diagram-3-fill"></i> By Troop Type</h3><div id="chByType" class="charm-slots"></div></div>
 <div class="bc-section"><h3><i class="bi bi-collection-fill"></i> Cost Database (per charm, per level)</h3><div class="table-scroll"><table class="db-table"><thead><tr><th>Level</th><th>${CH_GUIDE} Guides</th><th>${CH_DESIGN} Designs</th><th>${CH_SECRET} Secrets</th><th>Score</th></tr></thead><tbody>${WOS_DB.charmSteps.slice(1).map(v=>`<tr><td>${v.label}</td><td>${fmt(v.guides)}</td><td>${fmt(v.designs)}</td><td>${fmt(v.secrets)}</td><td>${fmt(v.score)}</td></tr>`).join('')}</tbody></table></div><div class="source-note">Cost per charm and level step from wostools.net/chief-charms-calculator (checked September 28, 2026). Score × 70 = SvS/KoI points. Jewel Secrets are only required for Lv.12–18. Lv.11 unlocks Material Exchange.</div></div>
 <div class="bc-section"><h3><i class="bi bi-lightbulb-fill"></i> Tips</h3><ul class="tip-list">
   <li><b>Save for events:</b> upgrade during King of Icefield, Officer Project, Armament Competition, or Alliance Mobilization.</li>
   <li><b>Jewel Secrets:</b> are only required for levels 12–18, with costs increasing rapidly (15 at Lv.12 up to 180 at Lv.18 per charm).</li>
   <li><b>Material Sources:</b> Frostfire Mine, Sunfire Castle Battle, Castle Battle, and the Giant Elk pet (Mystical Finding skill).</li>
   <li><b>Material Exchange:</b> upgrade one charm to Lv.11 to unlock charm material exchange.</li>
 </ul></div>`;
 b.dataset.built='1';
 syncCharmControls();
}
