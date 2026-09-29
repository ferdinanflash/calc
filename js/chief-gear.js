// Chief Gear

// ---------- CHIEF GEAR ----------
// Level table (150 steps, Green 0★ -> Red T6 3★) lives in database.js (WOS_DB.chiefGear),
// mirroring https://wostools.net/chief-gear-calculator and /wiki/gear/chief-gear.
const CG_DEFAULT_TARGET=90; // Red T3 3★ (same default as wostools)
const cgMatImg=(k,nm)=>`<img class="mat-ic" src="images/chief-gear/${{alloy:'hardened-alloy',solution:'polishing-solution',plans:'design-plans',amber:'lunar-amber'}[k]}.webp" alt="${nm}" loading="lazy">`;
const CG_MATS=[['alloy',cgMatImg('alloy','Hardened Alloy'),'Hardened Alloy'],['solution',cgMatImg('solution','Polishing Solution'),'Polishing Sol.'],['plans',cgMatImg('plans','Design Plans'),'Design Plans'],['amber',cgMatImg('amber','Lunar Amber'),'Lunar Amber']];
const cgState={cur:[0,0,0,0,0,0],tar:Array(6).fill(CG_DEFAULT_TARGET),res:{alloy:0,solution:0,plans:0,amber:0},ex:Array(7).fill(0),valeria:0};

