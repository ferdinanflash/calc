// Hero Gear calculator (data models, icons, render)

// ---------- DATA MODELS (best-effort, see notice on page) ----------

// Mastery Forging: cumulative Essence Stones & Mythics up to level L (0-20)
function masteryEssence(L){ return 5*L*(L+1); } // 10+20+...+10L
function masteryMythic(L){ return L<=10?0:((L-10)*(L-9))/2; }

// Enhance track: XP needed to go from level n-1 to n (levels 1-200).
// 1-100 (Mythic): key points from game data, linear in between (approximate);
//   91-100 follows a +50/level ramp ending at 2400 (matches the known 92->101 total of 17,800).
// 101 = Ascension (0 XP, 2 Mythic). 102-199: exact ranges; 120/140/160/180/200 = Mithril milestones (0 XP).
const enhKeyPts=[[1,10],[10,55],[20,105],[30,160],[40,280],[50,470],[60,730],[70,1040],[80,1400],[90,1810]];
function enhLevelXP(n){
  if(n<1||n>200) return 0;
  if(n<=90){
    for(let i=0;i<enhKeyPts.length-1;i++){
      const [l1,v1]=enhKeyPts[i],[l2,v2]=enhKeyPts[i+1];
      if(n>=l1&&n<=l2) return Math.round(v1+(v2-v1)*(n-l1)/(l2-l1));
    }
  }
  if(n<=100) return 2400-(100-n)*50;
  if(n===101||n%20===0) return 0;
  if(n<=119) return 2500+50*(n-102);
  if(n<=139) return 3500+50*(n-121);
  if(n<=159) return 4450+50*(n-141);
  if(n<=179) return 5500+100*(n-161);
  return 7500+100*(n-181);
}
const ENH_CUM=[0];
for(let i=1;i<=200;i++) ENH_CUM[i]=ENH_CUM[i-1]+enhLevelXP(i);
function enhCumulative(L){
  L=Math.max(0,Math.min(200,Math.round(L)));
  return ENH_CUM[L];
}
// Ascension (101) + Mithril milestones: level -> {mithril, mythic}
const mithrilMilestones = {101:{mithril:0,mythic:2},120:{mithril:10,mythic:3},140:{mithril:20,mythic:5},160:{mithril:30,mythic:5},180:{mithril:40,mythic:10},200:{mithril:50,mythic:10}};
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

// Mastery Forging requirements for Enhance targets (ascension needs L10, reaching 200 needs L15)
function hgMasteryReq(eDes){ return eDes>=200?15:(eDes>100?10:0); }

// Widget step costs, level 0-10
const widgetStep=[0,5,10,15,20,25,30,35,40,45,50];
function widgetCumulative(L){ let s=0; for(let i=1;i<=L;i++) s+=widgetStep[i]; return s; }

