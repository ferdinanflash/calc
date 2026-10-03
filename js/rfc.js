// RFC Simulator: Fire Crystal -> Refined Fire Crystal (Crystal Laboratory "Super Refinement")
//
// Data cross-checked (2026-10-04) against:
//  - https://wostools.net/rfc-simulator                          (reference for this feature)
//  - https://www.whiteoutsurvival.wiki/refinement-in-crystal-laboratory/  (full probability tables, T4/T5 up to 12 RFC)
//  - https://wos.h5joy-games.com/guides/cf-refinement/           (costs, expected RFC, weekly plans; updated 2026-03-30)
//  - https://heaven-guardian.com/whiteout-survival-fire-crystal-guide/ (50% off = FIRST Super Refinement each day)
// Costs, probabilities and expected values agree across all sources. WoSTools only prints "6+" for
// T4/T5; the full outcome tables below come from the Whiteout Survival Wiki (they sum to 100% and
// reproduce WoSTools' expected values 3.44 and 3.71 exactly).
// Item shape: out = [[rfcAmount, probabilityPercent], ...]
const RFC_TIERS=[
 {cost:20, out:[[1,65],[2,25],[3,10]]},
 {cost:50, out:[[2,85],[3,15]]},
 {cost:100,out:[[3,85],[4,12.5],[5,2],[6,0.5]]},
 {cost:130,out:[[3,75],[4,15],[5,5],[6,3],[7,1],[8,0.5],[9,0.5]]},
 {cost:160,out:[[3,70],[4,12],[5,9],[6,4],[7,1.5],[8,1],[9,1],[10,0.5],[11,0.5],[12,0.5]]}
];
const RFC_WEEK_MAX=100, RFC_PER_TIER=20, RFC_PRESETS=[7,20,26,40,46,60,66,80,86,100];
RFC_TIERS.forEach(t=>{
 t.ev=t.out.reduce((s,o)=>s+o[0]*o[1]/100,0);
 t.var=t.out.reduce((s,o)=>s+o[0]*o[0]*o[1]/100,0)-t.ev*t.ev;
});

const rfcTierIdx=n=>Math.min(RFC_TIERS.length-1,Math.floor(n/RFC_PER_TIER));
const rfcNum=(n,d)=>Number(n).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});
const rfcFcIcon='<img class="res-ic" src="images/resources/fire-crystal.webp" alt="FC">';
const rfcRfcIcon='<img class="res-ic" src="images/resources/refined-fire-crystal.webp" alt="RFC">';
function rfcRoll(t){
 const out=RFC_TIERS[t].out; let r=Math.random()*100,a=0;
 for(const o of out){a+=o[1];if(r<a)return o[0];}
 return out[out.length-1][0];
}

// ---------- Weekly plan maths ----------
// days = conversions per day (7 entries). The first conversion of each day costs 50%.
function rfcPlan(days){
 let pos=0,fc=0,ev=0,vr=0;const perDay=[],used=[];
 days.forEach(k=>{
  let dfc=0,u=0;
  for(let i=0;i<k&&pos<RFC_WEEK_MAX;i++,pos++,u++){
   const T=RFC_TIERS[rfcTierIdx(pos)];
   dfc+=T.cost*(i===0?0.5:1);ev+=T.ev;vr+=T.var;
  }
  fc+=dfc;perDay.push(dfc);used.push(u);
 });
 return {n:pos,fc,ev,sd:Math.sqrt(vr),perDay,used};
}
// Cheapest split for N conversions: every one of the 7 daily discounts gets used, and the
// discounts of Days 2-7 land on the LAST (most expensive) conversions -> Day 1 = N-6, then 1/day.
function rfcAutoDays(n){
 n=Math.max(0,Math.min(RFC_WEEK_MAX,parseInt(n)||0));
 return n<7?Array.from({length:7},(_,i)=>i<n?1:0):[n-6,1,1,1,1,1,1];
}
let rfcDays=rfcAutoDays(20);

