// ---------- DATA MODELS (best-effort, see notice on page) ----------

// Mastery Forging: cumulative Essence Stones & Mythics up to level L (0-20)
function masteryEssence(L){ return 5*L*(L+1); } // 10+20+...+10L
function masteryMythic(L){ return L<=10?0:((L-10)*(L-9))/2; }

// Enhance track control points (cumulative XP), levels 0-200
const enhPts = [
  [0,0],[10,55],[20,105],[30,160],[40,280],[50,470],[60,730],[70,1040],
  [80,1400],[90,1810],[100,2400],[119,5325],[120,5325],[139,9275],[140,9275],
  [159,14175],[160,14175],[179,20575],[180,20575],[199,28575],[200,28575]
];
function enhCumulative(L){
  L=Math.max(0,Math.min(200,L));
  for(let i=0;i<enhPts.length-1;i++){
    const [l1,v1]=enhPts[i],[l2,v2]=enhPts[i+1];
    if(L>=l1 && L<=l2){
      if(l2===l1) return v1;
      return v1 + (v2-v1)*(L-l1)/(l2-l1);
    }
  }
  return enhPts[enhPts.length-1][1];
}
// Mithril milestones inside Enhance track: level -> {mithril, mythic}
const mithrilMilestones = {120:{mithril:10,mythic:3},140:{mithril:20,mythic:5},160:{mithril:30,mythic:5},180:{mithril:40,mythic:10},200:{mithril:50,mythic:10}};
function milestonesBetween(curr,des){
  let mithril=0,mythic=0,points=0;
  Object.keys(mithrilMilestones).forEach(lv=>{
    lv=parseInt(lv);
    if(lv>curr && lv<=des){
      mithril+=mithrilMilestones[lv].mithril;
      mythic+=mithrilMilestones[lv].mythic;
      points+=mithrilMilestones[lv].mithril*144000;
    }
  });
  return {mithril,mythic,points};
}

// Widget step costs, level 0-10
const widgetStep=[0,5,10,15,20,25,30,35,40,45,50];
function widgetCumulative(L){ let s=0; for(let i=1;i<=L;i++) s+=widgetStep[i]; return s; }

// ---------- Icon set ----------
// Goggles uses the uploaded image file; the rest are original hand-drawn SVG icons.
const ICONS = {
  goggles: `<img src="images/goggles.webp" style="width:100%;height:100%;object-fit:contain;" alt="goggles">`,
  gloves: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M16 44V22c0-2 1-3 3-3s3 1 3 3v6h2V14c0-2 1-3 3-3s3 1 3 3v14h2V17c0-2 1-3 3-3s3 1 3 3v11h2V21c0-2 1-3 3-3s3 1 3 3v14c0 5-4 9-9 9H20c-2 0-4-1-4-4z" fill="#22314f" stroke="#ffb84d" stroke-width="2.5" stroke-linejoin="round"/></svg>`,
  belt: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><rect x="4" y="18" width="40" height="12" rx="3" fill="#22314f" stroke="#4ade80" stroke-width="3"/><rect x="18" y="15" width="12" height="18" rx="3" fill="#1c2947" stroke="#4ade80" stroke-width="3"/><circle cx="24" cy="24" r="3" fill="#4ade80"/></svg>`,
  boots: `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg"><path d="M14 6h12v18l10 8c2 1.5 3 3.5 3 6v4H10V26c0-2 1-3 2-4l2-2z" fill="#22314f" stroke="#f87171" stroke-width="2.5" stroke-linejoin="round"/><rect x="14" y="6" width="12" height="6" fill="#f87171" opacity=".5"/></svg>`
};
const BADGES = {
  infantry: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M16 3l11 4v9c0 7-5 11-11 13C10 27 5 23 5 16V7z" fill="#3b82f6"/><path d="M16 8l3 6h6l-5 4 2 6-6-4-6 4 2-6-5-4h6z" fill="#dbeafe"/></svg>`,
  lancer: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><rect x="14.5" y="2" width="3" height="26" rx="1.5" fill="#a78bfa" transform="rotate(20 16 15)"/><path d="M16 2l5 6-5-2-5 2z" fill="#e9d8fd" transform="rotate(20 16 15)"/></svg>`,
  marksman: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="12" fill="none" stroke="#34d399" stroke-width="2.5"/><circle cx="16" cy="16" r="6" fill="none" stroke="#34d399" stroke-width="2.5"/><circle cx="16" cy="16" r="1.5" fill="#34d399"/><line x1="16" y1="1" x2="16" y2="7" stroke="#34d399" stroke-width="2.5"/><line x1="16" y1="25" x2="16" y2="31" stroke="#34d399" stroke-width="2.5"/></svg>`
};
const TROOP_LABEL={infantry:'Infantry',lancer:'Lancer',marksman:'Marksman'};
const GEAR_LABEL={goggles:'Goggles',gloves:'Gloves',belt:'Belt',boots:'Boots'};

let pieceId=0, widgetId=0;
const pieces={}, widgets={};

function lvlOptions(max,val){
  let o='';
  for(let i=0;i<=max;i++) o+=`<option value="${i}" ${i===val?'selected':''}>${i}</option>`;
  return o;
}

function addPiece(troop,gear){
  const id=pieceId++;
  pieces[id]={troop:troop||'infantry',gear:gear||'goggles',mCur:1,mDes:1,eCur:0,eDes:0,wCur:0,wDes:0};
  render();
}
function removePiece(id){ delete pieces[id]; render(); }
function addWidget(){
  const id=widgetId++;
  widgets[id]={cur:0,des:0};
  render();
}
function removeWidget(id){ delete widgets[id]; render(); }

