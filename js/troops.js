// Training / Promotion Troops Calculator

// Event points / power per troop. Training = full target-tier value. Promotion = difference
// between target and source tier (wostools.net/wiki/troops: "Promotion awards the difference
// between tiers", e.g. T10->T11 SvS = 75 - 60 = 15). Power for promotion uses the same difference
// (the source troop's power is already counted).
function troopPointsPer(mode,fromKey,targetKey){
 const t=WOS_DB.troops[targetKey], f=WOS_DB.troops[fromKey];
 const d=(k)=>mode==='promote'&&f?Math.max(0,t[k]-f[k]):t[k];
 return {svs:d('svs'),hoc:d('hoc'),koi:d('koi'),power:d('power'),as:d('as')};
}
function tierOpts(selected){return Object.keys(WOS_DB.troops).map(t=>`<option value="${t}" ${t===selected?'selected':''}>${t}</option>`).join('');}
function renderTroopDB(){
 const m=document.getElementById('troopsModal'); if(!m)return;
 const b=m.querySelector('.modal-box');
 if(b.dataset.built){calcTroopDB();return;} // already built: keep typed values, just recalculate
 const tiers=Object.keys(WOS_DB.troops), lastTier=tiers[tiers.length-1], prevTier=tiers[tiers.length-2]||tiers[0];
 b.innerHTML=`<button class="modal-close" onclick="closeModal('troopsModal')">×</button>
 <div class="modal-title"><i class="bi bi-people-fill"></i> Training Troops Calculator</div><div class="modal-sub">Training &amp; promotion for Infantry, Lancer, and Marksman — T1–T12, speed bonuses, resource gaps, and event points.</div>
 <div class="bc-section"><div class="placeholder-grid">
 <label>Troop Type<select id="dbTroopType"><option>Infantry</option><option>Lancer</option><option>Marksman</option></select></label>
 <label>Mode<select id="dbTroopMode"><option value="train">Training</option><option value="promote">Promotion</option></select></label>
 <label id="dbTroopFromWrap" class="hidden">From Tier (Current)<select id="dbTroopFrom">${tierOpts(prevTier)}</select></label>
 <label>Target Tier<select id="dbTroopTier">${tierOpts(lastTier)}</select></label>
 <label>Quantity<input id="dbTroopQty" type="number" min="0" value="100000"></label>
 <label>Speed Bonus % <input id="dbTroopSpeed" type="number" min="0" value="0"></label>
 <label>Training Queues (parallel)<input id="dbTroopQueues" type="number" min="1" value="1"></label>
 <label class="checkline"><input id="dbTroopAdvanced" type="checkbox"> Advanced Training (-20% time, flat)</label>
 </div></div>
 <div class="notice"><i class="bi bi-info-circle-fill"></i> Meat/Wood/Coal/Iron costs are the same for Infantry, Lancer &amp; Marksman at the same tier (only combat statistics differ), so the Troop Type selector above does not change the cost values.</div>
 <div id="dbTroopWarn" class="notice hidden"><i class="bi bi-exclamation-triangle-fill"></i> For Promotion mode, From Tier must be lower than Target Tier. Adjust the tier selection to see the results.</div>
 <div class="bc-section">
   <h3><i class="bi bi-bag-fill"></i> Available Resources</h3>
   <div class="bc-grid">
     <label><i class="bi bi-egg-fried"></i> Meat<input id="dbTroopMeat" type="number" min="0" value="0"></label>
     <label><i class="bi bi-tree-fill"></i> Wood<input id="dbTroopWood" type="number" min="0" value="0"></label>
     <label><i class="bi bi-hexagon-fill"></i> Coal<input id="dbTroopCoal" type="number" min="0" value="0"></label>
     <label><i class="bi bi-link-45deg"></i> Iron<input id="dbTroopIron" type="number" min="0" value="0"></label>
   </div>
 </div>
 <div class="bc-section result"><h3><i class="bi bi-bar-chart-fill"></i> Calculation</h3><div id="dbTroopResult" class="result-grid"></div></div>
 <div class="bc-section"><h3><i class="bi bi-collection-fill"></i> Database T1–T12</h3><div class="table-scroll"><table class="db-table"><thead><tr><th>Tier</th><th>Meat</th><th>Wood</th><th>Coal</th><th>Iron</th><th>Time</th><th>Power</th><th>HoC</th><th>SvS</th><th>KoI</th></tr></thead><tbody>${Object.entries(WOS_DB.troops).map(([t,v])=>`<tr><td>${t}</td><td>${fmt(v.meat)}</td><td>${fmt(v.wood)}</td><td>${fmt(v.coal)}</td><td>${fmt(v.iron)}</td><td>${secondsText(v.seconds)}</td><td>${fmt(v.power)}</td><td>${fmt(v.hoc)}</td><td>${fmt(v.svs)}</td><td>${fmt(v.koi)}</td></tr>`).join('')}</tbody></table></div></div>
 <div class="source-note">Training uses the full cost and points of the target tier. Promotion uses the difference in cost, time, and event points (Target − From) according to wostools.net/wiki/troops. Base tier data was verified on September 28, 2026; Promotion differences outside T11→T12 are calculated from the cost table differences.</div>`;
 const modeSel=document.getElementById('dbTroopMode');
 const toggleFrom=()=>{ document.getElementById('dbTroopFromWrap')?.classList.toggle('hidden', modeSel.value!=='promote'); };
 modeSel.addEventListener('change',()=>{toggleFrom();calcTroopDB();});
 toggleFrom();
 b.dataset.built='1';
 ['dbTroopTier','dbTroopFrom','dbTroopQty','dbTroopSpeed','dbTroopQueues','dbTroopAdvanced','dbTroopMeat','dbTroopWood','dbTroopCoal','dbTroopIron'].forEach(id=>document.getElementById(id)?.addEventListener('input',calcTroopDB));
 calcTroopDB();
}
function calcTroopDB(){
 const tiers=Object.keys(WOS_DB.troops);
 const targetKey=document.getElementById('dbTroopTier')?.value||tiers[0];
 const fromKey=document.getElementById('dbTroopFrom')?.value||tiers[0];
 const qty=valNum('dbTroopQty'), speed=valNum('dbTroopSpeed'), queues=Math.max(1,valNum('dbTroopQueues'));
 const advanced=document.getElementById('dbTroopAdvanced')?.checked;
 const mode=document.getElementById('dbTroopMode')?.value||'train';
 const target=WOS_DB.troops[targetKey], from=WOS_DB.troops[fromKey];

 const invalidPromote = mode==='promote' && tiers.indexOf(fromKey)>=tiers.indexOf(targetKey);
 document.getElementById('dbTroopWarn')?.classList.toggle('hidden', !invalidPromote);

 let meatPer,woodPer,coalPer,ironPer,secPer;
 if(invalidPromote){
   meatPer=woodPer=coalPer=ironPer=secPer=0;
 } else if(mode==='promote'){
   meatPer=Math.max(0,target.meat-from.meat);
   woodPer=Math.max(0,target.wood-from.wood);
   coalPer=Math.max(0,target.coal-from.coal);
   ironPer=Math.max(0,target.iron-from.iron);
   secPer=Math.max(0,target.seconds-from.seconds);
 } else {
   meatPer=target.meat; woodPer=target.wood; coalPer=target.coal; ironPer=target.iron; secPer=target.seconds;
 }

 const meat=meatPer*qty, wood=woodPer*qty, coal=coalPer*qty, iron=ironPer*qty;
 let time=secPer*qty/(1+speed/100);
 if(advanced) time*=0.8;
 time/=queues;

 // Event points: Training = full target-tier value; Promotion = target minus From tier.
 const per=invalidPromote?{svs:0,hoc:0,koi:0,power:0}:troopPointsPer(mode,fromKey,targetKey);
 const svsPts=per.svs*qty, hocPts=per.hoc*qty, koiPts=per.koi*qty, powerPts=per.power*qty;

 const avail={meat:valNum('dbTroopMeat'),wood:valNum('dbTroopWood'),coal:valNum('dbTroopCoal'),iron:valNum('dbTroopIron')};
 const need={meat,wood,coal,iron};
 const icons={meat:'<i class="bi bi-egg-fried"></i> Meat',wood:'<i class="bi bi-tree-fill"></i> Wood',coal:'<i class="bi bi-hexagon-fill"></i> Coal',iron:'<i class="bi bi-link-45deg"></i> Iron'};
 const resCards=Object.keys(need).map(k=>{
   const ok=avail[k]>=need[k];
   return statCard(fmt(need[k]),`${icons[k]}${avail[k]?' · available '+fmt(avail[k]):''}`,ok?'ok':'warn');
 }).join('');
 const otherCards=[['<i class="bi bi-stopwatch-fill"></i> Time',secondsText(time)],['<i class="bi bi-lightning-charge-fill"></i> Power',fmt(powerPts)],['<i class="bi bi-trophy-fill"></i> SvS',fmt(svsPts)],['<i class="bi bi-bank"></i> HoC',fmt(hocPts)],['<i class="bi bi-snow"></i> KoI',fmt(koiPts)]]
   .map(x=>statCard(x[1],x[0])).join('');

 const el=document.getElementById('dbTroopResult'); if(el)el.innerHTML=resCards+otherCards;
}