// Chief Gear piece artwork (inline SVG, tinted by quality tier)
const CG_TIER_COLORS={none:['#9ca3af','#4b5563','#e5e7eb'],green:['#4ade80','#166534','#bbf7d0'],blue:['#60a5fa','#1e3a8a','#bfdbfe'],purple:['#c084fc','#581c87','#e9d5ff'],gold:['#fbbf24','#854d0e','#fef3c7'],red:['#f87171','#7f1d1d','#fecaca']};
function cgTierKey(name){const m=/^(Green|Blue|Purple|Gold|Red)/.exec(name||'');return m?m[1].toLowerCase():'none';}
function cgSvg(id,tier){
 const [c,d,l]=CG_TIER_COLORS[tier]||CG_TIER_COLORS.none,s=`stroke="${d}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"`;
 const art={
  helmet:`<path d="M10 40C10 22 20 10 32 10s22 12 22 30v6H10z" fill="${c}" ${s}/><path d="M18 30h28v8H18z" fill="${d}" ${s}/><path d="M10 46l4 10h10l-3-10M54 46l-4 10H40l3-10" fill="${c}" ${s}/><path d="M32 10V4M27 6q5-6 10 0" fill="none" ${s}/><path d="M22 20q10-6 20 0" fill="none" stroke="${l}" stroke-width="2.5" stroke-linecap="round"/>`,
  watch:`<rect x="23" y="3" width="18" height="16" rx="3" fill="${d}" ${s}/><rect x="23" y="45" width="18" height="16" rx="3" fill="${d}" ${s}/><circle cx="32" cy="32" r="17" fill="${c}" ${s}/><circle cx="32" cy="32" r="12" fill="${l}" ${s}/><path d="M32 32v-8M32 32l6 4" fill="none" ${s}/><circle cx="32" cy="32" r="1.8" fill="${d}"/>`,
  jacket:`<path d="M22 8l10 7 10-7 16 8-4 16-8-4v30H18V28l-8 4-4-16z" fill="${c}" ${s}/><path d="M22 8l10 14 10-14" fill="${l}" ${s}/><path d="M32 22v36" fill="none" ${s}/><path d="M24 40h5M35 40h5" fill="none" ${s}/>`,
  pants:`<path d="M15 6h34l2 52H35l-3-30-3 30H13z" fill="${c}" ${s}/><path d="M15 6h34v9H15z" fill="${l}" ${s}/><path d="M32 15v13" fill="none" ${s}/><path d="M20 28h6M38 28h6" fill="none" ${s}/>`,
  ring:`<circle cx="32" cy="40" r="15" fill="none" stroke="${d}" stroke-width="10" stroke-linejoin="round"/><circle cx="32" cy="40" r="15" fill="none" stroke="${c}" stroke-width="6"/><path d="M24 16l8-11 8 11-8 9z" fill="${l}" ${s}/><path d="M24 16h16" fill="none" ${s}/>`,
  cane:`<path d="M20 60L36 20c2-6 6-9 12-9 6 0 9 4 9 9" fill="none" stroke="${d}" stroke-width="10" stroke-linecap="round"/><path d="M20 60L36 20c2-6 6-9 12-9 6 0 9 4 9 9" fill="none" stroke="${c}" stroke-width="5.5" stroke-linecap="round"/><circle cx="21" cy="58" r="3.5" fill="${l}" ${s}/><path d="M31 32l9 4" fill="none" ${s}/>`
 };
 return `<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${id} ${tier}">${art[id]||''}</svg>`;
}
function cgPrefix(){
 if(cgPrefix.cache)return cgPrefix.cache;
 const L=WOS_DB.chiefGear.levels,keys=['alloy','solution','plans','amber','svs'],p=[{alloy:0,solution:0,plans:0,amber:0,svs:0}];
 for(let i=1;i<L.length;i++){const q={};keys.forEach(k=>q[k]=p[i-1][k]+L[i][k]);p.push(q);}
 return cgPrefix.cache=p;
}
function cgCost(c,t){const p=cgPrefix(),o={};['alloy','solution','plans','amber','svs'].forEach(k=>o[k]=t>c?p[t][k]-p[c][k]:0);return o;}
// Push cgState into the existing controls (no DOM rebuild).
function syncGearControls(){
 const G=WOS_DB.chiefGear;
 for(let i=0;i<6;i++){const c=document.getElementById('cgCur'+i),t=document.getElementById('cgTar'+i);if(c)c.value=cgState.cur[i];if(t)t.value=cgState.tar[i];}
 CG_MATS.forEach(([k])=>{const e=document.getElementById('cgRes_'+k);if(e)e.value=cgState.res[k]||0;});
 G.exchange.forEach((_,i)=>{const e=document.getElementById('cgEx'+i);if(e)e.value=cgState.ex[i]||0;});
 const v=document.getElementById('cgValeria');if(v)v.value=cgState.valeria;
}
function renderGearDB(){
 const m=document.getElementById('chiefGearModal');if(!m)return;
 const b=m.querySelector('.modal-box'),G=WOS_DB.chiefGear,L=G.levels;
 if(b.dataset.built){syncGearControls();calcGearDB();return;} // already built: keep the DOM, just refresh
 const opts=(sel,ph)=>(ph?`<option value="">${ph}</option>`:'')+L.map((x,i)=>`<option value="${i}" ${i===sel?'selected':''}>${x.name}</option>`).join('');
 const maxRows=L.filter(x=>/^(Green 1★|Blue 3★|Purple 3★|Purple T1 3★|Gold 3★|Gold T1 3★|Gold T2 3★|Red 3★|Red T1 3★|Red T2 3★|Red T3 3★|Red T4 3★|Red T5 3★|Red T6 3★)$/.test(x.name));
 const exName={alloy:'Alloy',solution:'Solution',plans:'Plans',amber:'Amber'};
 b.innerHTML=`<button class="modal-close" onclick="closeModal('chiefGearModal')">×</button>
 <div class="modal-title"><i class="bi bi-shield-fill"></i> Chief Gear Calculator</div>
 <div class="modal-sub">Plan upgrades from Green to Red T6 ★★★: Hardened Alloy, Polishing Solution, Design Plans, Lunar Amber, power, deployment capacity, and SvS points.</div>
 <div class="notice"><i class="bi bi-info-circle-fill"></i> Chief Gear unlocks at Furnace Level 22. All six pieces use the same cost path; set the current &amp; target levels for each piece below.</div>
 <div class="bc-section"><h3><i class="bi bi-lightning-charge-fill"></i> Quick Select</h3><div class="placeholder-grid">
  <label>Set All Current<select id="cgQuickCur">${opts(-1,'Choose tier…')}</select></label>
  <label>Set All Target<select id="cgQuickTar">${opts(-1,'Choose tier…')}</select></label>
  <label>&nbsp;<button class="mini-btn" id="cgResetAll" type="button">Reset All</button></label>
 </div></div>
 <div class="bc-section"><h3><i class="bi bi-shield-fill"></i> Gear Pieces</h3>${G.pieces.map((p,i)=>`<div class="building-plan cg-piece"><div class="cg-img" id="cgImg${i}" title="Current"></div><div><div class="plan-selects">
  <label>${p.name} <small>(${p.type})</small><select id="cgCur${i}">${opts(cgState.cur[i])}</select></label><span class="arrow">→</span>
  <label>Target<select id="cgTar${i}">${opts(cgState.tar[i])}</select></label></div><div id="cgRow${i}" class="notice"></div></div><div class="cg-img" id="cgImgT${i}" title="Target"></div></div>`).join('')}</div>
 <div class="bc-section"><h3><i class="bi bi-bag-fill"></i> Available Resources</h3><div class="bc-grid">${CG_MATS.map(([k,ic,nm])=>`<label>${ic} ${nm}<input id="cgRes_${k}" type="number" min="0" value="${cgState.res[k]||0}"></label>`).join('')}</div></div>
 <div class="bc-section"><h3><i class="bi bi-arrow-repeat"></i> Enhancement Material Exchange</h3><div id="cgExNote" class="notice"></div><div class="bc-grid">${G.exchange.map((e,i)=>`<label>${cgMatImg(e[0],exName[e[0]])} ${exName[e[0]]} » ${cgMatImg(e[1],exName[e[1]])} ${exName[e[1]]} <small>(${e[2]}:${e[3]} · limit ${fmt(e[4])}/week)</small><input id="cgEx${i}" type="number" min="0" value="${cgState.ex[i]||0}" placeholder="amount of ${exName[e[0]]} to exchange"></label>`).join('')}</div>
  <div class="source-note">Enter the amount of source material to exchange; the result is added to Available Resources. The weekly limit is shown according to WoSTools but is not enforced here.</div></div>
 <div class="bc-section result"><h3><i class="bi bi-bar-chart-fill"></i> Total Summary</h3><div id="cgSummary"></div>
  <h4>Total Gains</h4>
  <div class="bc-grid"><label>Valeria — Well Prepared (+2%/lvl SvS pts)<select id="cgValeria">${Array.from({length:11},(_,i)=>`<option value="${i}" ${i===cgState.valeria?'selected':''}>Lv ${i}</option>`).join('')}</select></label></div>
  <div id="cgGains" class="result-grid"></div></div>
 <div class="bc-section"><h3><i class="bi bi-bullseye"></i> Upgrade Efficiency Advisor</h3><div id="cgAdvisor"></div></div>
 <div class="bc-section"><h3><i class="bi bi-graph-up-arrow"></i> Tier Comparison (per piece, max stars)</h3><div class="table-scroll"><table class="db-table"><thead><tr><th>Tier</th><th>Stat Bonus</th><th>Power</th><th>Deploy Cap.</th></tr></thead><tbody>${maxRows.map(x=>`<tr><td>${x.name}</td><td>+${x.stat.toFixed(2)}%</td><td>${fmt(x.power)}</td><td>${x.deploy?'+'+fmt(x.deploy):'—'}</td></tr>`).join('')}</tbody></table></div></div>
 <div class="bc-section"><details><summary><b><i class="bi bi-collection-fill"></i> Full Cost Database (150 steps per piece)</b></summary><div class="table-scroll"><table class="db-table"><thead><tr><th>Step</th><th>Alloy</th><th>Solution</th><th>Plans</th><th>Amber</th><th>Score</th><th>Power</th><th>Stat</th><th>Deploy</th></tr></thead><tbody>${L.slice(1).map(x=>`<tr><td>${x.name}</td><td>${fmt(x.alloy)}</td><td>${fmt(x.solution)}</td><td>${fmt(x.plans)}</td><td>${fmt(x.amber)}</td><td>${fmt(x.svs)}</td><td>${fmt(x.power)}</td><td>+${x.stat.toFixed(2)}%</td><td>${x.deploy?fmt(x.deploy):'—'}</td></tr>`).join('')}</tbody></table></div></details></div>
 <div class="notice"><i class="bi bi-lightbulb-fill"></i> Tips: keep all six pieces at the same tier for set bonuses (3 pieces = Defense, 6 pieces = Attack). Save upgrades for SvS Prep Day 5 / KoI to maximize points. Hardened Alloy comes from Polar Terror (Lv.3+) &amp; Beast (Lv.22+); Polishing Solution comes from Crazy Joe &amp; Alliance Championship Shop; Design Plans are required starting at Blue 2★; Lunar Amber is only used for Red tiers.</div>
 <div class="source-note">Cost, power, stat &amp; deployment data: wostools.net/wiki/gear/chief-gear (checked September 28, 2026). SvS points = Chief Gear Score × ${G.svsPerScore}. WoSTools features such as Upgrade Suggestions, Alliance Showdown &amp; CSV/Excel export are not included here.</div>`;
 for(let i=0;i<6;i++){
  document.getElementById('cgCur'+i).addEventListener('change',e=>{cgState.cur[i]=+e.target.value;calcGearDB();});
  document.getElementById('cgTar'+i).addEventListener('change',e=>{cgState.tar[i]=+e.target.value;calcGearDB();});
 }
 document.getElementById('cgQuickCur').addEventListener('change',e=>{if(e.target.value==='')return;cgState.cur.fill(+e.target.value);syncGearControls();e.target.value='';calcGearDB();});
 document.getElementById('cgQuickTar').addEventListener('change',e=>{if(e.target.value==='')return;cgState.tar.fill(+e.target.value);syncGearControls();e.target.value='';calcGearDB();});
 document.getElementById('cgResetAll').addEventListener('click',()=>{cgState.cur.fill(0);cgState.tar.fill(CG_DEFAULT_TARGET);cgState.res={alloy:0,solution:0,plans:0,amber:0};cgState.ex.fill(0);cgState.valeria=0;syncGearControls();calcGearDB();});
 CG_MATS.forEach(([k])=>document.getElementById('cgRes_'+k).addEventListener('input',calcGearDB));
 G.exchange.forEach((_,i)=>document.getElementById('cgEx'+i).addEventListener('input',calcGearDB));
 document.getElementById('cgValeria').addEventListener('change',e=>{cgState.valeria=+e.target.value;calcGearDB();});
 b.dataset.built='1';
 calcGearDB();
}
function calcGearDB(){
 const G=WOS_DB.chiefGear,L=G.levels,pieces=G.pieces;
 CG_MATS.forEach(([k])=>cgState.res[k]=valNum('cgRes_'+k));
 G.exchange.forEach((_,i)=>cgState.ex[i]=Math.floor(valNum('cgEx'+i)));
 const valeria=cgState.valeria,svsMult=1+0.02*valeria;
 const tot={alloy:0,solution:0,plans:0,amber:0,svs:0},byType={};let power=0,deploy=0,statFrom=0,statTo=0;
 pieces.forEach((p,i)=>{
  const c=cgState.cur[i],t=cgState.tar[i],ok=t>=c,eff=ok?t:c,cost=cgCost(c,eff);
  Object.keys(tot).forEach(k=>tot[k]+=cost[k]);
  const bt=byType[p.type]||(byType[p.type]={alloy:0,solution:0,plans:0,amber:0,svs:0});Object.keys(bt).forEach(k=>bt[k]+=cost[k]);
  power+=L[eff].power-L[c].power;deploy+=L[eff].deploy-L[c].deploy;statFrom+=L[c].stat;statTo+=L[eff].stat;
  const im=document.getElementById('cgImg'+i),imT=document.getElementById('cgImgT'+i);
  if(im)im.innerHTML=cgSvg(p.id,cgTierKey(L[c].name));if(imT)imT.innerHTML=cgSvg(p.id,cgTierKey(L[eff].name));
  const row=document.getElementById('cgRow'+i);
  if(row)row.innerHTML=ok?`<i class="bi bi-graph-up-arrow"></i> +${(L[eff].stat-L[c].stat).toFixed(2)}% · <i class="bi bi-lightning-charge-fill"></i> +${fmt(L[eff].power-L[c].power)}${L[eff].deploy-L[c].deploy?' · <i class="bi bi-people"></i> +'+fmt(L[eff].deploy-L[c].deploy):''}`:'<i class="bi bi-exclamation-triangle-fill"></i> Target is lower than the current level — this piece will be skipped.';
 });
 // Enhancement Material Exchange (unlocks once any piece is at Gold T2 3★ or higher)
 const unlocked=cgState.cur.some(c=>c>=G.exchangeUnlockLevel);
 const avail=Object.assign({},cgState.res);
 if(unlocked)G.exchange.forEach((e,i)=>{const spent=cgState.ex[i];if(!spent)return;avail[e[0]]-=spent;avail[e[1]]+=Math.floor(spent/e[2])*e[3];});
 const exNote=document.getElementById('cgExNote');
 if(exNote)exNote.innerHTML=unlocked?'<i class="bi bi-check-circle-fill"></i> Exchange unlocked (at least one piece is Gold T2 3★ or higher).':'<i class="bi bi-lock-fill"></i> Not unlocked yet — upgrade one piece to Gold T2 3★ (current) to unlock Enhancement Material Exchange. The exchange rates below are not yet applicable.';
 const need=CG_MATS.map(([k,ic,nm])=>statCard(fmt(tot[k]),`${ic} ${nm}`)).join('');
 const gap=CG_MATS.map(([k,ic,nm])=>{const left=Math.max(0,tot[k]-avail[k]);return statCard(fmt(left),`${ic} ${nm}${avail[k]>0?' · available '+fmt(avail[k]):''}`,left===0?'ok':'warn');}).join('');
 const types=Object.entries(byType).map(([tp,v])=>`<h4>${tp}</h4><div class="result-grid">${CG_MATS.map(([k,ic,nm])=>statCard(fmt(v[k]),`${ic} ${nm}`)).join('')}${statCard(fmt(v.svs*G.svsPerScore*svsMult),'<i class="bi bi-trophy-fill"></i> SvS')}</div>`).join('');
 const svsPts=tot.svs*G.svsPerScore*svsMult;
 const el=document.getElementById('cgSummary');
 if(el)el.innerHTML=`<h4>Total Materials Required</h4><div class="result-grid">${need}</div>
  <h4>Still Needed (After Available Resources)</h4><div class="result-grid">${gap}</div>
  <h4>By Troop Type</h4>${types}`;
 const gains=document.getElementById('cgGains');
 if(gains)gains.innerHTML=statCard('+'+fmt(power),'<i class="bi bi-lightning-charge-fill"></i> Power Gain')+statCard(fmt(svsPts),'<i class="bi bi-trophy-fill"></i> SvS/KoI Points')+statCard(`+${statFrom.toFixed(2)}% → +${statTo.toFixed(2)}%`,`<i class="bi bi-graph-up-arrow"></i> Stat Bonus (+${(statTo-statFrom).toFixed(2)}%)`)+statCard('+'+fmt(deploy),'<i class="bi bi-people"></i> Deploy Capacity');
 // Efficiency advisor: power per material for each piece's next step
 const adv=pieces.map((p,i)=>{const c=cgState.cur[i];if(c>=cgState.tar[i]||c>=L.length-1)return null;const n=L[c+1],mats=n.alloy+n.solution+n.plans+n.amber,gain=n.power-L[c].power;return{p,next:n.name,gain,ratio:mats?gain/mats:0};}).filter(Boolean).sort((a,b)=>b.ratio-a.ratio);
 const ad=document.getElementById('cgAdvisor');
 if(ad)ad.innerHTML=adv.length?`<div class="notice">Pieces providing the most power per material for the next upgrade step:</div><div class="result-grid">${adv.map((a,i)=>statCard(`+${fmt(a.gain)} <i class="bi bi-lightning-charge-fill"></i>`,`#${i+1} ${a.p.name} (${a.p.type}) → ${a.next} · ${a.ratio.toFixed(1)} pwr/mat`)).join('')}</div>`:'<div class="notice">All pieces have reached their targets.</div>';
}
