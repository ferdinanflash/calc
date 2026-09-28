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
  const totalMythic = mythicMastery+mythicMilestone;
  const totalPoints = milePoints+widgetPoints;

  const stats=[
    ['Essence Stones', essence.toLocaleString('id-ID')],
    ['Mithril', mithril.toLocaleString('id-ID')],
    ['Mythic Gear', totalMythic.toLocaleString('id-ID')],
    ['Enhance XP (estimated)', Math.round(enhXP).toLocaleString('id-ID')],
    ['Widget', widgetTotal.toLocaleString('id-ID')],
    ['SvS/KOI Points (Mithril+Widget)', totalPoints.toLocaleString('id-ID')],
  ];
  document.getElementById('summary').innerHTML = stats.map(([l,n])=>`<div class="stat"><div class="n">${n}</div><div class="l">${l}</div></div>`).join('');
}


// ---------- MAIN MENU / MODALS ----------
function openModal(id){
  const m=document.getElementById(id);
  if(!m) return;
  m.classList.add('open');
  m.setAttribute('aria-hidden','false');
  document.body.classList.add('modal-open');
  if(id==='buildingModal'){ initBuilding(); }
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
const buildingNames=[
  'Furnace','Infantry Camp','Lancer Camp','Marksman Camp','Embassy','Command Center',
  'Research Center','War Academy','Infirmary','Storehouse',"Hunter's Hut",'Sawmill','Coal Mine','Iron Mine','Barricade'
];
const buildingBase={
  'Furnace':{meat:90000,wood:90000,coal:45000,iron:22000,h:8},
  'Infantry Camp':{meat:65000,wood:65000,coal:32000,iron:16000,h:5},
  'Lancer Camp':{meat:65000,wood:65000,coal:32000,iron:16000,h:5},
  'Marksman Camp':{meat:65000,wood:65000,coal:32000,iron:16000,h:5},
  'Embassy':{meat:70000,wood:70000,coal:35000,iron:17000,h:6},
  'Command Center':{meat:70000,wood:70000,coal:35000,iron:17000,h:6},
  'Research Center':{meat:80000,wood:80000,coal:40000,iron:20000,h:7},
  'War Academy':{meat:85000,wood:85000,coal:42000,iron:21000,h:7},
  'Infirmary':{meat:60000,wood:60000,coal:30000,iron:15000,h:5},
  'Storehouse':{meat:45000,wood:45000,coal:22000,iron:11000,h:4},
  "Hunter's Hut":{meat:35000,wood:35000,coal:17000,iron:8000,h:3},
  'Sawmill':{meat:30000,wood:30000,coal:15000,iron:7000,h:3},
  'Coal Mine':{meat:30000,wood:30000,coal:15000,iron:7000,h:3},
  'Iron Mine':{meat:30000,wood:30000,coal:15000,iron:7000,h:3},
  'Barricade':{meat:25000,wood:25000,coal:12000,iron:6000,h:2}
};
let buildingPlans=[], buildingPlanId=0;

function levelOptions(max=30){
  let s='';
  for(let i=1;i<=max;i++) s+=`<option value="${i}">${i}</option>`;
  for(let i=1;i<=10;i++) s+=`<option value="FC${i}">FC ${i}</option>`;
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
  p[key]=key==='building'?val:(val.startsWith('FC')?val:parseInt(val,10));
  calcBuilding();
}
function renderBuildingPlans(){
  const el=document.getElementById('buildingPlans');
  if(!el)return;
  if(!buildingPlans.length){
    el.innerHTML='<div class="empty-plan">No building plans yet. Click <b>+ Add Building Plan</b>.</div>';
    return;
  }
  el.innerHTML=buildingPlans.map(p=>`
    <div class="building-plan">
      <div class="plan-selects">
        <label>Building<select onchange="updatePlan(${p.id},'building',this.value)">
          ${buildingNames.map(n=>`<option ${n===p.building?'selected':''}>${n}</option>`).join('')}
        </select></label>
        <label>Current Level<select onchange="updatePlan(${p.id},'from',this.value)">${levelOptions().replace(`value="${p.from}"`,`value="${p.from}" selected`)}</select></label>
        <span class="arrow">→</span>
        <label>Target Level<select onchange="updatePlan(${p.id},'to',this.value)">${levelOptions().replace(`value="${p.to}"`,`value="${p.to}" selected`)}</select></label>
        <button class="rm" onclick="removeBuildingPlan(${p.id})">Hapus</button>
      </div>
    </div>`).join('');
}
function valNum(id){return Math.max(0,parseFloat(document.getElementById(id)?.value)||0);}
function calcBuilding(){
  let totals={meat:0,wood:0,coal:0,iron:0,fc:0,rfc:0,hours:0,levels:0};
  buildingPlans.forEach(p=>{
    const b=buildingBase[p.building]||buildingBase.Furnace;
    let from=typeof p.from==='number'?p.from:30, to=typeof p.to==='number'?p.to:30;
    if(typeof p.from==='string') from=30+parseInt(p.from.slice(2)||0);
    if(typeof p.to==='string') to=30+parseInt(p.to.slice(2)||0);
    const steps=Math.max(0,to-from);
    const scale=1+Math.max(0,Math.min(50,(from+to)/2-1))*0.09;
    totals.meat+=b.meat*steps*scale;
    totals.wood+=b.wood*steps*scale;
    totals.coal+=b.coal*steps*scale;
    totals.iron+=b.iron*steps*scale;
    if(to>30){
      const fcSteps=Math.max(0,to-Math.max(30,from));
      totals.fc+=fcSteps*1;
      totals.rfc+=Math.max(0,fcSteps-4);
    }
    totals.hours+=b.h*steps*scale;
    totals.levels+=steps;
  });
  const bonus=valNum('vipBonus')+valNum('researchBonus')+valNum('allianceBonus')+valNum('islandBonus')+valNum('facilityBonus')+valNum('zinmanBonus')+valNum('hyenaBonus')+valNum('vpBonus')+(document.getElementById('mercantilism')?.checked?10:0);
  const speed=Math.max(0,1-bonus/100);
  totals.hours=Math.max(0,totals.hours*speed-valNum('agnesBonus'));
  if(document.getElementById('doubleTime')?.checked) totals.hours*=0.8;

  const available={meat:valNum('resMeat'),wood:valNum('resWood'),coal:valNum('resCoal'),iron:valNum('resIron'),fc:valNum('resFC'),rfc:valNum('resRFC')};
  const names={meat:'🥩 Meat',wood:'🪵 Wood',coal:'🪨 Coal',iron:'⛓️ Iron',fc:'🔥 Fire Crystals',rfc:'💠 Refined FC'};
  let cards=Object.keys(names).map(k=>{
    const need=Math.ceil(totals[k]||0);
    const ok=available[k]>=need;
    return `<div class="stat ${ok?'ok':'warn'}"><div class="n">${need.toLocaleString('id-ID')}</div><div class="l">${names[k]} ${available[k]?'· tersedia '+available[k].toLocaleString('id-ID'):''}</div></div>`;
  }).join('');
  const days=Math.floor(totals.hours/24), remH=totals.hours%24, h=Math.floor(remH), min=Math.round((remH-h)*60);
  cards+=`<div class="stat"><div class="n">${days}d ${h}h ${min}m</div><div class="l">Total Time · ${bonus.toFixed(1)}% speed bonus</div></div>`;
  cards+=`<div class="stat"><div class="n">${totals.levels}</div><div class="l">Upgrade Steps</div></div>`;
  document.getElementById('buildingResult').innerHTML=cards;
}
function initBuilding(){
  if(!buildingPlans.length) addBuildingPlan();
  renderBuildingPlans();
  calcBuilding();
}


// ---------- TROOP TRAINING ----------
const troopTypes=['Infantry','Lancer','Marksman'];
const troopCampsState={};
function troopMode(mode,btn){
  document.querySelectorAll('#troopsModal .mode-btn').forEach(x=>x.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('troopSimple').classList.toggle('hidden',mode!=='simple');
  document.getElementById('troopDetailed').classList.toggle('hidden',mode!=='detailed');
  calcTroops();
}
function troopTierOptions(){return Array.from({length:12},(_,i)=>`<option value="${i+1}">T${i+1}</option>`).join('');}
function renderTroopCamps(){
  document.getElementById('troopCamps').innerHTML=troopTypes.map((t,i)=>`
    <div class="camp-card">
      <div class="camp-head"><b>${t}</b><span>Camp</span></div>
      <div class="bc-grid">
        <label>Camp Level<input id="campLv${i}" type="number" min="1" max="30" value="30" oninput="calcTroops()"></label>
        <label>Mode<select id="campMode${i}" onchange="calcTroops()"><option>Training</option><option>Promotion</option></select></label>
        <label>Tier<select id="campTier${i}" onchange="calcTroops()">${troopTierOptions()}</select></label>
        <label>Troop Count<input id="campCount${i}" type="number" min="0" value="0" oninput="calcTroops()"></label>
        <label>Batch Count<input id="campBatch${i}" type="number" min="1" value="1" oninput="calcTroops()"></label>
      </div>
    </div>`).join('');
}
function calcTroops(){
  let speed=parseFloat(document.getElementById('trSimple')?.value)||0;
  if(!document.getElementById('troopDetailed')?.classList.contains('hidden'))
    document.querySelectorAll('.tr-bonus').forEach(x=>speed+=parseFloat(x.value)||0);
  let total=0, hours=0, meat=0,wood=0,coal=0,iron=0,points=0;
  troopTypes.forEach((t,i)=>{
    const tier=parseInt(document.getElementById('campTier'+i)?.value)||1;
    const count=parseInt(document.getElementById('campCount'+i)?.value)||0;
    const batch=parseInt(document.getElementById('campBatch'+i)?.value)||1;
    const mode=document.getElementById('campMode'+i)?.value||'Training';
    const baseTime=1.2*Math.pow(1.16,tier-1);
    const cost=150*Math.pow(1.18,tier-1);
    const per=count*batch;
    total+=per;
    hours+=per*baseTime/60/(1+speed/100);
    meat+=per*cost*.25; wood+=per*cost*.25; coal+=per*cost*.25; iron+=per*cost*.25;
    points+=per*tier*10*(mode==='Promotion'?.65:1);
  });
  const available={meat:+document.getElementById('trMeat')?.value||0,wood:+document.getElementById('trWood')?.value||0,coal:+document.getElementById('trCoal')?.value||0,iron:+document.getElementById('trIron')?.value||0};
  const vals={meat,wood,coal,iron};
  let cards=Object.entries(vals).map(([k,v])=>`<div class="stat ${available[k]>=v?'ok':'warn'}"><div class="n">${Math.ceil(v).toLocaleString('id-ID')}</div><div class="l">${k[0].toUpperCase()+k.slice(1)}</div></div>`).join('');
  cards+=`<div class="stat"><div class="n">${total.toLocaleString('id-ID')}</div><div class="l">Troops</div></div><div class="stat"><div class="n">${hours.toFixed(1)}h</div><div class="l">Training Time · ${speed.toFixed(1)}%</div></div><div class="stat"><div class="n">${Math.round(points).toLocaleString('id-ID')}</div><div class="l">Event Points</div></div>`;
  document.getElementById('troopResult').innerHTML=cards;
}

// ---------- WAR ACADEMY ----------
const academyBranches={Infantry:['Flame Squad','Flame Shield','Flame Strike','Flame Tomahawk','Flame Protection','Flame Legion','Helios Infantry','Helios Infantry Training','Helios Infantry Healing','Helios Infantry First Aid'],Lancer:['Flame Squad','Flame Shield','Flame Strike','Flame Tomahawk','Flame Protection','Flame Legion','Helios Lancer','Helios Lancer Training','Helios Lancer Healing','Helios Lancer First Aid'],Marksman:['Flame Squad','Crystal Armor','Crystal Vision','Crystal Arrow','Crystal Protection','Flame Legion','Helios Marksman','Helios Marksman Training','Helios Marksman Healing','Helios Marksman First Aid']};
function renderAcademy(){
  document.getElementById('academyBranches').innerHTML=Object.entries(academyBranches).map(([type,arr])=>`<div class="research-card"><div class="camp-head"><b>${type}</b><span>Helios</span></div>${arr.map((n,j)=>`<div class="research-row"><span>${n}</span><select id="wa_${type}_${j}_c" onchange="calcAcademy()">${Array.from({length:j>=6?(j===6?2:11):13},(_,k)=>`<option>${k}</option>`).join('')}</select><span>→</span><select id="wa_${type}_${j}_t" onchange="calcAcademy()">${Array.from({length:j>=6?(j===6?2:11):13},(_,k)=>`<option>${k}</option>`).join('')}</select></div>`).join('')}</div>`).join('');
}
function calcAcademy(){
  let levels=0; Object.keys(academyBranches).forEach(t=>academyBranches[t].forEach((_,j)=>{levels+=Math.max(0,(+document.getElementById(`wa_${t}_${j}_t`)?.value||0)-(+document.getElementById(`wa_${t}_${j}_c`)?.value||0));}));
  const speed=(+document.getElementById('waSpeed')?.value||0)+(+document.getElementById('waState')?.value||0)+(+document.getElementById('waVP')?.value||0);
  const shards=levels*120, steel=levels*80, rfc=levels>25?Math.floor(levels/5):0, hours=levels*6/(1+speed/100);
  const cards=`<div class="stat"><div class="n">${shards.toLocaleString('id-ID')}</div><div class="l">FC Shards</div></div><div class="stat"><div class="n">${steel.toLocaleString('id-ID')}</div><div class="l">Refined Steel</div></div><div class="stat"><div class="n">${rfc.toLocaleString('id-ID')}</div><div class="l">Refined FC</div></div><div class="stat"><div class="n">${hours.toFixed(1)}h</div><div class="l">Research Time · ${speed}%</div></div><div class="stat"><div class="n">${levels}</div><div class="l">Research Levels</div></div>`;
  document.getElementById('academyResult').innerHTML=cards;
}

// ---------- CHIEF CHARMS ----------
const charmPieces=['Helmet','Watch','Jacket','Pants','Ring','Cane'];
function charmSelect(id,def=1){return `<select id="${id}" onchange="calcCharms()">${Array.from({length:16},(_,i)=>`<option ${i+1===def?'selected':''}>${i+1}</option>`).join('')}</select>`;}
function renderCharms(){
  document.getElementById('charmPieces').innerHTML=charmPieces.map((p,i)=>`<div class="charm-card"><b>${p}</b><small>${i<2?'Lancer':i<4?'Infantry':'Marksman'} · 3 slots</small>${[0,1,2].map(s=>`<div class="charm-row"><span>Charm ${s+1}</span>${charmSelect(`ch_${i}_${s}_c`)}<span>→</span>${charmSelect(`ch_${i}_${s}_t`,1)}</div>`).join('')}</div>`).join('');
}
function calcCharms(){
  let steps=0; charmPieces.forEach((_,i)=>[0,1,2].forEach(s=>{steps+=Math.max(0,(+document.getElementById(`ch_${i}_${s}_t`)?.value||1)-(+document.getElementById(`ch_${i}_${s}_c`)?.value||1));}));
  const guides=steps*20, designs=steps*10, secrets=steps*3;
  document.getElementById('charmResult').innerHTML=`<div class="stat"><div class="n">${guides}</div><div class="l">Charm Guides</div></div><div class="stat"><div class="n">${designs}</div><div class="l">Charm Designs</div></div><div class="stat"><div class="n">${secrets}</div><div class="l">Jewel Secrets</div></div><div class="stat"><div class="n">${steps*100}</div><div class="l">Estimated SvS / KoI Points</div></div>`;
}
function setAllCharms(level){charmPieces.forEach((_,i)=>[0,1,2].forEach(s=>{document.getElementById(`ch_${i}_${s}_c`).value=level;document.getElementById(`ch_${i}_${s}_t`).value=level;}));calcCharms();}
function resetCharms(){renderCharms();calcCharms();}
function charmSuggestion(type){document.getElementById('charmSuggestion').textContent=type==='stats'?'Suggestions will prioritize upgrades with the most efficient stat gains based on available resources.':'Suggestions will prioritize upgrades that generate the highest event points.';}

// ---------- CHIEF GEAR ----------
const gearPieces=['Helmet','Watch','Jacket','Pants','Ring','Cane'];
const gearRanks=['Green 0★','Green 1★','Green 2★','Green 3★','Blue 0★','Blue 1★','Blue 2★','Blue 3★','Purple 0★','Purple 1★','Purple 2★','Purple 3★','Gold 0★','Gold 1★','Gold 2★','Gold 3★','Gold T1 0★','Gold T1 1★','Gold T1 2★','Gold T1 3★','Gold T2 0★','Gold T2 1★','Gold T2 2★','Gold T2 3★','Red T1 0★','Red T1 1★','Red T1 2★','Red T1 3★','Red T2 0★','Red T2 1★','Red T2 2★','Red T2 3★','Red T3 0★','Red T3 1★','Red T3 2★','Red T3 3★','Red T4 0★','Red T4 1★','Red T4 2★','Red T4 3★'];
function gearOptions(sel){return gearRanks.map(x=>`<option ${x===sel?'selected':''}>${x}</option>`).join('');}
function renderChiefGear(){
  document.getElementById('chiefGearPieces').innerHTML=gearPieces.map((p,i)=>`<div class="gear-card"><div class="camp-head"><b>${p}</b><span>${i<2?'Lancer':i<4?'Infantry':'Marksman'}</span></div><div class="gear-row"><select id="cg_${i}_c" onchange="calcChiefGear()">${gearOptions('Green 0★')}</select><span>→</span><select id="cg_${i}_t" onchange="calcChiefGear()">${gearOptions('Green 0★')}</select></div></div>`).join('');
}
function calcChiefGear(){
  let steps=0; gearPieces.forEach((_,i)=>steps+=Math.max(0,gearRanks.indexOf(document.getElementById(`cg_${i}_t`)?.value||'Green 0★')-gearRanks.indexOf(document.getElementById(`cg_${i}_c`)?.value||'Green 0★')));
  const alloy=steps*25000, polish=steps*280, plans=steps*55, amber=steps>20?Math.floor(steps/20)*10:0;
  document.getElementById('gearResult').innerHTML=`<div class="stat"><div class="n">${alloy.toLocaleString('id-ID')}</div><div class="l">Hardened Alloy</div></div><div class="stat"><div class="n">${polish.toLocaleString('id-ID')}</div><div class="l">Polishing Solution</div></div><div class="stat"><div class="n">${plans.toLocaleString('id-ID')}</div><div class="l">Design Plans</div></div><div class="stat"><div class="n">${amber.toLocaleString('id-ID')}</div><div class="l">Lunar Amber</div></div><div class="stat"><div class="n">${(steps*3000).toLocaleString('id-ID')}</div><div class="l">Estimated SvS Points</div></div>`;
}
function setAllGear(current,target){gearPieces.forEach((_,i)=>{document.getElementById(`cg_${i}_c`).value=current;document.getElementById(`cg_${i}_t`).value=target;});calcChiefGear();}
function resetChiefGear(){renderChiefGear();calcChiefGear();}

// Extend modal initializer.
const _openModal=openModal;
openModal=function(id){
  _openModal(id);
  if(id==='troopsModal'){renderTroopCamps();calcTroops();}
  if(id==='warAcademyModal'){renderAcademy();calcAcademy();}
  if(id==='charmModal'){renderCharms();calcCharms();}
  if(id==='chiefGearModal'){renderChiefGear();calcChiefGear();}
};

// seed existing Hero Gear calculator, but it now opens inside a modal
addPiece('infantry','goggles');
addWidget();


// ---------- TRAINING TROOPS ----------
const troopTiers=[
[36,27,7,2,12,90,3,1,3],[58,44,10,3,17,120,4,2,4],[92,69,17,4,24,180,5,3,6],
[120,90,21,5,32,265,8,5,9],[156,117,27,6,44,385,12,7,13],[186,140,33,7,60,595,18,11,20],
[279,210,49,11,83,830,25,16,28],[558,419,98,21,113,1130,35,23,38],[1394,1046,244,51,131,1485,45,30,50],
[2788,2091,488,102,152,1960,60,39,66],[5576,4182,976,204,304,3920,120,78,132],[11152,8364,1952,408,608,7840,240,156,264]
];
function initTroops(){
  const s=document.getElementById('ttTier'); if(!s)return;
  s.innerHTML=troopTiers.map((_,i)=>`<option value="${i+1}">T${i+1}</option>`).join('');
  calcTroops();
}
function calcTroops(){
  const t=(+document.getElementById('ttTier')?.value||10)-1,q=Math.max(0,+document.getElementById('ttQty')?.value||0);
  const mode=document.getElementById('ttMode')?.value||'train', speed=+document.getElementById('ttSpeed')?.value||0, queues=Math.max(1,+document.getElementById('ttQueues')?.value||1);
  let d=troopTiers[t]||troopTiers[0], factor=1;
  if(mode==='promote') factor=.5;
  const vals={meat:d[0]*q*factor,wood:d[1]*q*factor,coal:d[2]*q*factor,iron:d[3]*q*factor,time:d[4]*q*factor/(1+speed/100)/queues,hog:d[5]*q*factor,svs:d[6]*q*factor,koi:d[7]*q*factor,power:d[8]*q*factor};
  const fmt=n=>Math.round(n).toLocaleString('id-ID');
  const gap=(id,n)=>Math.max(0,n-(+document.getElementById(id)?.value||0));
  const cards=[
    ['n',fmt(vals.meat),'🥩 Meat'],['n',fmt(vals.wood),'🪵 Wood'],['n',fmt(vals.coal),'🪨 Coal'],['n',fmt(vals.iron),'⛓️ Iron'],
    ['n',fmt(vals.hog),'🏆 HoG'],['n',fmt(vals.svs),'⚔️ SvS'],['n',fmt(vals.koi),'👑 KoI'],['n',fmt(vals.power),'⚡ Power'],
    ['n',formatDuration(vals.time),'⏱️ Time']
  ];
  document.getElementById('troopResult').innerHTML=cards.map(x=>`<div class="stat"><div class="${x[0]}">${x[1]}</div><div class="l">${x[2]}</div></div>`).join('');
}
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
  el.innerHTML=Object.entries(waBranches).map(([type,items])=>`<div class="bc-section"><h3>🔥 ${type}</h3><div class="research-list">${items.map((n,i)=>`<div class="research-row"><span>${n}<small> max ${i<6?[5,8,8,12,12,12][i]:i===6?1:10}</small></span><select onchange="waLevels.${type}[${i}]=+this.value;calcWarAcademy()">${Array.from({length:(i<6?[5,8,8,12,12,12][i]:i===6?1:10)+1},(_,x)=>`<option value="${x}">${x}</option>`).join('')}</select><span>→</span><select onchange="waLevels.${type}[${i}]=Math.max(waLevels.${type}[${i}],+this.value);calcWarAcademy()">${Array.from({length:(i<6?[5,8,8,12,12,12][i]:i===6?1:10)+1},(_,x)=>`<option value="${x}">${x}</option>`).join('')}</select></div>`).join('')}</div></div>`).join('');
  calcWarAcademy();
}
function waSetAll(v){Object.keys(waLevels).forEach(k=>waLevels[k]=waLevels[k].map((_,i)=>i===6?1:Math.min(v,i<6?[5,8,8,12,12,12][i]:10)));initWarAcademy();}
function calcWarAcademy(){
  let lv=0;Object.values(waLevels).forEach(a=>a.forEach(v=>lv+=v));
  const speed=1+(+document.getElementById('waSpeed')?.value||0)/100+(+document.getElementById('waState')?.value||0)/100+(+document.getElementById('waVP')?.value||0)/100;
  const shards=lv*1250,steel=lv*250,meat=lv*100000,wood=lv*100000,coal=lv*50000,iron=lv*25000,time=lv*7200/speed;
  const fmt=n=>Math.round(n).toLocaleString('id-ID');
  document.getElementById('waResult').innerHTML=[
    ['n',fmt(shards),'🔥 FC Shards'],['n',fmt(steel),'⚙️ Steel'],['n',fmt(meat),'🥩 Meat'],['n',fmt(wood),'🪵 Wood'],
    ['n',fmt(coal),'🪨 Coal'],['n',fmt(iron),'⛓️ Iron'],['n',formatDuration(time),'⏱️ Research Time'],['n',fmt(lv),'📈 Research Levels']
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
 ['n',fmt(g),'📘 Charm Guides'],['n',fmt(d),'📗 Charm Designs'],['n',fmt(s),'💎 Jewel Secrets'],['n',fmt(ups),'⬆️ Charm Levels'],
 ['n',fmt(power),'⚡ Power / Event Units']
 ].map(x=>`<div class="stat"><div class="n">${x[1]}</div><div class="l">${x[2]}</div></div>`).join('');
}

// ---------- CHIEF GEAR ----------
const gearPieces=['Helmet','Watch','Jacket','Pants','Ring','Cane'];
const gearLevels=[['Green 0★','Green 1★','Green 2★','Green 3★'],['Blue 0★','Blue 1★','Blue 2★','Blue 3★'],['Purple 0★','Purple 1★','Purple 2★','Purple 3★'],['Gold 0★','Gold 1★','Gold 2★','Gold 3★'],['Gold T1 0★','Gold T1 1★','Gold T1 2★','Gold T1 3★'],['Gold T2 0★','Gold T2 1★','Gold T2 2★','Gold T2 3★'],['Red 0★','Red 1★','Red 2★','Red 3★'],['Red T1 0★','Red T1 1★','Red T1 2★','Red T1 3★'],['Red T2 0★','Red T2 1★','Red T2 2★','Red T2 3★'],['Red T3 0★','Red T3 1★','Red T3 2★','Red T3 3★']];
let gearVals=gearPieces.map(()=>({c:0,t:9}));
function initGear(){
 const el=document.getElementById('gearRows');if(!el)return;
 el.innerHTML=gearPieces.map((name,i)=>`<div class="building-plan"><div class="plan-selects"><label>${name}<select onchange="gearVals[${i}].c=+this.value;calcGear()">${gearLevels.map((x,j)=>`<option value="${j}">${x}</option>`).join('')}</select></label><span class="arrow">→</span><label>Target<select onchange="gearVals[${i}].t=+this.value;calcGear()">${gearLevels.map((x,j)=>`<option value="${j}" ${j===9?'selected':''}>${x}</option>`).join('')}</select></label><span class="arrow">📈</span><span class="stat"><b>+${(gearVals[i].t-gearVals[i].c)*25}%</b></span></div></div>`).join('');
 calcGear();
}
function gearSetAll(v){gearVals.forEach(x=>x.t=9);initGear();}
function gearReset(){gearVals=gearPieces.map(()=>({c:0,t:0}));initGear();}
function calcGear(){
 let steps=0;gearVals.forEach(x=>steps+=Math.max(0,x.t-x.c));
 const alloy=steps*612000,polish=steps*6900,plans=steps*1350,amber=steps*112, power=steps*3672000/4,svs=steps*3323520;
 const fmt=n=>Math.round(n).toLocaleString('id-ID');
 document.getElementById('gearResult').innerHTML=[
 ['n',fmt(alloy),'⚙️ Hardened Alloy'],['n',fmt(polish),'🧪 Polishing Solution'],['n',fmt(plans),'📜 Design Plans'],['n',fmt(amber),'🌙 Lunar Amber'],
 ['n',fmt(power),'⚡ Power Gain'],['n',fmt(svs),'🏆 SvS / KoI Points'],['n',fmt(steps),'⬆️ Upgrade Steps']
 ].map(x=>`<div class="stat"><div class="n">${x[1]}</div><div class="l">${x[2]}</div></div>`).join('');
}

// Initialize modal calculators when opened
const _openModal=openModal;
openModal=function(id){
 _openModal(id);
 if(id==='troopsModal') initTroops();
 if(id==='warAcademyModal') initWarAcademy();
 if(id==='charmModal') initCharms();
 if(id==='chiefGearModal') initGear();
};

// ---------- VERIFIED DATABASE CALCULATORS ----------
const _openModalLegacy = window.openModal;
function fmt(n){return Number(n||0).toLocaleString('id-ID');}
function secondsText(s){s=Math.max(0,Math.round(s||0));const d=Math.floor(s/86400);s%=86400;const h=Math.floor(s/3600);s%=3600;const m=Math.floor(s/60);const sec=s%60;return (d?d+'d ':'')+(h?h+'h ':'')+(m?m+'m ':'')+(sec?sec+'s':'').trim()||'0s';}
function tierOpts(){return Object.keys(WOS_DB.troops).map(t=>`<option value="${t}">${t}</option>`).join('');}
function renderTroopDB(){
 const m=document.getElementById('troopsModal'); if(!m)return;
 const b=m.querySelector('.modal-box');
 b.innerHTML=`<button class="modal-close" onclick="closeModal('troopsModal')">×</button>
 <div class="modal-title">⚔️ Training Troops Calculator</div><div class="modal-sub">T1–T12 cost database + training, promotion, time, power, and event points.</div>
 <div class="bc-section"><div class="placeholder-grid">
 <label>Troop Type<select id="dbTroopType"><option>Infantry</option><option>Lancer</option><option>Marksman</option></select></label>
 <label>Mode<select id="dbTroopMode"><option value="train">Training</option><option value="promote">Promotion</option></select></label>
 <label>Target Tier<select id="dbTroopTier">${tierOpts()}</select></label>
 <label>From Tier<select id="dbTroopFrom">${tierOpts()}</select></label>
 <label>Quantity<input id="dbTroopQty" type="number" min="0" value="100000"></label>
 <label>Training Speed %<input id="dbTroopSpeed" type="number" min="0" value="0"></label>
 </div></div>
 <div class="bc-section"><h3>📊 Calculation</h3><div id="dbTroopResult" class="result-grid"></div></div>
 <div class="bc-section"><h3>📚 Database T1–T12</h3><div class="table-scroll"><table class="db-table"><thead><tr><th>Tier</th><th>Meat</th><th>Wood</th><th>Coal</th><th>Iron</th><th>Time</th><th>HoC</th><th>SvS</th><th>KoI</th></tr></thead><tbody>${Object.entries(WOS_DB.troops).map(([t,v])=>`<tr><td>${t}</td><td>${fmt(v.meat)}</td><td>${fmt(v.wood)}</td><td>${fmt(v.coal)}</td><td>${fmt(v.iron)}</td><td>${secondsText(v.seconds)}</td><td>${fmt(v.hoc)}</td><td>${fmt(v.svs)}</td><td>${fmt(v.koi)}</td></tr>`).join('')}</tbody></table></div></div>`;
 ['dbTroopMode','dbTroopTier','dbTroopFrom','dbTroopQty','dbTroopSpeed'].forEach(id=>document.getElementById(id)?.addEventListener('input',calcTroopDB));
 calcTroopDB();
}
function calcTroopDB(){
 const target=document.getElementById('dbTroopTier')?.value||'T1', from=document.getElementById('dbTroopFrom')?.value||'T1';
 const qty=Math.max(0,Number(document.getElementById('dbTroopQty')?.value)||0), speed=Math.max(0,Number(document.getElementById('dbTroopSpeed')?.value)||0), mode=document.getElementById('dbTroopMode')?.value||'train';
 let v=WOS_DB.troops[target], src=WOS_DB.troops[from], factor=1;
 if(mode==='promote'){
   const tiers=Object.keys(WOS_DB.troops), a=tiers.indexOf(from), z=tiers.indexOf(target); factor=Math.max(0,z-a);
   if(a>=z){factor=0;} else if(target==='T12' && from==='T11') factor=1;
 }
 const c=mode==='promote'&&target==='T12'&&from==='T11'?v.promotion:v;
 const time=(mode==='promote'&&target==='T12'&&from==='T11'?v.promotion.seconds:v.seconds)*qty/(1+speed/100);
 const points=mode==='promote'?Math.max(0,(v.svs||0)-(src?.svs||0)):v.svs;
 const cards=[['🥩 Meat',c.meat*qty],['🪵 Wood',c.wood*qty],['🪨 Coal',c.coal*qty],['⛓️ Iron',c.iron*qty],['⏱️ Time',secondsText(time)],['⚡ Power',v.power*qty],['🏆 SvS',points*qty],['🏛️ HoC', (mode==='promote'?Math.max(0,v.hoc-(src?.hoc||0)):v.hoc)*qty],['❄️ KoI',(mode==='promote'?Math.max(0,v.koi-(src?.koi||0)):v.koi)*qty]];
 const el=document.getElementById('dbTroopResult'); if(el)el.innerHTML=cards.map(x=>`<div class="stat"><div class="n">${typeof x[1]==='string'?x[1]:fmt(x[1])}</div><div class="l">${x[0]}</div></div>`).join('');
}
function renderWarAcademyDB(){
 const m=document.getElementById('warAcademyModal'); if(!m)return; const b=m.querySelector('.modal-box');
 const rows=WOS_DB.warAcademy.helios.verifiedRows;
 b.innerHTML=`<button class="modal-close" onclick="closeModal('warAcademyModal')">×</button><div class="modal-title">🎓 War Academy</div><div class="modal-sub">Helios/T12 research database. All three troop branches use separate research structures.</div>
 <div class="bc-section"><div class="placeholder-grid"><label>Branch<select id="waBranch"><option>Infantry</option><option>Lancer</option><option>Marksman</option></select></label><label>Research Speed %<input id="waSpeed" type="number" min="0" value="0"></label><label>FC Shards<input id="waShardInv" type="number" min="0" value="0"></label><label>Steel<input id="waSteelInv" type="number" min="0" value="0"></label><label>Refined FC<input id="waRfcInv" type="number" min="0" value="0"></label></div></div>
 <div class="bc-section"><h3>🔥 Research Structure</h3><div class="research-tree">${WOS_DB.warAcademy.helios.common.map(x=>`<div class="tree-item"><b>${x[0]}</b><span>max ${x[1]}</span></div>`).join('')}</div><div class="notice">T11 unlocks after completing the Helios path. T12 uses 5 Exalted tracks + Molten I/II/III + Solar Supremacy + Training/Healing/First Aid.</div></div>
 <div class="bc-section"><h3>📋 Verified Cost Rows</h3><div class="table-scroll"><table class="db-table"><thead><tr><th>Track</th><th>Lv</th><th>Meat</th><th>Wood</th><th>Coal</th><th>Iron</th><th>Steel</th><th>FC Shards</th><th>RFC</th><th>Time</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r.track}</td><td>${r.level}</td><td>${fmt(r.meat)}</td><td>${fmt(r.wood)}</td><td>${fmt(r.coal)}</td><td>${fmt(r.iron)}</td><td>${fmt(r.steel)}</td><td>${fmt(r.shards)}</td><td>${fmt(r.refinedFC)}</td><td>${secondsText(r.seconds)}</td></tr>`).join('')}</tbody></table></div></div>
 <div class="bc-section"><h3>🔥 T12 Structure</h3><div class="result-grid"><div class="stat"><div class="n">5</div><div class="l">Exalted tracks</div></div><div class="stat"><div class="n">20</div><div class="l">Molten I / track</div></div><div class="stat"><div class="n">50</div><div class="l">Molten II / track</div></div><div class="stat"><div class="n">15</div><div class="l">Solar Supremacy</div></div><div class="stat"><div class="n">50</div><div class="l">Molten III / track</div></div></div></div>`;
}
function renderCharmDB(){
 const m=document.getElementById('charmModal'); if(!m)return; const b=m.querySelector('.modal-box');
 b.innerHTML=`<button class="modal-close" onclick="closeModal('charmModal')">×</button><div class="modal-title">💎 Chief Charm</div><div class="modal-sub">18-slot database — 3 charms per each of 6 gear pieces. Levels 1–18.</div>
 <div class="bc-section"><div class="placeholder-grid"><label>Current Level<select id="chCur">${Object.keys(WOS_DB.charmLevels).map(x=>`<option>${x}</option>`).join('')}</select></label><label>Target Level<select id="chTar">${Object.keys(WOS_DB.charmLevels).map(x=>`<option>${x}</option>`).join('')}</select></label><label>Number of Charms<input id="chCount" type="number" min="1" max="18" value="18"></label><label>Guides Available<input id="chG" type="number" min="0" value="0"></label><label>Designs Available<input id="chD" type="number" min="0" value="0"></label><label>Secrets Available<input id="chS" type="number" min="0" value="0"></label></div></div>
 <div class="bc-section"><h3>📊 Upgrade Summary</h3><div id="chResult" class="result-grid"></div></div>
 <div class="bc-section"><h3>🧩 18 Slots</h3><div class="charm-slots">${WOS_DB.chiefCharmsPieces.flatMap(p=>[1,2,3].map(i=>`<div class="tree-item"><b>${p.name} #${i}</b><span>${p.type}</span></div>`)).join('')}</div></div>
 <div class="bc-section"><h3>📚 Cost Database</h3><div class="table-scroll"><table class="db-table"><thead><tr><th>Level</th><th>Guides</th><th>Designs</th><th>Secrets</th></tr></thead><tbody>${Object.entries(WOS_DB.charmLevels).map(([l,v])=>`<tr><td>${l}</td><td>${fmt(v.guides)}</td><td>${fmt(v.designs)}</td><td>${fmt(v.secrets)}</td></tr>`).join('')}</tbody></table></div><div class="source-note">Levels 17/18 use the latest data listed in the public source; sub-levels follow the game's upgrade structure.</div></div>`;
 ['chCur','chTar','chCount','chG','chD','chS'].forEach(id=>document.getElementById(id)?.addEventListener('input',calcCharmDB)); calcCharmDB();
}
function calcCharmDB(){
 const cur=Number(document.getElementById('chCur')?.value||1), tar=Number(document.getElementById('chTar')?.value||1), count=Math.max(1,Number(document.getElementById('chCount')?.value)||1); let g=0,d=0,s=0;
 if(tar>cur)for(let l=cur+1;l<=tar;l++){const v=WOS_DB.charmLevels[l];g+=v.guides;d+=v.designs;s+=v.secrets;}
 g*=count;d*=count;s*=count;const invG=Number(document.getElementById('chG')?.value)||0,invD=Number(document.getElementById('chD')?.value)||0,invS=Number(document.getElementById('chS')?.value)||0;
 const cards=[['📗 Guides',g],['📜 Designs',d],['💎 Secrets',s],['📗 Still needed',Math.max(0,g-invG)],['📜 Still needed',Math.max(0,d-invD)],['💎 Still needed',Math.max(0,s-invS)],['🏆 SvS',Math.max(0,tar-cur)*count*WOS_DB.charmRules.pointsPerLevel]];
 const el=document.getElementById('chResult');if(el)el.innerHTML=cards.map(x=>`<div class="stat"><div class="n">${fmt(x[1])}</div><div class="l">${x[0]}</div></div>`).join('');
}
function renderGearDB(){
 const m=document.getElementById('chiefGearModal');if(!m)return;const b=m.querySelector('.modal-box');
 const steps=WOS_DB.chiefGearSteps;
 b.innerHTML=`<button class="modal-close" onclick="closeModal('chiefGearModal')">×</button><div class="modal-title">🛡️ Chief Gear</div><div class="modal-sub">6 gear pieces with a material database for each step. All 6 pieces use the same cost path.</div>
 <div class="bc-section"><div class="placeholder-grid"><label>Current Stage<select id="cgCur">${steps.map((x,i)=>`<option value="${i}">${x.stage}</option>`).join('')}<option value="999">Red T6 ★★★</option></select></label><label>Target Stage<select id="cgTar">${steps.map((x,i)=>`<option value="${i}">${x.stage}</option>`).join('')}<option value="999">Red T6 ★★★</option></select></label><label>Pieces<input id="cgPieces" type="number" min="1" max="6" value="6"></label><label>Alloy Available<input id="cgA" type="number" min="0" value="0"></label><label>Solution Available<input id="cgS" type="number" min="0" value="0"></label><label>Plans Available<input id="cgP" type="number" min="0" value="0"></label><label>Amber Available<input id="cgL" type="number" min="0" value="0"></label></div></div>
 <div class="bc-section"><h3>📊 Upgrade Summary</h3><div id="cgResult" class="result-grid"></div></div>
 <div class="bc-section"><h3>🛡️ 6 Pieces</h3><div class="charm-slots">${WOS_DB.chiefGearPieces.map(p=>`<div class="tree-item"><b>${p.name}</b><span>${p.type}</span></div>`).join('')}</div></div>
 <div class="bc-section"><h3>📚 Verified Cost Database</h3><div class="table-scroll"><table class="db-table"><thead><tr><th>Stage</th><th>Alloy</th><th>Solution</th><th>Plans</th><th>Amber</th><th>SvS</th></tr></thead><tbody>${steps.map(x=>`<tr><td>${x.stage}</td><td>${fmt(x.alloy)}</td><td>${fmt(x.solution)}</td><td>${fmt(x.plans)}</td><td>${fmt(x.amber)}</td><td>${fmt(x.svs)}</td></tr>`).join('')}</tbody></table></div><div class="notice">Current public WoSTools data also publishes the complete aggregate for all 6 pieces to Red T6 ★★★: 25,863,000 Alloy · 272,160 Solution · 48,240 Plans · 6,000 Amber.</div></div>`;
 ['cgCur','cgTar','cgPieces','cgA','cgS','cgP','cgL'].forEach(id=>document.getElementById(id)?.addEventListener('input',calcGearDB));calcGearDB();
}
function calcGearDB(){
 const cur=Number(document.getElementById('cgCur')?.value||0),tar=Number(document.getElementById('cgTar')?.value||0),pieces=Math.max(1,Number(document.getElementById('cgPieces')?.value)||1);let a=0,s=0,p=0,l=0,svs=0;
 if(tar>cur){for(let i=cur+1;i<=Math.min(tar,WOS_DB.chiefGearSteps.length-1);i++){const v=WOS_DB.chiefGearSteps[i];a+=v.alloy;s+=v.solution;p+=v.plans;l+=v.amber;svs+=v.svs;} if(tar===999){const t=WOS_DB.chiefGearTotals.all6ToRedT6;a=Math.max(0,t.alloy-a*6);s=Math.max(0,t.solution-s*6);p=Math.max(0,t.plans-p*6);l=Math.max(0,t.amber-l*6);a+=t.alloy/6*0; /* aggregate endpoint */}}
 a*=pieces;s*=pieces;p*=pieces;l*=pieces;const inv=[Number(document.getElementById('cgA')?.value)||0,Number(document.getElementById('cgS')?.value)||0,Number(document.getElementById('cgP')?.value)||0,Number(document.getElementById('cgL')?.value)||0];
 const cards=[['⚙️ Alloy',a],['✨ Solution',s],['📐 Plans',p],['🟡 Amber',l],['⚙️ Still needed',Math.max(0,a-inv[0])],['✨ Still needed',Math.max(0,s-inv[1])],['📐 Still needed',Math.max(0,p-inv[2])],['🟡 Still needed',Math.max(0,l-inv[3])]];
 const el=document.getElementById('cgResult');if(el)el.innerHTML=cards.map(x=>`<div class="stat"><div class="n">${fmt(x[1])}</div><div class="l">${x[0]}</div></div>`).join('');
}
window.openModal=function(id){_openModalLegacy(id);if(id==='troopsModal')renderTroopDB();if(id==='warAcademyModal')renderWarAcademyDB();if(id==='charmModal')renderCharmDB();if(id==='chiefGearModal')renderGearDB();};
