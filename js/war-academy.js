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
function r(meat,wood,coal,iron,steel,rfc,shards,seconds){return{meat,wood,coal,iron,steel,rfc,shards,seconds};}
// Exalted tracks are exact 5-level premium-material tracks from the public wiki.
const exA=[r(0,0,0,0,40000,100,700,0)];
function exaltedRows(steel){return [
 r(0,0,0,0,steel*.10,10,70,0),r(0,0,0,0,steel*.15,15,105,0),r(0,0,0,0,steel*.20,20,140,0),r(0,0,0,0,steel*.25,25,175,0),r(0,0,0,0,steel*.30,30,210,0)
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
 for(let i=0;i<20;i++)a.push(r(meat[i]*1000,meat[i]*1000,coal[i]*1000,iron[i]*1000,steel[i]*1000,rfc[i],sh[i],mins[i]*60)); return a;
}
['Molten Shields I','Molten Plating I','Molten Guard I','Molten Blades I','Molten Vambrace I','Molten Helmets I','Molten Tactics I','Molten Lance I','Molten Grips I','Molten Scales I','Molten Sharpshooting I','Molten Shot I'].forEach(n=>WA_T12_COST[n]=moltenIRows());
function blockRows(kind){
 const rows=[];
 const blocks=kind==='II' ? [[1,10,500,100,25,18,5,75,720],[11,20,620,120,31,22.5,6,93,900],[21,30,750,150,37,27,7,112,1080],[31,40,870,170,43,31.5,8,131,1260],[41,50,1000,200,50,36,10,150,1440]] : [[1,10,1000,200,50,25,5,125,2880],[11,20,1200,250,62,31.3,6,156,3600],[21,30,1500,300,75,37.5,7,187,4320],[31,40,1700,350,87,43.8,8,218,5040],[41,50,2000,400,100,50,10,250,5760]];
 blocks.forEach(b=>{for(let i=b[0];i<=b[1];i++)rows.push(r(b[2]*1000,b[2]*1000,b[3]*1000,b[4]*1000,b[5]*1000,b[6],b[7],b[8]));}); return rows;
}
['Molten Shields II','Molten Plating II','Molten Guard II','Molten Blades II','Molten Vambrace II','Molten Helmets II','Molten Tactics II','Molten Lance II','Molten Grips II','Molten Scales II','Molten Sharpshooting II','Molten Shot II'].forEach(n=>WA_T12_COST[n]=blockRows('II'));
['Molten Shields III','Molten Plating III','Molten Guard III','Molten Blades III','Molten Vambrace III','Molten Helmets III','Molten Tactics III','Molten Lance III','Molten Grips III','Molten Scales III','Molten Sharpshooting III','Molten Shot III'].forEach(n=>WA_T12_COST[n]=blockRows('III'));
function gatewayRows(){return [1,2,3].map(()=>r(15000000,15000000,750000,750000,200000,50,325,1728000));}
['Indomitable Wall','Meridian Phalanx','Starfire'].forEach(n=>WA_T12_COST[n]=gatewayRows());
WA_T12_COST['Solar Supremacy']=Array.from({length:15},(_,i)=>{const meat=[500,520,550,600,650,700,750,800,850,900,950,1000,1000,1100,1200][i]*1000;const coal=[100,100,110,120,130,140,150,160,170,180,190,200,210,230,250][i]*1000;const iron=[25,26,27,30,32,35,37,40,42,45,47,50,52,57,62]*1000;const steel=[25,26.3,27.5,30,32.5,35,37.5,40,40,45,47.5,50,52.5,57.5,62.5][i]*1000;const rfc=[5,5,5,6,6,7,7,8,8,9,9,10,10,11,12][i];const sh=[75,78,82,90,97,105,112,120,127,135,142,150,157,172,187][i];const sec=[720,756,792,864,936,1008,1080,1152,1224,1296,1368,1440,1512,1656,1800][i];return r(meat,meat,coal,iron,steel,rfc,sh,sec);});
let waState={};
function resetWAState(){waState={}; Object.keys(WA_HELIOS).forEach(t=>waState[t]={h:Array(WA_HELIOS[t].length).fill(0),t12:Array(19).fill(0)});}
resetWAState();
function fmt(n){return Math.round(n).toLocaleString('en-US');}
function duration(s){s=Math.max(0,Math.round(s));const d=Math.floor(s/86400),h=Math.floor(s%86400/3600),m=Math.floor(s%3600/60);return `${d?d+'d ':''}${h}h ${m}m`.trim();}
function speedFactor(){return 1+(+document.getElementById('waSpeed')?.value||0)/100+(+document.getElementById('waState')?.value||0)/100+(+document.getElementById('waVP')?.value||0)/100;}
function t12Meta(type){const x=WA_T12[type];return [...x.exalted,...x.moltenI,x.gateway,...x.moltenII,x.solar,...x.moltenIII];}
function t12Cost(name,from,to){const rows=WA_T12_COST[name]||[];const max=Math.min(to,rows.length);let z=r(0,0,0,0,0,0,0,0);for(let i=Math.max(0,from);i<max;i++){const q=rows[i];Object.keys(z).forEach(k=>z[k]+=q[k]);}return z;}
function add(a,b){Object.keys(a).forEach(k=>a[k]+=b[k]);}
function heliosCost(type,from,to){let z=r(0,0,0,0,0,0,0,0);const rows=WOS_DB?.warAcademy?.helios?.verifiedRows||[];for(let i=from;i<to;i++){const n=WA_HELIOS[type][i][0];const q=rows.find(x=>x.track===n&&x.level===i+1)||rows.find(x=>x.track===n);if(q)add(z,{meat:q.meat||0,wood:q.wood||0,coal:q.coal||0,iron:q.iron||0,steel:q.steel||0,rfc:q.refinedFC||0,shards:q.shards||0,seconds:q.seconds||0});}return z;}
function autoPrereq(type){const h=waState[type].h; if(!document.getElementById('waPrereq')?.checked)return;
 const req=[[6,3,12],[3,2,8],[2,1,8],[1,0,5]]; // Helios -> Tomahawk/Blazing Lance/Crystal Arrow -> Strike/Charge/Vision -> Squad
 if(h[6]>0){h[3]=Math.max(h[3],12);h[2]=Math.max(h[2],8);h[1]=Math.max(h[1],5);h[0]=Math.max(h[0],5);}
}
function t12UnlockCount(type){return waState[type].t12.slice(0,5).reduce((a,b)=>a+b,0);}
function renderSelect(name,idx,max,type,group){const arr=group==='h'?waState[type].h:waState[type].t12;return `<div class="research-row"><span>${name}<small>max ${max}</small></span><select aria-label="${name} current" onchange="waSetLevel('${type}','${group}',${idx},'current',this.value)">${Array.from({length:max+1},(_,i)=>`<option ${arr[idx]===i?'selected':''}>${i}</option>`).join('')}</select><span>→</span><select aria-label="${name} target" onchange="waSetLevel('${type}','${group}',${idx},'target',this.value)">${Array.from({length:max+1},(_,i)=>`<option ${arr[idx]===i?'selected':''}>${i}</option>`).join('')}</select></div>`;}
function renderT12(type){const m=WA_T12[type],items=t12Meta(type);let html=`<div class="bc-section t12-section"><h3>🔥 T12 Exalted & Molten ${type}<small class="t12-threshold" id="waThreshold-${type}"></small></h3><div class="notice">T11 ${type} must be unlocked. Complete all 25 Tier 1 Exalted levels in sequence to unlock T12 for this troop type. Molten I/II/III require War Academy FC 10.</div><div class="research-list">`;
 html+=m.exalted.map((n,i)=>renderSelect(n,i,5,type,'t12')).join(''); html+=m.moltenI.map((n,i)=>renderSelect(n,5+i,20,type,'t12')).join(''); html+=renderSelect(m.gateway,9,3,type,'t12'); html+=m.moltenII.map((n,i)=>renderSelect(n,10+i,50,type,'t12')).join(''); html+=renderSelect(m.solar,14,15,type,'t12'); html+=m.moltenIII.map((n,i)=>renderSelect(n,15+i,50,type,'t12')).join(''); html+='</div></div>';return html;}
function initWarAcademy(){const el=document.getElementById('warBranches');if(!el)return;resetWAState();el.innerHTML=Object.entries(WA_HELIOS).map(([type,items])=>`<div class="bc-section"><h3>⚔️ ${type}</h3><div class="bc-toolbar"><button class="mini-btn" onclick="waSetBranch('${type}',0,'h')">Set All Current 0</button><button class="mini-btn" onclick="waSetBranch('${type}',items.length,'h')">Set All Target Max</button></div><div class="research-list">${items.map((x,i)=>renderSelect(x[0],i,x[1],type,'h')).join('')}</div>${renderT12(type)}</div>`).join('');calcWarAcademy();}
function waSetLevel(type,group,idx,mode,val){const arr=group==='h'?waState[type].h:waState[type].t12;val=+val;if(mode==='target'){arr[idx]=Math.max(arr[idx],val);}else{arr[idx]=val;}if(group==='h')autoPrereq(type);renderWAControls();calcWarAcademy();}
function renderWAControls(){const el=document.getElementById('warBranches');if(!el)return;const scroll=el.parentElement?.scrollTop||0;el.innerHTML=Object.entries(WA_HELIOS).map(([type,items])=>`<div class="bc-section"><h3>⚔️ ${type}</h3><div class="bc-toolbar"><button class="mini-btn" onclick="waSetBranch('${type}',0,'h')">Reset Current</button><button class="mini-btn" onclick="waSetBranch('${type}',${items.length},'h')">Max Helios</button><button class="mini-btn" onclick="waSetT12('${type}',5)">Unlock T12</button><button class="mini-btn" onclick="waSetT12('${type}',999)">Max T12</button></div><div class="research-list">${items.map((x,i)=>renderSelect(x[0],i,x[1],type,'h')).join('')}</div>${renderT12(type)}</div>`).join('');calcWarAcademy();}
function waSetBranch(type,v,group){if(group==='h'){waState[type].h=waState[type].h.map((_,i)=>Math.min(v,WA_HELIOS[type][i][1]));autoPrereq(type);}renderWAControls();}
function waSetT12(type,v){const arr=waState[type].t12;if(v===5){for(let i=0;i<5;i++)arr[i]=5;}else{const m=t12Meta(type);m.forEach((n,i)=>arr[i]=WA_T12_MAX(n));}renderWAControls();}
function calcWarAcademy(){
 let total=r(0,0,0,0,0,0,0,0),levels=0;const per={};
 Object.entries(WA_HELIOS).forEach(([type,items])=>{autoPrereq(type);let c=heliosCost(type,0,waState[type].h.reduce((a,b)=>a+b?Math.max(a,b):a,0)); // fallback replaced below
 c=r(0,0,0,0,0,0,0,0);waState[type].h.forEach((to,i)=>{const q=heliosCost(type,i,to);add(c,q);});
 let tc=r(0,0,0,0,0,0,0,0);t12Meta(type).forEach((n,i)=>{const q=t12Cost(n,0,waState[type].t12[i]);add(tc,q);});add(c,tc);add(total,c);levels+=waState[type].h.reduce((a,b)=>a+b,0)+waState[type].t12.reduce((a,b)=>a+b,0);per[type]={c,unlock:t12UnlockCount(type),heliosUnlocked:waState[type].h[6]>0};
 });
 const sf=speedFactor(),time=total.seconds/sf;const inv={shards:+document.getElementById('waShards')?.value||0,rfc:+document.getElementById('waRfc')?.value||0,steel:+document.getElementById('waSteel')?.value||0,meat:+document.getElementById('waMeat')?.value||0,wood:+document.getElementById('waWood')?.value||0,coal:+document.getElementById('waCoal')?.value||0,iron:+document.getElementById('waIron')?.value||0};
 const gap={shards:Math.max(0,total.shards-inv.shards),rfc:Math.max(0,total.rfc-inv.rfc),steel:Math.max(0,total.steel-inv.steel),meat:Math.max(0,total.meat-inv.meat),wood:Math.max(0,total.wood-inv.wood),coal:Math.max(0,total.coal-inv.coal),iron:Math.max(0,total.iron-inv.iron)};
 Object.entries(WA_T12).forEach(([type])=>{const el=document.getElementById('waThreshold-'+type);if(el){const n=per[type]?.unlock||0;el.textContent=` · ${n}/25 Tier 1 Exalted`;el.className='t12-threshold '+(n>=25?'ok':'warn');}});
 const result=document.getElementById('waResult');if(!result)return;result.innerHTML=[['n',fmt(total.shards),'<i class="bi bi-fire"></i> FC Shards'],['n',fmt(total.rfc),'<i class="bi bi-gem"></i> Refined FC'],['n',fmt(total.steel),'<i class="bi bi-gear-fill"></i> Steel'],['n',fmt(total.meat),'<i class="bi bi-egg-fried"></i> Meat'],['n',fmt(total.wood),'<i class="bi bi-tree-fill"></i> Wood'],['n',fmt(total.coal),'<i class="bi bi-hexagon-fill"></i> Coal'],['n',fmt(total.iron),'<i class="bi bi-link-45deg"></i> Iron'],['n',duration(time),'<i class="bi bi-stopwatch-fill"></i> Research Time'],['n',fmt(levels),'<i class="bi bi-graph-up-arrow"></i> Research Levels'],['n',fmt(gap.shards),'<i class="bi bi-exclamation-circle"></i> FC Shards Needed'],['n',fmt(gap.rfc),'<i class="bi bi-exclamation-circle"></i> Refined FC Needed']].map(x=>`<div class="stat"><div class="n">${x[1]}</div><div class="l">${x[2]}</div></div>`).join('');
 const fc=+document.getElementById('waFcLevel')?.value||0;const warnings=[];Object.entries(per).forEach(([type,p])=>{if(p.unlock>0&&!p.heliosUnlocked)warnings.push(`${type}: unlock Helios Lv.1 before T12 research.`);if(p.unlock>0&&fc<5)warnings.push(`${type}: War Academy FC 5 is required for T12 Exalted research.`);if(p.c.rfc>0&&fc<10)warnings.push(`${type}: War Academy FC 10 is required for Molten research.`);});
 let box=document.getElementById('waWarnings');if(!box){box=document.createElement('div');box.id='waWarnings';box.className='notice';result.parentElement.appendChild(box);}box.innerHTML=warnings.length?`<b>Requirements:</b> ${warnings.join(' ')}`:`<b>T12 requirements:</b> all selected prerequisites are satisfied.`;
}
function renderWarAcademyDB(){/* kept for compatibility with existing modal hooks */ initWarAcademy();}
