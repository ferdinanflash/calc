// Training / Promotion Troops Calculator

function tierOpts(selected){return Object.keys(WOS_DB.troops).map(t=>`<option value="${t}" ${t===selected?'selected':''}>${t}</option>`).join('');}
function renderTroopDB(){
 const m=document.getElementById('troopsModal'); if(!m)return;
 const b=m.querySelector('.modal-box');
 const tiers=Object.keys(WOS_DB.troops), lastTier=tiers[tiers.length-1], prevTier=tiers[tiers.length-2]||tiers[0];
 b.innerHTML=`<button class="modal-close" onclick="closeModal('troopsModal')">×</button>
 <div class="modal-title"><i class="bi bi-people-fill"></i> Training Troops Calculator</div><div class="modal-sub">Training &amp; promotion untuk Infantry, Lancer, dan Marksman — T1–T12, speed bonus, resource gap dan event points.</div>
 <div class="bc-section"><div class="placeholder-grid">
 <label>Troop Type<select id="dbTroopType"><option>Infantry</option><option>Lancer</option><option>Marksman</option></select></label>
 <label>Mode<select id="dbTroopMode"><option value="train">Training</option><option value="promote">Promotion</option></select></label>
 <label id="dbTroopFromWrap" class="hidden">From Tier (saat ini)<select id="dbTroopFrom">${tierOpts(prevTier)}</select></label>
 <label>Target Tier<select id="dbTroopTier">${tierOpts(lastTier)}</select></label>
 <label>Quantity<input id="dbTroopQty" type="number" min="0" value="100000"></label>
 <label>Speed Bonus % <input id="dbTroopSpeed" type="number" min="0" value="0"></label>
 <label>Training Queues (paralel)<input id="dbTroopQueues" type="number" min="1" value="1"></label>
 <label class="checkline"><input id="dbTroopAdvanced" type="checkbox"> Advanced Training (-20% waktu, flat)</label>
 </div></div>
 <div class="notice"><i class="bi bi-info-circle-fill"></i> Biaya Meat/Wood/Coal/Iron sama untuk Infantry, Lancer &amp; Marksman pada tier yang sama (hanya statistik tempur yang berbeda), jadi selector Troop Type di atas tidak mengubah angka biaya.</div>
 <div id="dbTroopWarn" class="notice hidden"><i class="bi bi-exclamation-triangle-fill"></i> Untuk mode Promotion, From Tier harus lebih rendah dari Target Tier. Perbaiki pilihan tier untuk melihat hasil.</div>
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
 <div class="source-note">Training memakai biaya penuh tier target. Promotion memakai selisih biaya (Target − From) per referensi wostools.net/troop-training-calculator, tapi tetap mendapat poin event (SvS/HoC/KoI/Power) senilai tier target penuh. Data dasar per tier diverifikasi 2026-09-28; selisih Promotion di luar T11→T12 adalah estimasi dari selisih tabel biaya karena WoSTools belum mempublikasikan tabel promotion terpisah untuk setiap tier.</div>`;
 const modeSel=document.getElementById('dbTroopMode');
 const toggleFrom=()=>{ document.getElementById('dbTroopFromWrap')?.classList.toggle('hidden', modeSel.value!=='promote'); };
 modeSel.addEventListener('change',()=>{toggleFrom();calcTroopDB();});
 toggleFrom();
 ['dbTroopTier','dbTroopFrom','dbTroopQty','dbTroopSpeed','dbTroopQueues','dbTroopAdvanced','dbTroopMeat','dbTroopWood','dbTroopCoal','dbTroopIron'].forEach(id=>document.getElementById(id)?.addEventListener('input',calcTroopDB));
 calcTroopDB();
}
function calcTroopDB(){
 const tiers=Object.keys(WOS_DB.troops);
 const targetKey=document.getElementById('dbTroopTier')?.value||tiers[0];
 const fromKey=document.getElementById('dbTroopFrom')?.value||tiers[0];
 const qty=Math.max(0,Number(document.getElementById('dbTroopQty')?.value)||0);
 const speed=Math.max(0,Number(document.getElementById('dbTroopSpeed')?.value)||0);
 const queues=Math.max(1,Number(document.getElementById('dbTroopQueues')?.value)||1);
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

 // Event points always use the target tier's full value for both Training and
 // Promotion — matching wostools.net's own note that promotion "uses the same
 // resources [i.e. a smaller amount] but takes the target tier's point value".
 const zero = invalidPromote?0:1;
 const svsPts=target.svs*qty*zero, hocPts=target.hoc*qty*zero, koiPts=target.koi*qty*zero, powerPts=target.power*qty*zero;

 const avail={meat:Math.max(0,Number(document.getElementById('dbTroopMeat')?.value)||0),wood:Math.max(0,Number(document.getElementById('dbTroopWood')?.value)||0),coal:Math.max(0,Number(document.getElementById('dbTroopCoal')?.value)||0),iron:Math.max(0,Number(document.getElementById('dbTroopIron')?.value)||0)};
 const need={meat,wood,coal,iron};
 const icons={meat:'<i class="bi bi-egg-fried"></i> Meat',wood:'<i class="bi bi-tree-fill"></i> Wood',coal:'<i class="bi bi-hexagon-fill"></i> Coal',iron:'<i class="bi bi-link-45deg"></i> Iron'};
 const resCards=Object.keys(need).map(k=>{
   const ok=avail[k]>=need[k];
   return `<div class="stat ${ok?'ok':'warn'}"><div class="n">${fmt(need[k])}</div><div class="l">${icons[k]}${avail[k]?' · tersedia '+fmt(avail[k]):''}</div></div>`;
 }).join('');
 const otherCards=[['<i class="bi bi-stopwatch-fill"></i> Time',secondsText(time)],['<i class="bi bi-lightning-charge-fill"></i> Power',fmt(powerPts)],['<i class="bi bi-trophy-fill"></i> SvS',fmt(svsPts)],['<i class="bi bi-bank"></i> HoC',fmt(hocPts)],['<i class="bi bi-snow"></i> KoI',fmt(koiPts)]]
   .map(x=>`<div class="stat"><div class="n">${x[1]}</div><div class="l">${x[0]}</div></div>`).join('');

 const el=document.getElementById('dbTroopResult'); if(el)el.innerHTML=resCards+otherCards;
}
