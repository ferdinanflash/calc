/* War Academy Calculator — T11 Helios + T12 Exalted / Molten I-II-III
   Data model follows the public WoSTools War Academy structure.
*/
const WA_HELIOS={
 Infantry:[['Flame Squad',5],['Flame Shield',8],['Flame Strike',8],['Flame Tomahawk',12],['Flame Protection',12],['Flame Legion',12],['Helios Infantry',1],['Helios Infantry Training',10],['Helios Infantry Healing',10],['Helios Infantry First Aid',10]],
 Lancer:[['Flame Squad',5],['Blazing Armor',8],['Blazing Charge',8],['Blazing Lance',12],['Blazing Guardian',12],['Flame Legion',12],['Helios Lancer',1],['Helios Lancer Training',10],['Helios Lancer Healing',10],['Helios Lancer First Aid',10]],
 Marksman:[['Flame Squad',5],['Crystal Armor',8],['Crystal Vision',8],['Crystal Arrow',12],['Crystal Protection',12],['Flame Legion',12],['Helios Marksman',1],['Helios Marksman Training',10],['Helios Marksman Healing',10],['Helios Marksman First Aid',10]]
};
const WA_T12={
 Infantry:{exalted:['Exalted Helm','Exalted Shoulderguard','Exalted Bastion','Exalted Trek','Exalted Armament'],moltenI:['Molten Shields I','Molten Plating I','Molten Guard I','Molten Blades I'],gateway:'Indomitable Wall',moltenII:['Molten Shields II','Molten Plating II','Molten Guard II','Molten Blades II'],solar:'Solar Supremacy',moltenIII:['Molten Shields III','Molten Plating III','Molten Guard III','Molten Blades III']},
 Lancer:{exalted:['Exalted Warcrown','Exalted Pauldron','Exalted Platemail','Exalted Warpath','Exalted Pike'],moltenI:['Molten Vambrace I','Molten Helmets I','Molten Tactics I','Molten Lance I'],gateway:'Meridian Phalanx',moltenII:['Molten Vambrace II','Molten Helmets II','Molten Tactics II','Molten Lance II'],solar:'Solar Supremacy',moltenIII:['Molten Vambrace III','Molten Helmets III','Molten Tactics III','Molten Lance III']},
 Marksman:{exalted:['Exalted Veil','Exalted Mantle','Exalted War Garb','Exalted Cadence','Exalted Blunderbuss'],moltenI:['Molten Grips I','Molten Scales I','Molten Sharpshooting I','Molten Shot I'],gateway:'Starfire',moltenII:['Molten Grips II','Molten Scales II','Molten Sharpshooting II','Molten Shot II'],solar:'Solar Supremacy',moltenIII:['Molten Grips III','Molten Scales III','Molten Sharpshooting III','Molten Shot III']}
};
const WA_T12_MAX=n=>n.includes('Exalted')?5:n==='Solar Supremacy'?15:['Indomitable Wall','Meridian Phalanx','Starfire'].includes(n)?3:50;
const WA_T12_COST={};
function waRes(meat,wood,coal,iron,steel,rfc,shards,seconds){return{meat,wood,coal,iron,steel,rfc,shards,seconds};}
// Exalted tracks are exact 5-level premium-material tracks from the public wiki.
function exaltedRows(steel){return [
 waRes(0,0,0,0,steel*.10,10,70,0),waRes(0,0,0,0,steel*.15,15,105,0),waRes(0,0,0,0,steel*.20,20,140,0),waRes(0,0,0,0,steel*.25,25,175,0),waRes(0,0,0,0,steel*.30,30,210,0)
];}
['Exalted Helm','Exalted Warcrown','Exalted Veil'].forEach(n=>WA_T12_COST[n]=exaltedRows(400000));
['Exalted Shoulderguard','Exalted Bastion','Exalted Trek','Exalted Armament','Exalted Pauldron','Exalted Platemail','Exalted Warpath','Exalted Pike','Exalted Mantle','Exalted War Garb','Exalted Cadence','Exalted Blunderbuss'].forEach(n=>WA_T12_COST[n]=exaltedRows(306000));
// Molten I: exact public 20-level pattern; all four tracks share the same cost curve.
function moltenIRows(){
 const a=[]; const meat=[500,520,550,570,600,620,650,700,750,800,850,900,950,1000,1000,1100,1100,1200,1200,1300];
 const coal=[100,100,110,110,120,120,130,140,150,160,170,180,190,200,210,220,230,240,250,260];
 const iron=[25,26,27,28,30,31,32,35,37,40,42,45,47,50,52,55,57,60,62,65];
 const steel=[15,15.8,16.5,17.3,18,18.8,19.5,21,22.5,24,25.5,27,28.5,30,31.5,33,34.5,36,37.5,39];
 const rfc=[2,2,2,2,3,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6];
 const sh=[16,17,17,18,19,20,21,22,24,26,27,29,30,32,34,35,37,39,40,42];
 const mins=[600,630,660,690,720,750,780,840,900,960,1020,1080,1140,1200,1260,1320,1380,1440,1500,1560];
 for(let i=0;i<20;i++)a.push(waRes(meat[i]*1000,meat[i]*1000,coal[i]*1000,iron[i]*1000,steel[i]*1000,rfc[i],sh[i],mins[i]*60)); return a;
}
['Molten Shields I','Molten Plating I','Molten Guard I','Molten Blades I','Molten Vambrace I','Molten Helmets I','Molten Tactics I','Molten Lance I','Molten Grips I','Molten Scales I','Molten Sharpshooting I','Molten Shot I'].forEach(n=>WA_T12_COST[n]=moltenIRows());
function blockRows(kind){
 const rows=[];
 const blocks=kind==='II' ? [[1,10,500,100,25,18,5,75,720],[11,20,620,120,31,22.5,6,93,900],[21,30,750,150,37,27,7,112,1080],[31,40,870,170,43,31.5,8,131,1260],[41,50,1000,200,50,36,10,150,1440]] : [[1,10,1000,200,50,25,5,125,2880],[11,20,1200,250,62,31.3,6,156,3600],[21,30,1500,300,75,37.5,7,187,4320],[31,40,1700,350,87,43.8,8,218,5040],[41,50,2000,400,100,50,10,250,5760]];
 blocks.forEach(b=>{for(let i=b[0];i<=b[1];i++)rows.push(waRes(b[2]*1000,b[2]*1000,b[3]*1000,b[4]*1000,b[5]*1000,b[6],b[7],b[8]));}); return rows;
}
['Molten Shields II','Molten Plating II','Molten Guard II','Molten Blades II','Molten Vambrace II','Molten Helmets II','Molten Tactics II','Molten Lance II','Molten Grips II','Molten Scales II','Molten Sharpshooting II','Molten Shot II'].forEach(n=>WA_T12_COST[n]=blockRows('II'));
['Molten Shields III','Molten Plating III','Molten Guard III','Molten Blades III','Molten Vambrace III','Molten Helmets III','Molten Tactics III','Molten Lance III','Molten Grips III','Molten Scales III','Molten Sharpshooting III','Molten Shot III'].forEach(n=>WA_T12_COST[n]=blockRows('III'));
function gatewayRows(){return [1,2,3].map(()=>waRes(15000000,15000000,750000,750000,200000,50,325,1728000));}
['Indomitable Wall','Meridian Phalanx','Starfire'].forEach(n=>WA_T12_COST[n]=gatewayRows());
WA_T12_COST['Solar Supremacy']=Array.from({length:15},(_,i)=>{const meat=[500,520,550,600,650,700,750,800,850,900,950,1000,1000,1100,1200][i]*1000;const coal=[100,100,110,120,130,140,150,160,170,180,190,200,210,230,250][i]*1000;const iron=[25,26,27,30,32,35,37,40,42,45,47,50,52,57,62]*1000;const steel=[25,26.3,27.5,30,32.5,35,37.5,40,40,45,47.5,50,52.5,57.5,62.5][i]*1000;const rfc=[5,5,5,6,6,7,7,8,8,9,9,10,10,11,12][i];const sh=[75,78,82,90,97,105,112,120,127,135,142,150,157,172,187][i];const sec=[720,756,792,864,936,1008,1080,1152,1224,1296,1368,1440,1512,1656,1800][i];return waRes(meat,meat,coal,iron,steel,rfc,sh,sec);});
// ---------- STATE ----------
// waLevels[type] = { h: Helios levels (one per track), t12: T12 levels (19 tracks) }.
// Both the "current" and "target" selects of a row bind to the same value (see waSetLevel).
let waLevels={};
function resetWAState(){waLevels={};Object.keys(WA_HELIOS).forEach(t=>waLevels[t]={h:Array(WA_HELIOS[t].length).fill(0),t12:Array(19).fill(0)});}
resetWAState();

