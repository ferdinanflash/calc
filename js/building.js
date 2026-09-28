// Building Calculator

// ---------- BUILDING CALCULATOR ----------
// Building names + per-level costs now come from WOS_DB.buildings (database.js),
// which is transcribed from wostools.net's published per-level tables instead
// of an estimated growth curve.
const buildingNames = WOS_DB.buildings.names;
let buildingPlans=[], buildingPlanId=0;

function levelOptions(building){
  const info = WOS_DB.buildings.getSteps(building) || {maxLevel:30,hasFc:false};
  const max = info.maxLevel || 30;
  let s='';
  for(let i=1;i<=max;i++) s+=`<option value="${i}">${i}</option>`;
  if (info.hasFc){ // only buildings that actually reach Fire Crystal levels get FC options
    for(let i=1;i<=10;i++) s+=`<option value="FC${i}">FC ${i}</option>`;
  }
  return s;
}
function addBuildingPlan(){
  const id=buildingPlanId++;
  buildingPlans.push({id,building:'Furnace',from:1,to:2});
  renderBuildingPlans();
}
function removeBuildingPlan(id){
  buildingPlans=buildingPlans.filter(x=>x.id!==id);
  renderBuildingPlans(); calcBuilding();
}
function updatePlan(id,key,val){
  const p=buildingPlans.find(x=>x.id===id);
  if(!p)return;
  if(key==='building'){
    p.building=val;
    // clamp from/to to the new building's max level (e.g. Barricade tops out at 10, no FC)
    const info=WOS_DB.buildings.getSteps(val)||{maxLevel:30,hasFc:false};
    const clamp=(v)=>{
      if(typeof v==='string'){ // 'FCn'
        return info.hasFc ? v : info.maxLevel;
      }
      return Math.min(v, info.maxLevel);
    };
    p.from=clamp(p.from);
    p.to=clamp(p.to);
    if(WOS_DB.buildings.levelToIndex(p.to) <= WOS_DB.buildings.levelToIndex(p.from)){
      p.to = typeof p.from==='number' ? Math.min(p.from+1, info.maxLevel) : p.from;
    }
    renderBuildingPlans();
  } else {
    p[key]=val.startsWith('FC')?val:parseInt(val,10);
  }
  calcBuilding();
}
function renderBuildingPlans(){
  const el=document.getElementById('buildingPlans');
  if(!el)return;
  if(!buildingPlans.length){
    el.innerHTML='<div class="empty-plan">No building plans yet. Click <b>+ Add Building Plan</b>.</div>';
    return;
  }
  el.innerHTML=buildingPlans.map(p=>{
    const opts=levelOptions(p.building);
    return `
    <div class="building-plan">
      <div class="plan-selects">
        <label>Building<select onchange="updatePlan(${p.id},'building',this.value)">
          ${buildingNames.map(n=>`<option ${n===p.building?'selected':''}>${n}</option>`).join('')}
        </select></label>
        <label>Current Level<select onchange="updatePlan(${p.id},'from',this.value)">${opts.replace(`value="${p.from}"`,`value="${p.from}" selected`)}</select></label>
        <span class="arrow">→</span>
        <label>Target Level<select onchange="updatePlan(${p.id},'to',this.value)">${opts.replace(`value="${p.to}"`,`value="${p.to}" selected`)}</select></label>
        <button class="rm" onclick="removeBuildingPlan(${p.id})">Hapus</button>
      </div>
    </div>`;
  }).join('');
}

function calcBuilding(){
  let totals={meat:0,wood:0,coal:0,iron:0,fc:0,rfc:0,seconds:0,levels:0};
  buildingPlans.forEach(p=>{
    const cost=WOS_DB.buildings.costBetween(p.building,p.from,p.to);
    totals.meat+=cost.meat; totals.wood+=cost.wood; totals.coal+=cost.coal; totals.iron+=cost.iron;
    totals.fc+=cost.fc; totals.rfc+=cost.rfc; totals.seconds+=cost.seconds;
    const fi=WOS_DB.buildings.levelToIndex(p.from), ti=WOS_DB.buildings.levelToIndex(p.to);
    totals.levels+=Math.max(0,ti-fi);
  });

  // Construction speed bonuses stack additively and reduce time as
  // time / (1 + totalBonus%/100) — matching WoSTools' documented formula
  // (e.g. 10h at +50% bonus => 10/1.5 = 6.67h), not a flat percentage cut.
  const bonus=valNum('vipBonus')+valNum('researchBonus')+valNum('allianceBonus')+valNum('islandBonus')+valNum('facilityBonus')+valNum('zinmanBonus')+valNum('hyenaBonus')+valNum('vpBonus')+(document.getElementById('mercantilism')?.checked?10:0);
  let totalHours=totals.seconds/3600;
  totalHours = totalHours/(1+bonus/100);
  // Agnes Project Management shaves a flat number of hours off EACH building
  // upgrade step (not once off the grand total).
  totalHours = Math.max(0, totalHours - valNum('agnesBonus')*totals.levels);
  if(document.getElementById('doubleTime')?.checked) totalHours*=0.8;

  const available={meat:valNum('resMeat'),wood:valNum('resWood'),coal:valNum('resCoal'),iron:valNum('resIron'),fc:valNum('resFC'),rfc:valNum('resRFC')};
  const names={meat:'<i class="bi bi-egg-fried"></i> Meat',wood:'<i class="bi bi-tree-fill"></i> Wood',coal:'<i class="bi bi-hexagon-fill"></i> Coal',iron:'<i class="bi bi-link-45deg"></i> Iron',fc:'<i class="bi bi-fire"></i> Fire Crystals',rfc:'<i class="bi bi-diamond-fill"></i> Refined FC'};
  let cards=Object.keys(names).map(k=>{
    const need=Math.ceil(totals[k]||0);
    const ok=available[k]>=need;
    return `<div class="stat ${ok?'ok':'warn'}"><div class="n">${need.toLocaleString('id-ID')}</div><div class="l">${names[k]} ${available[k]?'· tersedia '+available[k].toLocaleString('id-ID'):''}</div></div>`;
  }).join('');
  const days=Math.floor(totalHours/24), remH=totalHours%24, h=Math.floor(remH), min=Math.round((remH-h)*60);
  cards+=`<div class="stat"><div class="n">${days}d ${h}h ${min}m</div><div class="l">Total Time · ${bonus.toFixed(1)}% speed bonus</div></div>`;
  cards+=`<div class="stat"><div class="n">${totals.levels}</div><div class="l">Upgrade Steps</div></div>`;
  document.getElementById('buildingResult').innerHTML=cards;
}
function initBuilding(){
  if(!buildingPlans.length) addBuildingPlan();
  renderBuildingPlans();
  calcBuilding();
}
