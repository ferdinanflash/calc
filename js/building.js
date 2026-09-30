// Building Calculator

// ---------- BUILDING CALCULATOR ----------
// Building names + per-level costs now come from WOS_DB.buildings (database.js),
// which is transcribed from wostools.net's published per-level tables instead
// of an estimated growth curve.
const buildingNames = WOS_DB.buildings.names;
let buildingPlans=[], buildingPlanId=0;

// Level dropdown options.
// role 'from': for buildings that reach Fire Crystal levels, Current Level only offers FC1..FC9
//   (FC10 is max, so nothing could be targeted above it). Buildings without FC levels
//   (Research Center, Storehouse, resource camps, Barricade) still list their normal levels,
//   otherwise they would have no choices at all.
// role 'to': only levels strictly above the chosen Current Level.
function levelOptions(building,role,fromLevel){
  const B=WOS_DB.buildings, info = B.getSteps(building) || {maxLevel:30,hasFc:false};
  const max = info.maxLevel || 30;
  let s='';
  if (info.hasFc){
    // One continuous ladder: Lv.1..30, then FC1..FC10 (step index 0..39).
    // 'from' offers everything except the last tier; 'to' only tiers strictly above the current one.
    let fi=B.levelToIndex(fromLevel); if(isNaN(fi)) fi=0;
    const start = role==='to' ? Math.min(39,fi+1) : 0;
    const end = role==='to' ? 39 : 38;
    for(let i=start;i<=end;i++){
      const v = i<30 ? String(i+1) : 'FC'+(i-29);
      s+=`<option value="${v}">${i<30?'Lv. '+(i+1):'FC '+(i-29)}</option>`;
    }
  } else {
    const start = role==='to' ? (Number(fromLevel)||1)+1 : 1;
    const end = role==='to' ? max : max-1;
    for(let i=start;i<=end;i++) s+=`<option value="${i}">${i}</option>`;
  }
  return s;
}
function addBuildingPlan(){
  const id=buildingPlanId++;
  buildingPlans.push({id,building:'Furnace',from:'FC1',to:'FC2'});
  renderBuildingPlans(); calcBuilding();
}
function removeBuildingPlan(id){
  buildingPlans=buildingPlans.filter(x=>x.id!==id);
  renderBuildingPlans(); calcBuilding();
}
function updatePlan(id,key,val){
  const p=buildingPlans.find(x=>x.id===id);
  if(!p)return;
  const B=WOS_DB.buildings;
  if(key==='building') p.building=val;
  else p[key]=String(val).startsWith('FC')?val:parseInt(val,10);

  const info=B.getSteps(p.building)||{maxLevel:30,hasFc:false};
  if(info.hasFc){
    // Levels form one ladder (index 0..39 = Lv.1..30, FC1..FC10); Target must stay above Current.
    const idxToLv=i=>i<30?i+1:'FC'+(i-29);
    let fi=B.levelToIndex(p.from); if(isNaN(fi)) fi=0;
    fi=Math.min(Math.max(fi,0),38);
    let ti=B.levelToIndex(p.to); if(isNaN(ti)) ti=fi+1;
    if(key!=='to') ti=fi+1;                      // Current Level / building changed -> Target = Current + 1
    if(!(ti>fi)) fi=Math.max(0,ti-1);            // safety: target must stay above current
    ti=Math.min(Math.max(ti,fi+1),39);
    p.from=idxToLv(fi); p.to=idxToLv(ti);
  } else {
    const max=info.maxLevel;
    let f = typeof p.from==='number' ? p.from : 1;
    let t = typeof p.to==='number' ? p.to : max;
    f=Math.min(Math.max(f,1),max-1); t=Math.min(t,max);
    if(key!=='to') t=f+1;                        // Current Level / building changed -> Target = Current + 1
    if(t<=f) f=Math.max(1,t-1);                  // safety: target must stay above current
    p.from=f; p.to=t;
  }
  renderBuildingPlans();
  calcBuilding();
}
// Furnace FC1..FC10 badge: images/furnace/fc-{n}.webp (only Furnace has this artwork).
function fcIconHtml(building,level){
  if(building!=='Furnace'||typeof level!=='string'||!/^FC(?:[1-9]|10)$/.test(level))return '';
  return `<img class="fc-ic" src="images/furnace/fc-${level.slice(2)}.webp" alt="${level}" title="${level}">`;
}
function renderBuildingPlans(){
  const el=document.getElementById('buildingPlans');
  if(!el)return;
  if(!buildingPlans.length){
    el.innerHTML='<div class="empty-plan">No building plans yet. Click <b>+ Add Building Plan</b>.</div>';
    return;
  }
  el.innerHTML=buildingPlans.map(p=>{
    const optsFrom=levelOptions(p.building,'from',p.from), optsTo=levelOptions(p.building,'to',p.from);
    return `
    <div class="building-plan">
      <div class="plan-selects">
        <label>Building<select onchange="updatePlan(${p.id},'building',this.value)">
          ${buildingNames.map(n=>`<option ${n===p.building?'selected':''}>${n}</option>`).join('')}
        </select></label>
        <label>Current Level${fcIconHtml(p.building,p.from)}<select onchange="updatePlan(${p.id},'from',this.value)">${optsFrom.replace(`value="${p.from}"`,`value="${p.from}" selected`)}</select></label>
        <span class="arrow">→</span>
        <label>Target Level${fcIconHtml(p.building,p.to)}<select onchange="updatePlan(${p.id},'to',this.value)">${optsTo.replace(`value="${p.to}"`,`value="${p.to}" selected`)}</select></label>
        <button class="rm" onclick="removeBuildingPlan(${p.id})">Remove</button>
      </div>
    </div>`;
  }).join('');
}