const waSum=a=>a.reduce((x,y)=>x+y,0);
function speedFactor(){return 1+(valNum('waSpeed')+valNum('waState')+valNum('waVP'))/100;}
function t12Meta(type){const x=WA_T12[type];return [...x.exalted,...x.moltenI,x.gateway,...x.moltenII,x.solar,...x.moltenIII];}
function t12Cost(name,from,to){const rows=WA_T12_COST[name]||[];const max=Math.min(to,rows.length);let z=waRes(0,0,0,0,0,0,0,0);for(let i=Math.max(0,from);i<max;i++){waAdd(z,rows[i]);}return z;}
function waAdd(a,b){Object.keys(a).forEach(k=>a[k]+=b[k]);}
// Cost of raising Helios track #track of a troop type from level 0 up to level `to`.
// (Previously the track index was used as the starting LEVEL and the level as an end index, which
// walked past the last track and threw for any level above 10, e.g. the Lv.12 prerequisites.)
function heliosCost(type,track,to){
 const z=waRes(0,0,0,0,0,0,0,0),rows=WOS_DB?.warAcademy?.helios?.verifiedRows||[];
 const name=WA_HELIOS[type][track][0];
 for(let lv=1;lv<=to;lv++){
  const q=rows.find(x=>x.track===name&&x.level===lv)||rows.find(x=>x.track===name);
  if(q)waAdd(z,{meat:q.meat||0,wood:q.wood||0,coal:q.coal||0,iron:q.iron||0,steel:q.steel||0,rfc:q.refinedFC||0,shards:q.shards||0,seconds:q.seconds||0});
 }
 return z;
}
// Returns true when it had to raise any level (so the UI can be re-synced).
function autoPrereq(type){
 if(!document.getElementById('waPrereq')?.checked)return false;
 const h=waLevels[type].h;
 if(!(h[6]>0))return false; // Helios -> Tomahawk/Blazing Lance/Crystal Arrow -> Strike/Charge/Vision -> Squad
 const min=[[3,12],[2,8],[1,5],[0,5]];
 let changed=false;
 min.forEach(([idx,lv])=>{if(h[idx]<lv){h[idx]=lv;changed=true;}});
 return changed;
}
function t12UnlockCount(type){return waSum(waLevels[type].t12.slice(0,5));}