function updatePiece(id,field,val){
  pieces[id][field]= (field==='troop'||field==='gear')?val:(parseInt(val)||0);
  render();
}
function updateWidget(id,field,val){
  widgets[id][field]=parseInt(val)||0;
  render();
}

function render(){
  const pc=document.getElementById('pieces');
  pc.innerHTML='';
  Object.entries(pieces).forEach(([id,p])=>{
    const div=document.createElement('div');
    div.className='piece-row';
    div.innerHTML=`
      <div class="piece-head">
        <div class="icon-wrap">
          <div class="gear-icon">${ICONS[p.gear]}</div>
          <div class="badge-icon">${BADGES[p.troop]}</div>
        </div>
        <select onchange="updatePiece(${id},'troop',this.value)">
          ${Object.keys(TROOP_LABEL).map(t=>`<option value="${t}" ${t===p.troop?'selected':''}>${TROOP_LABEL[t]}</option>`).join('')}
        </select>
        <select onchange="updatePiece(${id},'gear',this.value)">
          ${Object.keys(GEAR_LABEL).map(g=>`<option value="${g}" ${g===p.gear?'selected':''}>${GEAR_LABEL[g]}</option>`).join('')}
        </select>
        <button class="rm" onclick="removePiece(${id})">Hapus</button>
      </div>
      <div class="grid3">
        <div class="field"><label>Mastery Forging (1-20)</label>
          <div class="row2">
            <select onchange="updatePiece(${id},'mCur',this.value)">${lvlOptions(20,p.mCur)}</select>
            <span class="arrow">→</span>
            <select onchange="updatePiece(${id},'mDes',this.value)">${lvlOptions(20,p.mDes)}</select>
          </div>
        </div>
        <div class="field"><label>Enhance (0-200)</label>
          <div class="row2">
            <input type="number" min="0" max="200" value="${p.eCur}" onchange="updatePiece(${id},'eCur',this.value)">
            <span class="arrow">→</span>
            <input type="number" min="0" max="200" value="${p.eDes}" onchange="updatePiece(${id},'eDes',this.value)">
          </div>
        </div>
        <div class="field"><label>Widget (0-10)</label>
          <div class="row2">
            <select onchange="updatePiece(${id},'wCur',this.value)">${lvlOptions(10,p.wCur)}</select>
            <span class="arrow">→</span>
            <select onchange="updatePiece(${id},'wDes',this.value)">${lvlOptions(10,p.wDes)}</select>
          </div>
        </div>
      </div>`;
    pc.appendChild(div);
  });

  const wc=document.getElementById('widgets');
  wc.innerHTML='';
  Object.entries(widgets).forEach(([id,w])=>{
    const div=document.createElement('div');
    div.className='widget-row';
    div.innerHTML=`
      <div class="field"><label>Current</label><select onchange="updateWidget(${id},'cur',this.value)">${lvlOptions(10,w.cur)}</select></div>
      <div class="field"><label>Desired</label><select onchange="updateWidget(${id},'des',this.value)">${lvlOptions(10,w.des)}</select></div>
      <button class="rm" onclick="removeWidget(${id})">Hapus</button>`;
    wc.appendChild(div);
  });

  renderSummary();
}

function renderSummary(){
  let essence=0, mythicMastery=0, enhXP=0, mithril=0, mythicMilestone=0, milePoints=0, widgetTotal=0;

  Object.values(pieces).forEach(p=>{
    essence += Math.max(0, masteryEssence(p.mDes)-masteryEssence(p.mCur));
    mythicMastery += Math.max(0, masteryMythic(p.mDes)-masteryMythic(p.mCur));
    enhXP += Math.max(0, enhCumulative(p.eDes)-enhCumulative(p.eCur));
    const ms = milestonesBetween(p.eCur,p.eDes);
    mithril += ms.mithril; mythicMilestone += ms.mythic; milePoints += ms.points;
    widgetTotal += Math.max(0, widgetCumulative(p.wDes)-widgetCumulative(p.wCur));
  });

  Object.values(widgets).forEach(w=>{
    widgetTotal += Math.max(0, widgetCumulative(w.des)-widgetCumulative(w.cur));
  });

  const widgetPoints = widgetTotal*8000;
  const essencePoints = essence*4000;
  const totalMythic = mythicMastery+mythicMilestone;
  const totalPoints = milePoints+widgetPoints+essencePoints;

  const stats=[
    ['Essence Stones', essence.toLocaleString('id-ID')],
    ['Mithril', mithril.toLocaleString('id-ID')],
    ['Mythic Gear', totalMythic.toLocaleString('id-ID')],
    ['Enhance XP (perkiraan)', Math.round(enhXP).toLocaleString('id-ID')],
    ['Widget', widgetTotal.toLocaleString('id-ID')],
    ['SvS/KOI Points (Mithril+Widget+Essence)', totalPoints.toLocaleString('id-ID')],
  ];
  document.getElementById('summary').innerHTML = stats.map(([l,n])=>`<div class="stat"><div class="n">${n}</div><div class="l">${l}</div></div>`).join('');
  // Exposed so the SvS Calculator's "Import Hero Gear" button can pull real planned totals.
  window._heroGearTotals = {essence, mithril, widgetTotal};
}