// ---------- Icon set ----------
// Mythic Hero Gear artwork: images/hero-gear/{troop}-{gear}.webp
// (Infantry = Guardian, Lancer = Saboteur, Marksman = Sniper). The troop badge is part of the artwork.
function gearIcon(troop,gear){
  return `<img src="images/hero-gear/${troop}-${gear}.webp" style="width:100%;height:100%;object-fit:contain;display:block;" alt="${troop} ${gear}">`;
}
const BADGES = {
  infantry: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M16 3l11 4v9c0 7-5 11-11 13C10 27 5 23 5 16V7z" fill="#3b82f6"/><path d="M16 8l3 6h6l-5 4 2 6-6-4-6 4 2-6-5-4h6z" fill="#dbeafe"/></svg>`,
  lancer: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><rect x="14.5" y="2" width="3" height="26" rx="1.5" fill="#a78bfa" transform="rotate(20 16 15)"/><path d="M16 2l5 6-5-2-5 2z" fill="#e9d8fd" transform="rotate(20 16 15)"/></svg>`,
  marksman: `<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="12" fill="none" stroke="#34d399" stroke-width="2.5"/><circle cx="16" cy="16" r="6" fill="none" stroke="#34d399" stroke-width="2.5"/><circle cx="16" cy="16" r="1.5" fill="#34d399"/><line x1="16" y1="1" x2="16" y2="7" stroke="#34d399" stroke-width="2.5"/><line x1="16" y1="25" x2="16" y2="31" stroke="#34d399" stroke-width="2.5"/></svg>`
};
const TROOP_LABEL={infantry:'Infantry',lancer:'Lancer',marksman:'Marksman'};
const GEAR_LABEL={goggles:'Goggles',gloves:'Gloves',belt:'Belt',boots:'Boots'};

let pieceId=0, widgetId=0;
const pieces={}, widgets={};

function lvlOptions(max,val,min){
  let o='';
  for(let i=0;i<=max;i++) o+=`<option value="${i}" ${i===val?'selected':''} ${min!==undefined&&i<min?'disabled':''}>${i}</option>`;
  return o;
}
// Desired can never be below Current: pairs of [currentKey, desiredKey, max].
const HG_PAIRS=[['mCur','mDes',20],['eCur','eDes',200],['wCur','wDes',10]];
function hgEnforce(o,curK,desK){ if(o[desK]<o[curK]) o[desK]=o[curK]; }

// Rows are created/removed/replaced individually. Editing a level only recalculates the summary,
// so the inputs the user is typing in are never destroyed and re-created.
function buildPieceRow(id){
  const p=pieces[id];
  const div=document.createElement('div');
  div.className='piece-row';
  div.dataset.id=id;
  div.innerHTML=`
      <div class="piece-head">
        <div class="icon-wrap">
          <div class="gear-icon">${gearIcon(p.troop,p.gear)}</div>
        </div>
        <select onchange="updatePiece(${id},'troop',this.value)">
          ${Object.keys(TROOP_LABEL).map(t=>`<option value="${t}" ${t===p.troop?'selected':''}>${TROOP_LABEL[t]}</option>`).join('')}
        </select>
        <select onchange="updatePiece(${id},'gear',this.value)">
          ${Object.keys(GEAR_LABEL).map(g=>`<option value="${g}" ${g===p.gear?'selected':''}>${GEAR_LABEL[g]}</option>`).join('')}
        </select>
        <button class="rm" onclick="removePiece(${id})">Remove</button>
      </div>
      <div class="grid3">
        <div class="field"><label>Mastery Forging (1-20)</label>
          <div class="row2">
            <select onchange="updatePiece(${id},'mCur',this.value)">${lvlOptions(20,p.mCur)}</select>
            <span class="arrow">→</span>
            <select onchange="updatePiece(${id},'mDes',this.value)">${lvlOptions(20,p.mDes,p.mCur)}</select>
          </div>
        </div>
        <div class="field"><label>Enhance (0-200)</label>
          <div class="row2">
            <input type="number" min="0" max="200" value="${p.eCur}" onchange="updatePiece(${id},'eCur',this.value)">
            <span class="arrow">→</span>
            <input type="number" min="${p.eCur}" max="200" value="${p.eDes}" onchange="updatePiece(${id},'eDes',this.value)">
          </div>
        </div>
        <div class="field"><label>Widget (0-10)</label>
          <div class="row2">
            <select onchange="updatePiece(${id},'wCur',this.value)">${lvlOptions(10,p.wCur)}</select>
            <span class="arrow">→</span>
            <select onchange="updatePiece(${id},'wDes',this.value)">${lvlOptions(10,p.wDes,p.wCur)}</select>
          </div>
        </div>
      </div>
      <div class="hg-req" style="display:none;margin-top:8px;font-size:.85rem;color:#f5c542"></div>`;
  hgUpdateReq(div,p);
  return div;
}
function hgUpdateReq(row,p){
  const el=row.querySelector('.hg-req'); if(!el) return;
  const need=hgMasteryReq(p.eDes);
  if(need && p.mDes<need){
    el.style.display='block';
    el.innerHTML=`\u26A0 Requires Mastery Forging Level ${need} <button type="button" class="mini-btn" onclick="updatePiece(${row.dataset.id},'mDes',${need})">Set to L${need}</button>`;
  } else { el.style.display='none'; el.innerHTML=''; }
}
function buildWidgetRow(id){
  const w=widgets[id];
  const div=document.createElement('div');
  div.className='widget-row';
  div.dataset.id=id;
  div.innerHTML=`
      <div class="field"><label>Current</label><select onchange="updateWidget(${id},'cur',this.value)">${lvlOptions(10,w.cur)}</select></div>
      <div class="field"><label>Desired</label><select onchange="updateWidget(${id},'des',this.value)">${lvlOptions(10,w.des,w.cur)}</select></div>
      <button class="rm" onclick="removeWidget(${id})">Remove</button>`;
  return div;
}

function addPiece(troop,gear){
  const id=pieceId++;
  pieces[id]={troop:troop||'infantry',gear:gear||'goggles',mCur:1,mDes:1,eCur:0,eDes:0,wCur:0,wDes:0};
  document.getElementById('pieces').appendChild(buildPieceRow(id));
  renderSummary();
}
function removePiece(id){
  delete pieces[id];
  document.querySelector(`#pieces [data-id="${id}"]`)?.remove();
  renderSummary();
}
function addWidget(){
  const id=widgetId++;
  widgets[id]={cur:0,des:0};
  document.getElementById('widgets').appendChild(buildWidgetRow(id));
  renderSummary();
}
function removeWidget(id){
  delete widgets[id];
  document.querySelector(`#widgets [data-id="${id}"]`)?.remove();
  renderSummary();
}

