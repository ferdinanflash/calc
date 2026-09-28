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
function charmLevelOpts(sel){
  return WOS_DB.charmSteps.map((s,i)=>`<option value="${i}" ${i===sel?'selected':''}>${s.label==='0'?'0 (belum ada)':s.label}</option>`).join('');
}
function charmMaxIdx(){return WOS_DB.charmSteps.length-1;}
function charmSetAllTarget(idx){ensureCharmVals();charmVals.forEach(v=>{v.t=Math.min(idx,charmMaxIdx());if(v.t<v.c)v.t=v.c;});renderCharmDB();}
function charmMatchCurrentToTarget(){ensureCharmVals();charmVals.forEach(v=>v.c=v.t);renderCharmDB();}
function charmResetAll(){charmVals=charmSlotList().map(()=>({c:0,t:0}));renderCharmDB();}

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
  const invG=Math.max(0,Number(document.getElementById('chAvailG')?.value)||0);
  const invD=Math.max(0,Number(document.getElementById('chAvailD')?.value)||0);
  const invS=Math.max(0,Number(document.getElementById('chAvailS')?.value)||0);
  const needG=Math.max(0,totals.guides-invG), needD=Math.max(0,totals.designs-invD), needS=Math.max(0,totals.secrets-invS);

  const req=document.getElementById('chTotalResult');
  if(req) req.innerHTML=[
    ['<i class="bi bi-book-fill"></i> Charm Guides',fmt(totals.guides)],
    ['<i class="bi bi-journal-text"></i> Charm Designs',fmt(totals.designs)],
    ['<i class="bi bi-gem"></i> Jewel Secrets',fmt(totals.secrets)],
    ['<i class="bi bi-arrow-up-circle-fill"></i> Upgrade Steps',fmt(totals.steps)],
    ['<i class="bi bi-trophy-fill"></i> SvS / KoI Points',fmt(points)]
  ].map(x=>`<div class="stat"><div class="n">${x[1]}</div><div class="l">${x[0]}</div></div>`).join('');

  const need=document.getElementById('chNeedResult');
  const allCovered=needG===0&&needD===0&&needS===0;
  if(need) need.innerHTML=[
    ['<i class="bi bi-book-fill"></i> Guides',needG],['<i class="bi bi-journal-text"></i> Designs',needD],['<i class="bi bi-gem"></i> Secrets',needS]
  ].map(x=>`<div class="stat ${x[1]===0?'ok':'warn'}"><div class="n">${fmt(x[1])}</div><div class="l">${x[0]}</div></div>`).join('')
   +`<div class="notice">${allCovered?'✅ Resource yang dimasukkan cukup untuk semua upgrade.':'⚠️ Masih kurang resource di atas untuk mencapai target.'}</div>`;

  const byTypeEl=document.getElementById('chByType');
  if(byTypeEl) byTypeEl.innerHTML=WOS_DB.troopTypes.map(t=>{
    const b=byType[t]; const pts=b.score*WOS_DB.charmRules.pointsPerScore;
    return `<div class="tree-item"><b>${t}</b><span>${fmt(b.guides)} Guides · ${fmt(b.designs)} Designs · ${fmt(b.secrets)} Secrets · ${fmt(pts)} pts</span></div>`;
  }).join('');
}