// ---------- MAIN MENU / MODALS ----------
function openModal(id){
  const m=document.getElementById(id);
  if(!m) return;
  m.classList.add('open');
  m.setAttribute('aria-hidden','false');
  document.body.classList.add('modal-open');
  if(id==='buildingModal') initBuilding();
  if(id==='troopsModal') renderTroopDB();
  if(id==='warAcademyModal') renderWarAcademyDB();
  if(id==='charmModal') renderCharmDB();
  if(id==='chiefGearModal') renderGearDB();
  if(id==='svsModal'){ loadSVS(); renderSVS(); }
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
    el.innerHTML='<div class="empty-plan">Belum ada building plan. Klik <b>+ Add Building Plan</b>.</div>';
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
function valNum(id){return Math.max(0,parseFloat(document.getElementById(id)?.value)||0);}
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


// seed existing Hero Gear calculator, but it now opens inside a modal
addPiece('infantry','goggles');
addWidget();

function formatDuration(sec){sec=Math.round(sec||0);let d=Math.floor(sec/86400);sec%=86400;let h=Math.floor(sec/3600);sec%=3600;let m=Math.floor(sec/60);return `${d?d+'d ':''}${h}h ${m}m`}

// ---------- WAR ACADEMY ----------
const waBranches={
 Infantry:['Flame Squad','Flame Shield','Flame Strike','Flame Tomahawk','Flame Protection','Flame Legion','Helios Infantry','Helios Infantry Training','Helios Infantry Healing','Helios Infantry First Aid'],
 Lancer:['Flame Squad','Blazing Armor','Blazing Charge','Blazing Lance','Blazing Guardian','Flame Legion','Helios Lancer','Helios Lancer Training','Helios Lancer Healing','Helios Lancer First Aid'],
 Marksman:['Flame Squad','Crystal Armor','Crystal Vision','Crystal Arrow','Crystal Protection','Flame Legion','Helios Marksman','Helios Marksman Training','Helios Marksman Healing','Helios Marksman First Aid']
};
let waLevels={Infantry:Array(10).fill(0),Lancer:Array(10).fill(0),Marksman:Array(10).fill(0)};
function initWarAcademy(){
  const el=document.getElementById('warBranches'); if(!el)return;
  el.innerHTML=Object.entries(waBranches).map(([type,items])=>`<div class="bc-section"><h3><i class="bi bi-fire"></i> ${type}</h3><div class="research-list">${items.map((n,i)=>`<div class="research-row"><span>${n}<small> max ${i<6?[5,8,8,12,12,12][i]:i===6?1:10}</small></span><select onchange="waLevels.${type}[${i}]=+this.value;calcWarAcademy()">${Array.from({length:(i<6?[5,8,8,12,12,12][i]:i===6?1:10)+1},(_,x)=>`<option value="${x}">${x}</option>`).join('')}</select><span>→</span><select onchange="waLevels.${type}[${i}]=Math.max(waLevels.${type}[${i}],+this.value);calcWarAcademy()">${Array.from({length:(i<6?[5,8,8,12,12,12][i]:i===6?1:10)+1},(_,x)=>`<option value="${x}">${x}</option>`).join('')}</select></div>`).join('')}</div></div>`).join('');
  calcWarAcademy();
}
function waSetAll(v){Object.keys(waLevels).forEach(k=>waLevels[k]=waLevels[k].map((_,i)=>i===6?1:Math.min(v,i<6?[5,8,8,12,12,12][i]:10)));initWarAcademy();}
function calcWarAcademy(){
  let lv=0;Object.values(waLevels).forEach(a=>a.forEach(v=>lv+=v));
  const speed=1+(+document.getElementById('waSpeed')?.value||0)/100+(+document.getElementById('waState')?.value||0)/100+(+document.getElementById('waVP')?.value||0)/100;
  const shards=lv*1250,steel=lv*250,meat=lv*100000,wood=lv*100000,coal=lv*50000,iron=lv*25000,time=lv*7200/speed;
  const fmt=n=>Math.round(n).toLocaleString('id-ID');
  document.getElementById('waResult').innerHTML=[
    ['n',fmt(shards),'<i class="bi bi-fire"></i> FC Shards'],['n',fmt(steel),'<img class="res-ic" src="images/resources/steel.webp" alt="Steel"> Steel'],['n',fmt(meat),'<i class="bi bi-egg-fried"></i> Meat'],['n',fmt(wood),'<i class="bi bi-tree-fill"></i> Wood'],
    ['n',fmt(coal),'<i class="bi bi-hexagon-fill"></i> Coal'],['n',fmt(iron),'<i class="bi bi-link-45deg"></i> Iron'],['n',formatDuration(time),'<i class="bi bi-stopwatch-fill"></i> Research Time'],['n',fmt(lv),'<i class="bi bi-graph-up-arrow"></i> Research Levels']
  ].map(x=>`<div class="stat"><div class="n">${x[1]}</div><div class="l">${x[2]}</div></div>`).join('');
}

// ---------- CHIEF CHARMS ----------
const charmSlots=[
 ['Lancer','Helmet'],['Lancer','Watch'],['Lancer','Pants'],['Infantry','Helmet'],['Infantry','Watch'],['Infantry','Jacket'],
 ['Infantry','Pants'],['Marksman','Ring'],['Marksman','Cane'],['Marksman','Jacket'],['Marksman','Pants'],['Marksman','Ring'],
 ['Lancer','Helmet 2'],['Lancer','Watch 2'],['Infantry','Jacket 2'],['Marksman','Cane 2'],['Marksman','Ring 2'],['Infantry','Pants 2']
];
let charmVals=charmSlots.map(()=>({c:0,t:0}));
const charmLevels=['0','1','2','3','4','4.1','4.2','4.3','5','5.1','5.2','5.3','6','6.1','6.2','6.3','7','7.1','7.2','7.3','8','8.1','8.2','8.3','9','9.1','9.2','9.3','10','10.1','10.2','10.3','10.4','11','11.1','11.2','11.3','11.4','12','12.1','12.2','12.3','12.4','13','13.1','13.2','13.3','13.4','14','14.1','14.2','14.3','14.4','15','15.1','15.2','15.3','15.4','16'];
function charmValue(s){let [a,b]=String(s).split('.').map(Number);return a+(b||0)/10}
function charmCost(a,b){
  const x=Math.max(0,charmValue(b)-charmValue(a)), base=Math.ceil(x*35);
  return {guides:base*10,designs:base*6,secrets:charmValue(b)>=12?Math.max(1,Math.ceil(x*12)):0};
}
function initCharms(){
 const el=document.getElementById('charmGroups');if(!el)return;
 el.innerHTML=['Lancer','Infantry','Marksman'].map(type=>`<div class="bc-section"><h3>${type}</h3>${charmSlots.map((s,i)=>s[0]===type?`<div class="research-row"><span>${s[1]}</span><select onchange="charmVals[${i}].c=+this.value;calcCharms()">${charmLevels.map((v,j)=>`<option value="${j}">${v}</option>`).join('')}</select><span>→</span><select onchange="charmVals[${i}].t=+this.value;calcCharms()">${charmLevels.map((v,j)=>`<option value="${j}" ${j===16?'selected':''}>${v}</option>`).join('')}</select></div>`:'').join('')}</div>`).join('');
 calcCharms();
}
function charmSetAll(v){charmVals.forEach(x=>x.t=v);initCharms();}
function charmReset(){charmVals=charmVals.map(()=>({c:0,t:0}));initCharms();}
function calcCharms(){
 let g=0,d=0,s=0,ups=0;charmVals.forEach(x=>{if(x.t<x.c)x.t=x.c;let z=charmCost(charmLevels[x.c]||0,charmLevels[x.t]||0);g+=z.guides;d+=z.designs;s+=z.secrets;ups+=Math.max(0,charmValue(charmLevels[x.t])-charmValue(charmLevels[x.c]));});
 const power=ups*70,fmt=n=>Math.round(n).toLocaleString('id-ID');
 document.getElementById('charmResult').innerHTML=[
 ['n',fmt(g),'<i class="bi bi-book-fill"></i> Charm Guides'],['n',fmt(d),'<i class="bi bi-journal-text"></i> Charm Designs'],['n',fmt(s),'<i class="bi bi-gem"></i> Jewel Secrets'],['n',fmt(ups),'<i class="bi bi-arrow-up-circle-fill"></i> Charm Levels'],
 ['n',fmt(power),'<i class="bi bi-lightning-charge-fill"></i> Power / Event Units']
 ].map(x=>`<div class="stat"><div class="n">${x[1]}</div><div class="l">${x[2]}</div></div>`).join('');
}

// ---------- VERIFIED DATABASE CALCULATORS ----------
function fmt(n){return Number(n||0).toLocaleString('id-ID');}
function secondsText(s){s=Math.max(0,Math.round(s||0));const d=Math.floor(s/86400);s%=86400;const h=Math.floor(s/3600);s%=3600;const m=Math.floor(s/60);const sec=s%60;return (d?d+'d ':'')+(h?h+'h ':'')+(m?m+'m ':'')+(sec?sec+'s':'').trim()||'0s';}
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
function renderWarAcademyDB(){
 const m=document.getElementById('warAcademyModal'); if(!m)return; const b=m.querySelector('.modal-box');
 const rows=WOS_DB.warAcademy.helios.verifiedRows;
 b.innerHTML=`<button class="modal-close" onclick="closeModal('warAcademyModal')">×</button><div class="modal-title"><i class="bi bi-mortarboard-fill"></i> War Academy</div><div class="modal-sub">Database Helios/T12 research. Semua 3 cabang troop menggunakan struktur research terpisah.</div>
 <div class="bc-section"><div class="placeholder-grid"><label>Branch<select id="waBranch"><option>Infantry</option><option>Lancer</option><option>Marksman</option></select></label><label>Research Speed %<input id="waSpeed" type="number" min="0" value="0"></label><label>FC Shards<input id="waShardInv" type="number" min="0" value="0"></label><label>Steel<input id="waSteelInv" type="number" min="0" value="0"></label><label>Refined FC<input id="waRfcInv" type="number" min="0" value="0"></label></div></div>
 <div class="bc-section"><h3><i class="bi bi-fire"></i> Research Structure</h3><div class="research-tree">${WOS_DB.warAcademy.helios.common.map(x=>`<div class="tree-item"><b>${x[0]}</b><span>max ${x[1]}</span></div>`).join('')}</div><div class="notice">T11 terbuka setelah jalur Helios selesai. T12 memakai 5 track Exalted + Molten I/II/III + Solar Supremacy + Training/Healing/First Aid.</div></div>
 <div class="bc-section"><h3><i class="bi bi-clipboard-data-fill"></i> Verified Cost Rows</h3><div class="table-scroll"><table class="db-table"><thead><tr><th>Track</th><th>Lv</th><th>Meat</th><th>Wood</th><th>Coal</th><th>Iron</th><th>Steel</th><th>FC Shards</th><th>RFC</th><th>Time</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r.track}</td><td>${r.level}</td><td>${fmt(r.meat)}</td><td>${fmt(r.wood)}</td><td>${fmt(r.coal)}</td><td>${fmt(r.iron)}</td><td>${fmt(r.steel)}</td><td>${fmt(r.shards)}</td><td>${fmt(r.refinedFC)}</td><td>${secondsText(r.seconds)}</td></tr>`).join('')}</tbody></table></div></div>
 <div class="bc-section"><h3><i class="bi bi-fire"></i> T12 Structure</h3><div class="result-grid"><div class="stat"><div class="n">5</div><div class="l">Exalted tracks</div></div><div class="stat"><div class="n">20</div><div class="l">Molten I / track</div></div><div class="stat"><div class="n">50</div><div class="l">Molten II / track</div></div><div class="stat"><div class="n">15</div><div class="l">Solar Supremacy</div></div><div class="stat"><div class="n">50</div><div class="l">Molten III / track</div></div></div></div>`;
}
function renderCharmDB(){
 const m=document.getElementById('charmModal'); if(!m)return; const b=m.querySelector('.modal-box');
 b.innerHTML=`<button class="modal-close" onclick="closeModal('charmModal')">×</button><div class="modal-title"><i class="bi bi-gem"></i> Chief Charm</div><div class="modal-sub">18 slot database — 3 charm per masing-masing dari 6 gear. Level 1–18.</div>
 <div class="bc-section"><div class="placeholder-grid"><label>Current Level<select id="chCur">${Object.keys(WOS_DB.charmLevels).map(x=>`<option>${x}</option>`).join('')}</select></label><label>Target Level<select id="chTar">${Object.keys(WOS_DB.charmLevels).map(x=>`<option>${x}</option>`).join('')}</select></label><label>Number of Charms<input id="chCount" type="number" min="1" max="18" value="18"></label><label>Guides Available<input id="chG" type="number" min="0" value="0"></label><label>Designs Available<input id="chD" type="number" min="0" value="0"></label><label>Secrets Available<input id="chS" type="number" min="0" value="0"></label></div></div>
 <div class="bc-section"><h3><i class="bi bi-bar-chart-fill"></i> Upgrade Summary</h3><div id="chResult" class="result-grid"></div></div>
 <div class="bc-section"><h3><i class="bi bi-puzzle-fill"></i> 18 Slots</h3><div class="charm-slots">${WOS_DB.chiefCharmsPieces.flatMap(p=>[1,2,3].map(i=>`<div class="tree-item"><b>${p.name} #${i}</b><span>${p.type}</span></div>`)).join('')}</div></div>
 <div class="bc-section"><h3><i class="bi bi-collection-fill"></i> Cost Database</h3><div class="table-scroll"><table class="db-table"><thead><tr><th>Level</th><th>Guides</th><th>Designs</th><th>Secrets</th></tr></thead><tbody>${Object.entries(WOS_DB.charmLevels).map(([l,v])=>`<tr><td>${l}</td><td>${fmt(v.guides)}</td><td>${fmt(v.designs)}</td><td>${fmt(v.secrets)}</td></tr>`).join('')}</tbody></table></div><div class="source-note">Level 17/18 memakai data terbaru yang sudah tercantum pada sumber publik; sub-level mengikuti pembagian upgrade game.</div></div>`;
 ['chCur','chTar','chCount','chG','chD','chS'].forEach(id=>document.getElementById(id)?.addEventListener('input',calcCharmDB)); calcCharmDB();
}
function calcCharmDB(){
 const cur=Number(document.getElementById('chCur')?.value||1), tar=Number(document.getElementById('chTar')?.value||1), count=Math.max(1,Number(document.getElementById('chCount')?.value)||1); let g=0,d=0,s=0;
 if(tar>cur)for(let l=cur+1;l<=tar;l++){const v=WOS_DB.charmLevels[l];g+=v.guides;d+=v.designs;s+=v.secrets;}
 g*=count;d*=count;s*=count;const invG=Number(document.getElementById('chG')?.value)||0,invD=Number(document.getElementById('chD')?.value)||0,invS=Number(document.getElementById('chS')?.value)||0;
 const cards=[['<i class="bi bi-book-fill"></i> Guides',g],['<i class="bi bi-journal-text"></i> Designs',d],['<i class="bi bi-gem"></i> Secrets',s],['<i class="bi bi-book-fill"></i> Still needed',Math.max(0,g-invG)],['<i class="bi bi-journal-text"></i> Still needed',Math.max(0,d-invD)],['<i class="bi bi-gem"></i> Still needed',Math.max(0,s-invS)],['<i class="bi bi-trophy-fill"></i> SvS',Math.max(0,tar-cur)*count*WOS_DB.charmRules.pointsPerLevel]];
 const el=document.getElementById('chResult');if(el)el.innerHTML=cards.map(x=>`<div class="stat"><div class="n">${fmt(x[1])}</div><div class="l">${x[0]}</div></div>`).join('');
}
// ---------- CHIEF GEAR ----------
// Level table (150 steps, Green 0★ -> Red T6 3★) lives in database.js (WOS_DB.chiefGear),
// mirroring https://wostools.net/chief-gear-calculator and /wiki/gear/chief-gear.
const CG_DEFAULT_TARGET=90; // Red T3 3★ (same default as wostools)
const CG_MATS=[['alloy','<i class="bi bi-gear-fill"></i>','Hardened Alloy'],['solution','<i class="bi bi-stars"></i>','Polishing Sol.'],['plans','<i class="bi bi-rulers"></i>','Design Plans'],['amber','<i class="bi bi-circle-fill" style="color:#f5b301"></i>','Lunar Amber']];
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
function cgNum(id){return Math.max(0,Number(document.getElementById(id)?.value)||0);}
function renderGearDB(){
 const m=document.getElementById('chiefGearModal');if(!m)return;
 const b=m.querySelector('.modal-box'),G=WOS_DB.chiefGear,L=G.levels;
 const opts=(sel,ph)=>(ph?`<option value="">${ph}</option>`:'')+L.map((x,i)=>`<option value="${i}" ${i===sel?'selected':''}>${x.name}</option>`).join('');
 const maxRows=L.filter(x=>/^(Green 1★|Blue 3★|Purple 3★|Purple T1 3★|Gold 3★|Gold T1 3★|Gold T2 3★|Red 3★|Red T1 3★|Red T2 3★|Red T3 3★|Red T4 3★|Red T5 3★|Red T6 3★)$/.test(x.name));
 const exName={alloy:'Alloy',solution:'Solution',plans:'Plans',amber:'Amber'};
 b.innerHTML=`<button class="modal-close" onclick="closeModal('chiefGearModal')">×</button>
 <div class="modal-title"><i class="bi bi-shield-fill"></i> Chief Gear Calculator</div>
 <div class="modal-sub">Rencanakan upgrade dari Green sampai Red T6 ★★★: Hardened Alloy, Polishing Solution, Design Plans, Lunar Amber, power, deployment capacity dan SvS points.</div>
 <div class="notice"><i class="bi bi-info-circle-fill"></i> Chief Gear terbuka di Furnace Level 22. Keenam piece memakai jalur biaya yang sama; atur current &amp; target tiap piece di bawah.</div>
 <div class="bc-section"><h3><i class="bi bi-lightning-charge-fill"></i> Quick Select</h3><div class="placeholder-grid">
  <label>Set All Current<select id="cgQuickCur">${opts(-1,'Choose tier…')}</select></label>
  <label>Set All Target<select id="cgQuickTar">${opts(-1,'Choose tier…')}</select></label>
  <label>&nbsp;<button class="mini-btn" id="cgResetAll" type="button">Reset All</button></label>
 </div></div>
 <div class="bc-section"><h3><i class="bi bi-shield-fill"></i> Gear Pieces</h3>${G.pieces.map((p,i)=>`<div class="building-plan cg-piece"><div class="cg-img" id="cgImg${i}" title="Current"></div><div><div class="plan-selects">
  <label>${p.name} <small>(${p.type})</small><select id="cgCur${i}">${opts(cgState.cur[i])}</select></label><span class="arrow">→</span>
  <label>Target<select id="cgTar${i}">${opts(cgState.tar[i])}</select></label></div><div id="cgRow${i}" class="notice"></div></div><div class="cg-img" id="cgImgT${i}" title="Target"></div></div>`).join('')}</div>
 <div class="bc-section"><h3><i class="bi bi-bag-fill"></i> Available Resources</h3><div class="bc-grid">${CG_MATS.map(([k,ic,nm])=>`<label>${ic} ${nm}<input id="cgRes_${k}" type="number" min="0" value="${cgState.res[k]||0}"></label>`).join('')}</div></div>
 <div class="bc-section"><h3><i class="bi bi-arrow-repeat"></i> Enhancement Material Exchange</h3><div id="cgExNote" class="notice"></div><div class="bc-grid">${G.exchange.map((e,i)=>`<label>${exName[e[0]]} » ${exName[e[1]]} <small>(${e[2]}:${e[3]} · limit ${fmt(e[4])}/minggu)</small><input id="cgEx${i}" type="number" min="0" value="${cgState.ex[i]||0}" placeholder="jumlah ${exName[e[0]]} yang ditukar"></label>`).join('')}</div>
  <div class="source-note">Isi jumlah material sumber yang ditukar; hasilnya ditambahkan ke Available Resources. Limit mingguan ditampilkan sesuai WoSTools tetapi tidak dipaksakan di sini.</div></div>
 <div class="bc-section result"><h3><i class="bi bi-bar-chart-fill"></i> Total Summary</h3><div id="cgSummary"></div></div>
 <div class="bc-section"><h3><i class="bi bi-bullseye"></i> Upgrade Efficiency Advisor</h3><div id="cgAdvisor"></div></div>
 <div class="bc-section"><h3><i class="bi bi-graph-up-arrow"></i> Tier Comparison (per piece, max stars)</h3><div class="table-scroll"><table class="db-table"><thead><tr><th>Tier</th><th>Stat Bonus</th><th>Power</th><th>Deploy Cap.</th></tr></thead><tbody>${maxRows.map(x=>`<tr><td>${x.name}</td><td>+${x.stat.toFixed(2)}%</td><td>${fmt(x.power)}</td><td>${x.deploy?'+'+fmt(x.deploy):'—'}</td></tr>`).join('')}</tbody></table></div></div>
 <div class="bc-section"><details><summary><b><i class="bi bi-collection-fill"></i> Full Cost Database (150 tahap per piece)</b></summary><div class="table-scroll"><table class="db-table"><thead><tr><th>Tahap</th><th>Alloy</th><th>Solution</th><th>Plans</th><th>Amber</th><th>Score</th><th>Power</th><th>Stat</th><th>Deploy</th></tr></thead><tbody>${L.slice(1).map(x=>`<tr><td>${x.name}</td><td>${fmt(x.alloy)}</td><td>${fmt(x.solution)}</td><td>${fmt(x.plans)}</td><td>${fmt(x.amber)}</td><td>${fmt(x.svs)}</td><td>${fmt(x.power)}</td><td>+${x.stat.toFixed(2)}%</td><td>${x.deploy?fmt(x.deploy):'—'}</td></tr>`).join('')}</tbody></table></div></details></div>
 <div class="notice"><i class="bi bi-lightbulb-fill"></i> Tips: samakan tier keenam piece untuk set bonus (3 piece = Defense, 6 piece = Attack). Simpan upgrade untuk SvS Prep Day 5 / KoI agar poinnya maksimal. Hardened Alloy dari Polar Terror (Lv.3+) &amp; Beast (Lv.22+); Polishing Solution dari Crazy Joe &amp; Alliance Championship Shop; Design Plans dibutuhkan mulai Blue 2★; Lunar Amber hanya untuk tier Red.</div>
 <div class="source-note">Data biaya, power, stat &amp; deployment: wostools.net/wiki/gear/chief-gear (dicek 2026-09-28). SvS points = Chief Gear Score × ${G.svsPerScore}. Fitur Upgrade Suggestions, Alliance Showdown &amp; export CSV/Excel milik WoSTools belum ada di sini.</div>`;
 const sync=()=>{for(let i=0;i<6;i++){document.getElementById('cgCur'+i).value=cgState.cur[i];document.getElementById('cgTar'+i).value=cgState.tar[i];}};
 for(let i=0;i<6;i++){
  document.getElementById('cgCur'+i).addEventListener('change',e=>{cgState.cur[i]=+e.target.value;calcGearDB();});
  document.getElementById('cgTar'+i).addEventListener('change',e=>{cgState.tar[i]=+e.target.value;calcGearDB();});
 }
 document.getElementById('cgQuickCur').addEventListener('change',e=>{if(e.target.value==='')return;cgState.cur.fill(+e.target.value);sync();e.target.value='';calcGearDB();});
 document.getElementById('cgQuickTar').addEventListener('change',e=>{if(e.target.value==='')return;cgState.tar.fill(+e.target.value);sync();e.target.value='';calcGearDB();});
 document.getElementById('cgResetAll').addEventListener('click',()=>{cgState.cur.fill(0);cgState.tar.fill(CG_DEFAULT_TARGET);cgState.res={alloy:0,solution:0,plans:0,amber:0};cgState.ex.fill(0);cgState.valeria=0;renderGearDB();});
 CG_MATS.forEach(([k])=>document.getElementById('cgRes_'+k).addEventListener('input',calcGearDB));
 G.exchange.forEach((_,i)=>document.getElementById('cgEx'+i).addEventListener('input',calcGearDB));
 calcGearDB();
}
function calcGearDB(){
 const G=WOS_DB.chiefGear,L=G.levels,pieces=G.pieces;
 CG_MATS.forEach(([k])=>cgState.res[k]=cgNum('cgRes_'+k));
 G.exchange.forEach((_,i)=>cgState.ex[i]=Math.floor(cgNum('cgEx'+i)));
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
  if(row)row.innerHTML=ok?`<i class="bi bi-graph-up-arrow"></i> +${(L[eff].stat-L[c].stat).toFixed(2)}% · <i class="bi bi-lightning-charge-fill"></i> +${fmt(L[eff].power-L[c].power)}${L[eff].deploy-L[c].deploy?' · <i class="bi bi-people"></i> +'+fmt(L[eff].deploy-L[c].deploy):''}`:'<i class="bi bi-exclamation-triangle-fill"></i> Target lebih rendah dari current — piece ini diabaikan.';
 });
 // Enhancement Material Exchange (unlocks once any piece is at Gold T2 3★ or higher)
 const unlocked=cgState.cur.some(c=>c>=G.exchangeUnlockLevel);
 const avail=Object.assign({},cgState.res);
 if(unlocked)G.exchange.forEach((e,i)=>{const spent=cgState.ex[i];if(!spent)return;avail[e[0]]-=spent;avail[e[1]]+=Math.floor(spent/e[2])*e[3];});
 const exNote=document.getElementById('cgExNote');
 if(exNote)exNote.innerHTML=unlocked?'<i class="bi bi-check-circle-fill"></i> Exchange terbuka (ada piece di Gold T2 3★ atau lebih tinggi).':'<i class="bi bi-lock-fill"></i> Belum terbuka — upgrade salah satu piece ke Gold T2 3★ (current) untuk membuka Enhancement Material Exchange. Angka tukar di bawah belum berlaku.';
 const card=(n,l,cls)=>`<div class="stat ${cls||''}"><div class="n">${n}</div><div class="l">${l}</div></div>`;
 const need=CG_MATS.map(([k,ic,nm])=>card(fmt(tot[k]),`${ic} ${nm}`)).join('');
 const gap=CG_MATS.map(([k,ic,nm])=>{const left=Math.max(0,tot[k]-avail[k]);return card(fmt(left),`${ic} ${nm}${avail[k]>0?' · tersedia '+fmt(avail[k]):''}`,left===0?'ok':'warn');}).join('');
 const types=Object.entries(byType).map(([tp,v])=>`<h4>${tp}</h4><div class="result-grid">${CG_MATS.map(([k,ic,nm])=>card(fmt(v[k]),`${ic} ${nm}`)).join('')}${card(fmt(v.svs*G.svsPerScore*svsMult),'<i class="bi bi-trophy-fill"></i> SvS')}</div>`).join('');
 const svsPts=tot.svs*G.svsPerScore*svsMult;
 const el=document.getElementById('cgSummary');
 if(el)el.innerHTML=`<h4>Total Materials Required</h4><div class="result-grid">${need}</div>
  <h4>Still Needed (After Available Resources)</h4><div class="result-grid">${gap}</div>
  <h4>By Troop Type</h4>${types}
  <h4>Total Gains</h4>
  <div class="bc-grid"><label>Valeria — Well Prepared (+2%/lvl SvS pts)<select id="cgValeria">${Array.from({length:11},(_,i)=>`<option value="${i}" ${i===valeria?'selected':''}>Lv ${i}</option>`).join('')}</select></label></div>
  <div class="result-grid">${card('+'+fmt(power),'<i class="bi bi-lightning-charge-fill"></i> Power Gain')}${card(fmt(svsPts),'<i class="bi bi-trophy-fill"></i> SvS/KoI Points')}${card(`+${statFrom.toFixed(2)}% → +${statTo.toFixed(2)}%`,`<i class="bi bi-graph-up-arrow"></i> Stat Bonus (+${(statTo-statFrom).toFixed(2)}%)`)}${card('+'+fmt(deploy),'<i class="bi bi-people"></i> Deploy Capacity')}</div>`;
 document.getElementById('cgValeria')?.addEventListener('change',e=>{cgState.valeria=+e.target.value;calcGearDB();});
 // Efficiency advisor: power per material for each piece's next step
 const adv=pieces.map((p,i)=>{const c=cgState.cur[i];if(c>=cgState.tar[i]||c>=L.length-1)return null;const n=L[c+1],mats=n.alloy+n.solution+n.plans+n.amber,gain=n.power-L[c].power;return{p,next:n.name,gain,ratio:mats?gain/mats:0};}).filter(Boolean).sort((a,b)=>b.ratio-a.ratio);
 const ad=document.getElementById('cgAdvisor');
 if(ad)ad.innerHTML=adv.length?`<div class="notice">Piece mana yang memberi power terbanyak per material untuk langkah upgrade berikutnya:</div><div class="result-grid">${adv.map((a,i)=>card(`+${fmt(a.gain)} <i class="bi bi-lightning-charge-fill"></i>`,`#${i+1} ${a.p.name} (${a.p.type}) → ${a.next} · ${a.ratio.toFixed(1)} pwr/mat`)).join('')}</div>`:'<div class="notice">Semua piece sudah mencapai target.</div>';
}


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
const SVS_TIER_LABEL={high:'Nilai Tinggi',medium:'Nilai Sedang',low:'Nilai Rendah'};
let svsDay=0;
let svsValues=SVS_DAYS.map(d=>d.items.map(()=>0));
function renderSVS(){
 const tabs=document.getElementById('svsTabs'), head=document.getElementById('svsDayHead'), list=document.getElementById('svsActivities');
 if(!tabs||!head||!list)return;
 tabs.innerHTML=SVS_DAYS.map((d,i)=>`<button class="svs-tab ${i===svsDay?'active':''}" onclick="setSVSDay(${i})"><b>${d.name}</b><small>${d.theme}</small><em>${fmt(svsDayTotal(i))} pts</em></button>`).join('');
 const d=SVS_DAYS[svsDay]; head.innerHTML=`<div><b>${d.name}: ${d.theme}</b><small>Masukkan jumlah yang direncanakan. Total tersimpan otomatis di browser.</small></div><button class="mini-btn" onclick="resetSVSDay()">Reset Day</button>`;
 list.innerHTML=d.items.map((it,i)=>{const val=svsValues[svsDay][i]||0;const tier=it[3];const tierBadge=tier?`<span class="svs-tier ${tier}">${SVS_TIER_LABEL[tier]}</span>`:'';return `<div class="svs-card"><div><b>${it[0]}</b><small>${fmt(it[1])} pts ${it[2]==='minutes'?'per minute':it[2]==='score'?'per score point':it[2]==='troop'?'per applicable troop (gunakan Import untuk nilai per tier)':''}</small>${tierBadge}</div><div class="stepper"><button onclick="changeSVS(${i},-1)">−</button><input type="number" min="0" value="${val}" oninput="setSVS(${i},this.value)"><button onclick="changeSVS(${i},1)">+</button></div><strong>${fmt(val*it[1])}</strong></div>`}).join('');
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
   const q=Number(document.getElementById('dbTroopQty')?.value)||0; const t=document.getElementById('dbTroopTier')?.value||'T1'; const v=WOS_DB.troops[t]; const pts=q*(v?.svs||0); const idx=SVS_DAYS[3].items.findIndex(x=>x[0]==='Troop Training'); if(idx>=0)svsValues[3][idx]+=q; added+=pts;
 }
 if(type==='charm'||type==='all'){
   const cur=Number(document.getElementById('chCur')?.value||1),tar=Number(document.getElementById('chTar')?.value||1),count=Number(document.getElementById('chCount')?.value)||0; const diff=Math.max(0,tar-cur)*count; const pts=diff*70; const idx=SVS_DAYS[3].items.findIndex(x=>x[0]==='Chief Charm Score');if(idx>=0)svsValues[3][idx]+=diff;added+=pts;
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
 saveSVS(); renderSVS(); alert((type==='all'?'Import All':'Import '+type)+' selesai. '+fmt(added)+' pts berhasil ditambahkan.');
}