// Update the Desired controls in place (value + disabled options) so the field being edited keeps focus.
function hgSyncDesired(row,o,pairs){
  pairs.forEach(([cur,des,ctl])=>{
    const el=row.querySelector(`[onchange*="'${ctl}'"]`); if(!el) return;
    if(el.tagName==='SELECT'){ for(const opt of el.options) opt.disabled=+opt.value<o[cur]; el.value=String(o[des]); }
    else { el.min=o[cur]; el.value=o[des]; }
  });
}
function updatePiece(id,field,val){
  const isLabel=(field==='troop'||field==='gear');
  const p=pieces[id];
  p[field]= isLabel?val:(parseInt(val)||0);
  if(!isLabel){
    p.eCur=Math.min(200,Math.max(0,p.eCur)); p.eDes=Math.min(200,Math.max(0,p.eDes));
    HG_PAIRS.forEach(([c,d])=>hgEnforce(p,c,d)); // raising Current past Desired drags Desired along
  }
  const row=document.querySelector(`#pieces [data-id="${id}"]`);
  if(row){
    if(isLabel) row.replaceWith(buildPieceRow(id)); // icon + badge change
    else { hgSyncDesired(row,p,[['mCur','mDes','mDes'],['eCur','eDes','eDes'],['wCur','wDes','wDes']]); hgUpdateReq(row,p); }
  }
  renderSummary();
}
function updateWidget(id,field,val){
  const w=widgets[id];
  w[field]=parseInt(val)||0;
  hgEnforce(w,'cur','des');
  const row=document.querySelector(`#widgets [data-id="${id}"]`);
  if(row) hgSyncDesired(row,w,[['cur','des','des']]);
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
    ['Essence Stones', fmt(essence)],
    ['Mithril', fmt(mithril)],
    ['Mythic Gear', fmt(totalMythic)],
    ['Enhance XP', fmt(enhXP)],
    ['Widget', fmt(widgetTotal)],
    ['SvS/KOI Points (Mithril+Widget+Essence)', fmt(totalPoints)],
  ];
  document.getElementById('summary').innerHTML = stats.map(([l,n])=>statCard(n,l)).join('');
  // Exposed so the SvS Calculator's "Import Hero Gear" button can pull real planned totals.
  window._heroGearTotals = {essence, mithril, widgetTotal};
}
