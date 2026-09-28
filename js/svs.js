// SvS Prep Phase Calculator

// ---------- SvS PREP PHASE CALCULATOR ----------
// Point values, per-day tiering (high/medium/low) and activity list verified
// against https://wostools.net/svs-prep-phase-guide and
// https://wostools.net/id/svs-calculator (checked 2026-09-28; source data
// dated October 2025). Item shape: [label, pointsPerUnit, unitType, tier?]
// tier is 'high' | 'medium' | 'low' | undefined (undefined = no fixed rate,
// e.g. troop training/promotion which depend on tier — use Import instead).
const SVS_DAYS=[
 {name:'Day 1',theme:'City Construction',items:[
  ['Chief Charm Score',70,'score','high'],
  ['Fire Crystal (Building)',2000,'count','high'],
  ['Refined Fire Crystal (Building)',30000,'count','high'],
  ['Construction Speedup (1m)',30,'minutes','high'],
  ['Fire Crystal Shard (Research)',1000,'count','high'],
  ['Research Speedup (1m)',30,'minutes','high'],
  ['Troops Training Speedup (1m)',30,'minutes','low'],
  ['Expert Skills Learning Speedup (1m)',30,'minutes','low']
 ]},
 {name:'Day 2',theme:'Research Day',items:[
  ['Fire Crystal Shard (Research)',1000,'count','high'],
  ['Research Speedup (1m)',30,'minutes','high'],
  ['Lucky Wheel Spin',8000,'count','high'],
  ['Rare Hero Shard',350,'count','high'],
  ['Epic Hero Shard',1220,'count','high'],
  ['Mythic Hero Shard',3040,'count','high'],
  ['Gather 1.000 Meat',2,'count','high'],
  ['Gather 1.000 Wood',2,'count','high'],
  ['Gather 200 Coal',2,'count','high'],
  ['Gather 50 Iron',2,'count','high'],
  ['Expert Sigil (non-Common)',6000,'count','high'],
  ['Book of Knowledge',60,'count','high'],
  ['Fire Crystal (Building)',2000,'count','medium'],
  ['Construction Speedup (1m)',30,'minutes','medium'],
  ['Troops Training Speedup (1m)',30,'minutes','medium'],
  ['Expert Skills Learning Speedup (1m)',30,'minutes','medium'],
  ['Refined Fire Crystal (Building)',30000,'count','medium']
 ]},
 {name:'Day 3',theme:'Beast Slay',items:[
  ['Chief Charm Score',70,'score','high'],
  ['Polar Terror Rally Kill',30000,'count','high'],
  ['Pet Advancement Score',50,'score','high'],
  ['Advanced Wild Mark (Pet Refine)',15000,'count','high'],
  ['Common Wild Mark (Pet Refine)',1150,'count','high'],
  ['Beast Kill Lv.1-10',9000,'count','high'],
  ['Beast Kill Lv.11-15',9750,'count','high'],
  ['Beast Kill Lv.16-20',10500,'count','high'],
  ['Beast Kill Lv.21-25',11250,'count','high'],
  ['Beast Kill Lv.26-30',12000,'count','high'],
  ['Expert Sigil (non-Common)',6000,'count','high'],
  ['Book of Knowledge',60,'count','high'],
  ['Lucky Wheel Spin',8000,'count','medium'],
  ['Rare Hero Shard',350,'count','medium'],
  ['Epic Hero Shard',1220,'count','medium'],
  ['Mythic Hero Shard',3040,'count','medium']
 ]},
 {name:'Day 4',theme:'Hero Development',items:[
  ['Chief Charm Score',70,'score','high'],
  ['Hero Gear Essence Stone',4000,'count','high'],
  ['Hero Gear Widget',8000,'count','high'],
  ['Mithril',144000,'count','high'],
  ['Troop Training',1,'troop'],
  ['Troop Promotion',1,'troop']
 ]},
 {name:'Day 5',theme:'Power Boost',items:[
  ['Pet Advancement Score',50,'score','high'],
  ['Advanced Wild Mark (Pet Refine)',15000,'count','high'],
  ['Common Wild Mark (Pet Refine)',1150,'count','high'],
  ['Chief Gear Score',36,'score','high'],
  ['Hero Gear Essence Stone',4000,'count','high'],
  ['Hero Gear Widget',8000,'count','high'],
  ['Mithril',144000,'count','high'],
  ['Fire Crystal (Building)',2000,'count','high'],
  ['Construction Speedup (1m)',30,'minutes','high'],
  ['Research Speedup (1m)',30,'minutes','high'],
  ['Troops Training Speedup (1m)',30,'minutes','high'],
  ['Expert Skills Learning Speedup (1m)',30,'minutes','high'],
  ['Fire Crystal Shard (Research)',1000,'count','high'],
  ['Refined Fire Crystal (Building)',30000,'count','high']
 ]}
];
const SVS_TIER_LABEL={high:'High Value',medium:'Medium Value',low:'Low Value'};
let svsDay=0;
let svsValues=SVS_DAYS.map(d=>d.items.map(()=>0));
function renderSVS(){
 const tabs=document.getElementById('svsTabs'), head=document.getElementById('svsDayHead'), list=document.getElementById('svsActivities');
 if(!tabs||!head||!list)return;
 tabs.innerHTML=SVS_DAYS.map((d,i)=>`<button class="svs-tab ${i===svsDay?'active':''}" onclick="setSVSDay(${i})"><b>${d.name}</b><small>${d.theme}</small><em>${fmt(svsDayTotal(i))} pts</em></button>`).join('');
 const d=SVS_DAYS[svsDay]; head.innerHTML=`<div><b>${d.name}: ${d.theme}</b><small>Enter the planned amount. Totals are saved automatically in your browser.</small></div><button class="mini-btn" onclick="resetSVSDay()">Reset Day</button>`;
 list.innerHTML=d.items.map((it,i)=>{const val=svsValues[svsDay][i]||0;const tier=it[3];const tierBadge=tier?`<span class="svs-tier ${tier}">${SVS_TIER_LABEL[tier]}</span>`:'';return `<div class="svs-card"><div><b>${it[0]}</b><small>${fmt(it[1])} pts ${it[2]==='minutes'?'per minute':it[2]==='score'?'per score point':it[2]==='troop'?'per applicable troop (use Import for tier-specific values)':''}</small>${tierBadge}</div><div class="stepper"><button onclick="changeSVS(${i},-1)">−</button><input type="number" min="0" value="${val}" oninput="setSVS(${i},this.value)"><button onclick="changeSVS(${i},1)">+</button></div><strong>${fmt(val*it[1])}</strong></div>`}).join('');
 calcSVS();
}
function setSVSDay(i){svsDay=i;renderSVS();}
function changeSVS(i,delta){svsValues[svsDay][i]=Math.max(0,(svsValues[svsDay][i]||0)+delta);saveSVS();renderSVS();}
function setSVS(i,v){svsValues[svsDay][i]=Math.max(0,Number(v)||0);saveSVS();calcSVS();}
function resetSVSDay(){svsValues[svsDay]=SVS_DAYS[svsDay].items.map(()=>0);saveSVS();renderSVS();}
function svsDayTotal(i){return SVS_DAYS[i].items.reduce((sum,it,j)=>sum+(svsValues[i][j]||0)*it[1],0);}
function calcSVS(){
 const total=SVS_DAYS.reduce((s,_,i)=>s+svsDayTotal(i),0), target=Math.max(0,Number(document.getElementById('svsTarget')?.value)||0), pct=target?Math.min(100,total/target*100):0;
 const gt=document.getElementById('svsGrandTotal');if(gt)gt.textContent=fmt(total)+' pts';
 const bar=document.getElementById('svsProgressBar');if(bar)bar.style.width=pct+'%';
 const rem=document.getElementById('svsRemaining');if(rem)rem.textContent=total>=target?'Target reached!':fmt(target-total)+' pts remaining';
 const bd=document.getElementById('svsBreakdown');if(bd)bd.innerHTML=SVS_DAYS.map((d,i)=>`<div class="svs-bar-row"><div><b>${d.name}</b><small>${d.theme}</small></div><div class="svs-bar"><span style="width:${total?svsDayTotal(i)/total*100:0}%"></span></div><strong>${fmt(svsDayTotal(i))}</strong></div>`).join('');
}
function saveSVS(){try{localStorage.setItem('calc_svs_values',JSON.stringify(svsValues));localStorage.setItem('calc_svs_target',document.getElementById('svsTarget')?.value||1000000)}catch(e){}}
function loadSVS(){try{const v=JSON.parse(localStorage.getItem('calc_svs_values'));if(Array.isArray(v)&&v.length===SVS_DAYS.length&&v.every((day,i)=>Array.isArray(day)&&day.length===SVS_DAYS[i].items.length))svsValues=v;const t=localStorage.getItem('calc_svs_target');if(t&&document.getElementById('svsTarget'))document.getElementById('svsTarget').value=t}catch(e){}}
function svsImport(type){
 let added=0;
 if(type==='troops'||type==='all'){
   const q=Number(document.getElementById('dbTroopQty')?.value)||0; const mode=document.getElementById('dbTroopMode')?.value||'train'; const tk=document.getElementById('dbTroopTier')?.value||'T1'; const fk=document.getElementById('dbTroopFrom')?.value||tk; const valid=mode!=='promote'||Object.keys(WOS_DB.troops).indexOf(fk)<Object.keys(WOS_DB.troops).indexOf(tk); const pts=valid?q*troopPointsPer(mode,fk,tk).svs:0; const idx=SVS_DAYS[3].items.findIndex(x=>x[0]===(mode==='promote'?'Troop Promotion':'Troop Training')); if(idx>=0)svsValues[3][idx]+=pts; added+=pts;
 }
 if(type==='charm'||type==='all'){
   ensureCharmVals(); const score=calcCharmTotals().totals.score; const pts=score*WOS_DB.charmRules.pointsPerScore; const idx=SVS_DAYS[3].items.findIndex(x=>x[0]==='Chief Charm Score');if(idx>=0)svsValues[3][idx]+=score;added+=pts;
 }
 if(type==='gear'||type==='all'){
   const pieces=Number(document.getElementById('cgPieces')?.value)||0; const cur=Number(document.getElementById('cgCur')?.value||0),tar=Number(document.getElementById('cgTar')?.value||0); const score=Math.max(0,tar-cur)*pieces;const idx=SVS_DAYS[4].items.findIndex(x=>x[0]==='Chief Gear Score');if(idx>=0)svsValues[4][idx]+=score;added+=score*36;
 }
 if(type==='war'||type==='all'){
   const shards=Number(document.getElementById('waShardInv')?.value)||0; const idx=SVS_DAYS[1].items.findIndex(x=>x[0].includes('Fire Crystal Shard'));if(idx>=0)svsValues[1][idx]+=shards;added+=shards*1000;
 }
 if(type==='building'||type==='all'){
   const plans=document.querySelectorAll('#buildingPlans .building-plan').length; const idx=SVS_DAYS[0].items.findIndex(x=>x[0]==='Fire Crystal (Building)');if(idx>=0)svsValues[0][idx]+=plans;added+=plans*2000;
 }
 if(type==='hero'||type==='all'){
   const hg=window._heroGearTotals||{essence:0,mithril:0,widgetTotal:0};
   const idxE=SVS_DAYS[3].items.findIndex(x=>x[0]==='Hero Gear Essence Stone'), idxW=SVS_DAYS[3].items.findIndex(x=>x[0]==='Hero Gear Widget'), idxM=SVS_DAYS[3].items.findIndex(x=>x[0]==='Mithril');
   if(idxE>=0)svsValues[3][idxE]+=hg.essence; if(idxW>=0)svsValues[3][idxW]+=hg.widgetTotal; if(idxM>=0)svsValues[3][idxM]+=hg.mithril;
   added+=hg.essence*4000+hg.widgetTotal*8000+hg.mithril*144000;
 }
 saveSVS(); renderSVS(); alert((type==='all'?'Import All':'Import '+type)+' completed. '+fmt(added)+' pts were added.');
}