// ---------- RENDER (controls are built ONCE, afterwards only synced in place) ----------
function waOpts(max){let s='';for(let i=0;i<=max;i++)s+=`<option value="${i}">${i}</option>`;return s;}
function renderSelect(name,idx,max,type,group){
 const key=`${type}|${group}|${idx}`,o=waOpts(max);
 return `<div class="research-row"><span>${name}<small>max ${max}</small></span><select data-wa="${key}" aria-label="${name} current" onchange="waSetLevel('${type}','${group}',${idx},'current',this.value)">${o}</select><span>→</span><select data-wa="${key}" aria-label="${name} target" onchange="waSetLevel('${type}','${group}',${idx},'target',this.value)">${o}</select></div>`;
}
function renderT12(type){
 const m=WA_T12[type];
 return `<div class="bc-section t12-section"><h3>🔥 T12 Exalted &amp; Molten ${type}<small class="t12-threshold" id="waThreshold-${type}"></small></h3><div class="notice">T11 ${type} must be unlocked. Complete all 25 Tier 1 Exalted levels in sequence to unlock T12 for this troop type. Molten I/II/III require War Academy FC 10.</div><div class="research-list">`
  +m.exalted.map((n,i)=>renderSelect(n,i,5,type,'t12')).join('')
  +m.moltenI.map((n,i)=>renderSelect(n,5+i,20,type,'t12')).join('')
  +renderSelect(m.gateway,9,3,type,'t12')
  +m.moltenII.map((n,i)=>renderSelect(n,10+i,50,type,'t12')).join('')
  +renderSelect(m.solar,14,15,type,'t12')
  +m.moltenIII.map((n,i)=>renderSelect(n,15+i,50,type,'t12')).join('')
  +'</div></div>';
}
function buildWAControls(){
 const el=document.getElementById('warBranches');if(!el)return;
 if(el.dataset.built)return;
 el.innerHTML=Object.entries(WA_HELIOS).map(([type,items])=>`<div class="bc-section"><h3>⚔️ ${type}</h3><div class="bc-toolbar"><button class="mini-btn" onclick="waSetBranch('${type}',0,'h')">Reset Current</button><button class="mini-btn" onclick="waSetBranch('${type}',${items.length},'h')">Max Helios</button><button class="mini-btn" onclick="waSetT12('${type}',5)">Unlock T12</button><button class="mini-btn" onclick="waSetT12('${type}',999)">Max T12</button></div><div class="research-list">${items.map((x,i)=>renderSelect(x[0],i,x[1],type,'h')).join('')}</div>${renderT12(type)}</div>`).join('');
 el.dataset.built='1';
}
// Push waLevels into the existing <select>s (no DOM rebuild, keeps focus and scroll position).
function syncWAControls(){
 document.querySelectorAll('#warBranches select[data-wa]').forEach(s=>{
  const [type,group,idx]=s.dataset.wa.split('|');
  s.value=String(waLevels[type][group][idx]);
 });
}
function initWarAcademy(){buildWAControls();syncWAControls();calcWarAcademy();}