function rfcSetPlanN(v){
 rfcDays=rfcAutoDays(v);
 const n=document.getElementById('rfcPlanN'),sum=rfcDays.reduce((a,b)=>a+b,0); if(n&&Number(n.value)!==sum)n.value=sum;
 rfcDays.forEach((k,i)=>{const e=document.getElementById('rfcDay'+i);if(e)e.value=k;});
 rfcPlanResult();
}
function rfcSetDay(i,v){
 const others=rfcDays.reduce((a,b,j)=>a+(j===i?0:b),0);
 v=Math.max(0,Math.min(RFC_WEEK_MAX-others,parseInt(v)||0));
 rfcDays[i]=v;
 const e=document.getElementById('rfcDay'+i); if(e&&Number(e.value)!==v)e.value=v;
 const n=document.getElementById('rfcPlanN'); if(n)n.value=others+v;
 rfcPlanResult();
}
function rfcPlanResult(){
 const out=document.getElementById('rfcPlanResult'); if(!out)return;
 const p=rfcPlan(rfcDays);
 p.perDay.forEach((c,i)=>{const e=document.getElementById('rfcDayFc'+i);if(e)e.textContent=p.used[i]?fmt(c)+' FC':'-';});
 const auto=rfcPlan(rfcAutoDays(p.n)), save=p.fc-auto.fc;
 out.innerHTML=
  statCard(rfcRfcIcon+' '+rfcNum(p.ev,1),'Expected RFC')+
  statCard(rfcFcIcon+' '+fmt(p.fc),'FC cost')+
  statCard(p.ev?rfcNum(p.fc/p.ev,2):'-','FC per RFC')+
  statCard(p.n?rfcNum(Math.max(0,p.ev-p.sd),0)+' - '+rfcNum(p.ev+p.sd,0):'-','Typical range (±1σ)');
 const note=document.getElementById('rfcPlanNote');
 if(note)note.innerHTML=p.n?`${p.n} conversions, reaching Tier ${rfcTierIdx(p.n-1)+1}. `+(save>0.5?`<b>Cheaper split available:</b> Day 1 = ${rfcAutoDays(p.n)[0]}, then 1/day costs ${fmt(auto.fc)} FC (saves ${fmt(save)} FC).`:'This split is already the lowest-cost one.'):'Enter conversions to plan.';
}
function rfcRenderPlan(){
 const el=document.getElementById('rfcPlan'); if(!el)return;
 el.innerHTML=`<div class="bc-grid"><label>Conversions per week (max ${RFC_WEEK_MAX})<input id="rfcPlanN" type="number" min="0" max="${RFC_WEEK_MAX}" value="${rfcDays.reduce((a,b)=>a+b,0)}" oninput="rfcSetPlanN(this.value)"></label></div>
 <div class="rfc-chips">${RFC_PRESETS.map(n=>`<button class="mini-btn" onclick="rfcSetPlanN(${n})">${n}</button>`).join('')}</div>
 <div class="rfc-days">${rfcDays.map((k,i)=>`<div class="rfc-day"><small>Day ${i+1}</small><input id="rfcDay${i}" type="number" min="0" max="${RFC_WEEK_MAX}" value="${k}" oninput="rfcSetDay(${i},this.value)"><span id="rfcDayFc${i}"></span></div>`).join('')}</div>
 <div id="rfcPlanResult" class="result-grid"></div><div class="rfc-note" id="rfcPlanNote"></div>`;
 rfcPlanResult();
}
function rfcRenderStatic(){
 const ov=document.getElementById('rfcOverview');
 if(ov)ov.innerHTML=`<div class="table-scroll"><table class="db-table"><thead><tr><th>Tier</th><th>Conversions</th><th>FC cost</th><th>RFC outcomes</th><th>Expected RFC</th><th>FC / RFC</th></tr></thead><tbody>${RFC_TIERS.map((T,i)=>`<tr><td>Tier ${i+1}</td><td>${i*20+1}–${i*20+20}</td><td>${T.cost}</td><td class="rfc-out">${T.out.map(o=>`${o[0]} (${o[1]}%)`).join(', ')}</td><td>${rfcNum(T.ev,2)}</td><td>${rfcNum(T.cost/T.ev,1)}</td></tr>`).join('')}</tbody></table></div>`;
 const cmp=document.getElementById('rfcCompare');
 if(cmp)cmp.innerHTML=`<div class="table-scroll"><table class="db-table"><thead><tr><th>Conversions/week</th><th>Schedule</th><th>FC cost</th><th>Expected RFC</th><th>FC / RFC</th></tr></thead><tbody>${RFC_PRESETS.map(n=>{const d=rfcAutoDays(n),p=rfcPlan(d);return `<tr class="rfc-clickable" onclick="rfcSetPlanN(${n})"><td>${n}</td><td>${n<=7?'1/day':d[0]+' on Day 1, then 1/day'}</td><td>${fmt(p.fc)}</td><td>${rfcNum(p.ev,1)}</td><td>${rfcNum(p.fc/p.ev,2)}</td></tr>`}).join('')}</tbody></table></div>`;
}

// ---------- Live session ----------
let rfc={active:false,count:0,fc:0,used:0,gained:0,exp:0,disc:true,day:1,n:0,hist:[]};