function renderCharmDB(){
 const m=document.getElementById('charmModal'); if(!m)return; const b=m.querySelector('.modal-box');
 ensureCharmVals();
 const slots=charmSlotList();
 const rowsByType=WOS_DB.troopTypes.map(type=>{
   const rows=slots.map((s,i)=>({s,i})).filter(x=>x.s.piece.type===type).map(({s,i})=>
     `<div class="charm-row"><span>${s.piece.name} #${s.n}</span>
      <select id="chCur${i}" onchange="charmVals[${i}].c=+this.value; if(charmVals[${i}].t<charmVals[${i}].c){charmVals[${i}].t=charmVals[${i}].c; document.getElementById('chTar${i}').value=charmVals[${i}].c;} calcCharmSummary();">${charmLevelOpts(charmVals[i].c)}</select>
      <span>→</span>
      <select id="chTar${i}" onchange="let v=+this.value; if(v<charmVals[${i}].c){v=charmVals[${i}].c; this.value=v;} charmVals[${i}].t=v; calcCharmSummary();">${charmLevelOpts(charmVals[i].t)}</select>
      </div>`).join('');
   return `<div class="bc-section"><h3><i class="bi bi-gem"></i> ${type}</h3><div class="research-list">${rows}</div></div>`;
 }).join('');

 b.innerHTML=`<button class="modal-close" onclick="closeModal('charmModal')">×</button><div class="modal-title"><i class="bi bi-gem"></i> Chief Charm</div><div class="modal-sub">18 slot charm independen — 3 charm per gear piece (Helmet+Watch = Lancer, Jacket+Pants = Infantry, Ring+Cane = Marksman). Level 1-18, sub-level mulai Lv.4. Chief Charm unlock di Furnace Lv.25; Lv.16 butuh state Gen 7.</div>
 <div class="bc-toolbar">
   <button class="mini-btn" onclick="charmSetAllTarget(32)">Set All Desired Lv.11</button>
   <button class="mini-btn" onclick="charmSetAllTarget(57)">Set All Desired Lv.16</button>
   <button class="mini-btn" onclick="charmSetAllTarget(${charmMaxIdx()})">Set All Desired Lv.18</button>
   <button class="mini-btn" onclick="charmMatchCurrentToTarget()">Tandai Semua Selesai</button>
   <button class="mini-btn" onclick="charmResetAll()">Reset All</button>
 </div>
 ${rowsByType}
 <div class="bc-section"><h3><i class="bi bi-bag-fill"></i> Available Resources</h3><div class="bc-grid">
   <label><i class="bi bi-book-fill"></i> Charm Guides<input id="chAvailG" type="number" min="0" value="0" oninput="calcCharmSummary()"></label>
   <label><i class="bi bi-journal-text"></i> Charm Designs<input id="chAvailD" type="number" min="0" value="0" oninput="calcCharmSummary()"></label>
   <label><i class="bi bi-gem"></i> Jewel Secrets<input id="chAvailS" type="number" min="0" value="0" oninput="calcCharmSummary()"></label>
 </div></div>
 <div class="bc-section result"><h3><i class="bi bi-bar-chart-fill"></i> Total Materials Required</h3><div id="chTotalResult" class="result-grid"></div></div>
 <div class="bc-section result"><h3><i class="bi bi-exclamation-triangle-fill"></i> Still Needed (After Available)</h3><div id="chNeedResult" class="result-grid"></div></div>
 <div class="bc-section"><h3><i class="bi bi-diagram-3-fill"></i> By Troop Type</h3><div id="chByType" class="charm-slots"></div></div>
 <div class="bc-section"><h3><i class="bi bi-collection-fill"></i> Cost Database (per charm, per level)</h3><div class="table-scroll"><table class="db-table"><thead><tr><th>Level</th><th>Guides</th><th>Designs</th><th>Secrets</th><th>Score</th></tr></thead><tbody>${WOS_DB.charmSteps.slice(1).map(v=>`<tr><td>${v.label}</td><td>${fmt(v.guides)}</td><td>${fmt(v.designs)}</td><td>${fmt(v.secrets)}</td><td>${fmt(v.score)}</td></tr>`).join('')}</tbody></table></div><div class="source-note">Biaya per langkah untuk 1 charm, dari wostools.net/chief-charms-calculator (dicek 2026-09-28). Score × 70 = poin SvS/KoI. Jewel Secrets hanya untuk Lv.12-18. Lv.11 membuka Material Exchange.</div></div>
 <div class="bc-section"><h3><i class="bi bi-lightbulb-fill"></i> Tips</h3><ul class="tip-list">
   <li><b>Save for events:</b> upgrade saat King of Icefield, Officer Project, Armament Competition, atau Alliance Mobilization.</li>
   <li><b>Jewel Secrets:</b> hanya diperlukan untuk level 12-18, jumlah naik cepat (15 di Lv.12 sampai 180 di Lv.18 per charm).</li>
   <li><b>Sumber material:</b> Frostfire Mine, Sunfire Castle Battle, Castle Battle, dan Giant Elk pet (skill Mystical Finding).</li>
   <li><b>Material Exchange:</b> upgrade satu charm ke Lv.11 untuk membuka tukar-menukar material charm.</li>
 </ul></div>`;
 calcCharmSummary();
}