// ---------- ACTIONS ----------
function waSetLevel(type,group,idx,mode,val){
 const arr=group==='h'?waLevels[type].h:waLevels[type].t12;val=+val;
 arr[idx]=mode==='target'?Math.max(arr[idx],val):val;
 if(group==='h')autoPrereq(type);
 syncWAControls();calcWarAcademy();
}
function waSetBranch(type,v,group){
 if(group==='h'){waLevels[type].h=waLevels[type].h.map((_,i)=>Math.min(v,WA_HELIOS[type][i][1]));autoPrereq(type);}
 syncWAControls();calcWarAcademy();
}
function waSetAll(v){ // "Set All Helios Lv.N" button in the modal header
 Object.keys(WA_HELIOS).forEach(type=>{waLevels[type].h=waLevels[type].h.map((_,i)=>Math.min(v,WA_HELIOS[type][i][1]));autoPrereq(type);});
 syncWAControls();calcWarAcademy();
}
function waSetT12(type,v){
 const arr=waLevels[type].t12;
 if(v===5){for(let i=0;i<5;i++)arr[i]=5;}else{t12Meta(type).forEach((n,i)=>arr[i]=WA_T12_MAX(n));}
 syncWAControls();calcWarAcademy();
}

// ---------- CALC ----------
function calcWarAcademy(){
 let total=waRes(0,0,0,0,0,0,0,0),levels=0,changed=false;const per={};
 Object.keys(WA_HELIOS).forEach(type=>{
  if(autoPrereq(type))changed=true;
  const lv=waLevels[type],c=waRes(0,0,0,0,0,0,0,0);
  lv.h.forEach((to,i)=>waAdd(c,heliosCost(type,i,to)));
  t12Meta(type).forEach((n,i)=>waAdd(c,t12Cost(n,0,lv.t12[i])));
  waAdd(total,c);
  levels+=waSum(lv.h)+waSum(lv.t12);
  per[type]={c,unlock:t12UnlockCount(type),heliosUnlocked:lv.h[6]>0};
 });
 if(changed)syncWAControls(); // "Auto-add Prerequisites" was just ticked -> reflect it in the selects
 const inv={shards:valNum('waShards'),rfc:valNum('waRfc'),steel:valNum('waSteel'),meat:valNum('waMeat'),wood:valNum('waWood'),coal:valNum('waCoal'),iron:valNum('waIron')};
 const gap={};Object.keys(inv).forEach(k=>gap[k]=Math.max(0,total[k]-inv[k]));
 Object.keys(WA_T12).forEach(type=>{const el=document.getElementById('waThreshold-'+type);if(el){const n=per[type]?.unlock||0;el.textContent=` · ${n}/25 Tier 1 Exalted`;el.className='t12-threshold '+(n>=25?'ok':'warn');}});
 const result=document.getElementById('waResult');if(!result)return;
 result.innerHTML=[
  [fmt(total.shards),'<i class="bi bi-fire"></i> FC Shards'],
  [fmt(total.rfc),'<i class="bi bi-gem"></i> Refined FC'],
  [fmt(total.steel),'<i class="bi bi-gear-fill"></i> Steel'],
  [fmt(total.meat),'<i class="bi bi-egg-fried"></i> Meat'],
  [fmt(total.wood),'<i class="bi bi-tree-fill"></i> Wood'],
  [fmt(total.coal),'<i class="bi bi-hexagon-fill"></i> Coal'],
  [fmt(total.iron),'<i class="bi bi-link-45deg"></i> Iron'],
  [formatDuration(total.seconds/speedFactor()),'<i class="bi bi-stopwatch-fill"></i> Research Time'],
  [fmt(levels),'<i class="bi bi-graph-up-arrow"></i> Research Levels'],
  [fmt(gap.shards),'<i class="bi bi-exclamation-circle"></i> FC Shards Needed'],
  [fmt(gap.rfc),'<i class="bi bi-exclamation-circle"></i> Refined FC Needed']
 ].map(x=>statCard(x[0],x[1])).join('');
 const fc=valNum('waFcLevel'),warnings=[];
 Object.entries(per).forEach(([type,p])=>{
  if(p.unlock>0&&!p.heliosUnlocked)warnings.push(`${type}: unlock Helios Lv.1 before T12 research.`);
  if(p.unlock>0&&fc<5)warnings.push(`${type}: War Academy FC 5 is required for T12 Exalted research.`);
  if(p.c.rfc>0&&fc<10)warnings.push(`${type}: War Academy FC 10 is required for Molten research.`);
 });
 let box=document.getElementById('waWarnings');
 if(!box){box=document.createElement('div');box.id='waWarnings';box.className='notice';result.parentElement.appendChild(box);}
 box.innerHTML=warnings.length?`<b>Requirements:</b> ${warnings.join(' ')}`:`<b>T12 requirements:</b> all selected prerequisites are satisfied.`;
}