function rfcStart(){
 rfc={active:true,count:Math.min(99,Math.floor(valNum('rfcStartCount'))),fc:Math.floor(valNum('rfcStartFC')),used:0,gained:0,exp:0,
  disc:!!document.getElementById('rfcStartDisc')?.checked,day:1,n:0,hist:[]};
 rfcRenderSession();
}
// One conversion. half=true uses the daily discount. Returns false when it cannot be done.
function rfcOne(half){
 if(rfc.count>=RFC_WEEK_MAX)return false;
 if(half&&!rfc.disc)return false;
 const t=rfcTierIdx(rfc.count), cost=RFC_TIERS[t].cost*(half?0.5:1);
 if(rfc.fc<cost)return false;
 const r=rfcRoll(t);
 rfc.fc-=cost;rfc.used+=cost;rfc.gained+=r;rfc.exp+=RFC_TIERS[t].ev;rfc.count++;rfc.n++;rfc.disc=false;
 rfc.hist.unshift({r,t:t+1,half});if(rfc.hist.length>60)rfc.hist.pop();
 return true;
}
function rfcConvert(times,half){for(let i=0;i<times;i++)if(!rfcOne(half&&i===0))break;rfcRenderSession();}
function rfcNextDay(){if(rfc.day<7){rfc.day++;rfc.disc=true;rfcRenderSession();}}
function rfcNewWeek(){rfc.count=0;rfc.day=1;rfc.disc=true;rfcRenderSession();}

function rfcLuck(){
 if(rfc.n<5)return ['Neutral','Too few conversions'];
 const d=rfc.gained/rfc.exp;
 const label=d>=1.1?'Lucky':d<=0.9?'Unlucky':'Neutral';
 return [label,(d>=1?'+':'')+rfcNum((d-1)*100,1)+'% vs expected'];
}
function rfcRenderSession(){
 const el=document.getElementById('rfcSession'); if(!el)return;
 if(!rfc.active){el.innerHTML='<p class="notice">Set your starting values above, then press <b>Start Simulation</b>.</p>';return;}
 const t=rfcTierIdx(rfc.count), T=RFC_TIERS[t], done=rfc.count>=RFC_WEEK_MAX;
 const canFull=!done&&rfc.fc>=T.cost, canHalf=!done&&rfc.disc&&rfc.fc>=T.cost/2;
 const inTier=done?RFC_PER_TIER:rfc.count-t*RFC_PER_TIER, luck=rfcLuck();
 el.innerHTML=`
 <div class="rfc-tier"><div><small>Current tier</small><b>Tier ${t+1}</b></div><div><small>Cost per conversion</small><b>${rfcFcIcon} ${T.cost}</b></div><div><small>FC inventory</small><b>${rfcFcIcon} ${fmt(rfc.fc)}</b></div><div><small>Day</small><b>${rfc.day} / 7</b></div></div>
 <div class="svs-progress"><span style="width:${rfc.count/RFC_WEEK_MAX*100}%"></span></div>
 <div class="svs-remaining">${done?'Weekly limit reached (100/100)':`Weekly progress: ${rfc.count} / ${RFC_WEEK_MAX} · ${inTier}/${RFC_PER_TIER} in Tier ${t+1}`}</div>
 <div class="rfc-prob">${T.out.map(o=>`<span class="rfc-chip">${rfcRfcIcon} <b>${o[0]}</b> ${o[1]}%</span>`).join('')}</div>
 <div class="rfc-actions">
  <button class="add" ${canFull?'':'disabled'} onclick="rfcConvert(1,false)">${rfcFcIcon} Convert (${T.cost} FC)</button>
  <button class="add secondary" ${canFull?'':'disabled'} onclick="rfcConvert(10,false)">×10</button>
  <button class="add secondary" ${canHalf?'':'disabled'} onclick="rfcConvert(1,true)" title="Only the first conversion of each day is discounted">50% Off (${T.cost/2} FC)</button>
  <button class="mini-btn" ${rfc.day<7?'':'disabled'} onclick="rfcNextDay()">Next Day</button>
  <button class="mini-btn" onclick="rfcNewWeek()">New Week</button>
 </div>
 <div class="result-grid" style="margin-top:12px">${
  statCard(rfcRfcIcon+' '+fmt(rfc.gained),'RFC gained')+
  statCard(rfcFcIcon+' '+fmt(rfc.used),'FC used')+
  statCard(rfc.n?rfcNum(rfc.gained/rfc.n,2):'-','Avg RFC / conversion')+
  statCard(luck[0],'Luck · '+luck[1],luck[0]==='Lucky'?'ok':luck[0]==='Unlucky'?'warn':'')}</div>
 <div class="rfc-note">${rfc.disc?'Today\'s 50% discount is available (first conversion of the day only).':'Today\'s 50% discount is used or no longer available - press <b>Next Day</b> to continue.'}${rfc.fc<T.cost/2&&!done?' <b>Not enough FC for another conversion.</b>':''}</div>
 <div class="rfc-hist">${rfc.hist.map(h=>`<span class="r${Math.min(h.r,6)}" title="Tier ${h.t}${h.half?' · 50% off':''}">${h.half?'½ ':''}+${h.r}</span>`).join('')||'<small>No conversions yet.</small>'}</div>`;
}
function initRFC(){rfcRenderStatic();rfcRenderPlan();rfcRenderSession();}