function calcBuilding(){
  let totals={meat:0,wood:0,coal:0,iron:0,fc:0,rfc:0,seconds:0,levels:0};
  let stepSeconds=[];
  buildingPlans.forEach(p=>{
    const cost=WOS_DB.buildings.costBetween(p.building,p.from,p.to);
    totals.meat+=cost.meat; totals.wood+=cost.wood; totals.coal+=cost.coal; totals.iron+=cost.iron;
    totals.fc+=cost.fc; totals.rfc+=cost.rfc; totals.seconds+=cost.seconds;
    stepSeconds=stepSeconds.concat(cost.stepSeconds);
  });
  totals.levels=stepSeconds.length; // only real upgrade steps

  // Construction speed bonuses stack additively and reduce time as
  // time / (1 + totalBonus%/100) — matching WoSTools' documented formula
  // (e.g. 10h at +50% bonus => 10/1.5 = 6.67h), not a flat percentage cut.
  const bonus=valNum('vipBonus')+valNum('researchBonus')+valNum('allianceBonus')+valNum('islandBonus')+valNum('facilityBonus')+valNum('zinmanBonus')+valNum('hyenaBonus')+valNum('vpBonus')+(document.getElementById('mercantilism')?.checked?10:0);
  // Agnes Project Management shaves a flat number of hours off EACH upgrade step. It is
  // applied per step and clamped at 0, so short early-level upgrades can't go negative
  // and eat into the time of the long ones.
  const agnesSec=valNum('agnesBonus')*3600;
  const doubleTime=document.getElementById('doubleTime')?.checked;
  let totalSeconds=0;
  stepSeconds.forEach(sec=>{
    let t=sec/(1+bonus/100);
    t=Math.max(0,t-agnesSec);
    if(doubleTime) t*=0.8;
    totalSeconds+=t;
  });
  const totalHours=totalSeconds/3600;

  window._buildingTotals={...totals};
  const available={meat:valNum('resMeat'),wood:valNum('resWood'),coal:valNum('resCoal'),iron:valNum('resIron'),fc:valNum('resFC'),rfc:valNum('resRFC')};
  const names={meat:'<img class="res-ic" src="images/resources/meat.webp" alt="Meat"> Meat',wood:'<img class="res-ic" src="images/resources/wood.webp" alt="Wood"> Wood',coal:'<img class="res-ic" src="images/resources/coal.webp" alt="Coal"> Coal',iron:'<img class="res-ic" src="images/resources/iron.webp" alt="Iron"> Iron',fc:'<img class="res-ic" src="images/resources/fire-crystal.webp" alt="Fire Crystal"> Fire Crystals',rfc:'<img class="res-ic" src="images/resources/refined-fire-crystal.webp" alt="Refined FC"> Refined FC'};
  let cards=Object.keys(names).map(k=>{
    const need=Math.ceil(totals[k]||0);
    const ok=available[k]>=need;
    return statCard(fmt(need),`${names[k]} ${available[k]?'· available '+fmt(available[k]):''}`,ok?'ok':'warn');
  }).join('');
  cards+=statCard(totalSeconds>0&&totalSeconds<60?secondsText(totalSeconds):formatDuration(totalSeconds),`Total Time · ${bonus.toFixed(1)}% speed bonus`);
  cards+=statCard(fmt(totals.levels),'Upgrade Steps');
  document.getElementById('buildingResult').innerHTML=cards;
}
function initBuilding(){
  if(!buildingPlans.length) addBuildingPlan();
  renderBuildingPlans();
  calcBuilding();
}
