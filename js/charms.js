// Chief Charm

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


function renderCharmDB(){
 const m=document.getElementById('charmModal'); if(!m)return; const b=m.querySelector('.modal-box');
 b.innerHTML=`<button class="modal-close" onclick="closeModal('charmModal')">×</button><div class="modal-title"><i class="bi bi-gem"></i> Chief Charm</div><div class="modal-sub">18 slot database — 3 charm per masing-masing dari 6 gear. Level 0–18 termasuk sub-level (4.1, 4.2, dst.).</div>
 <div class="bc-section"><div class="placeholder-grid"><label>Current Level<select id="chCur">${charmOpts(0)}</select></label><label>Target Level<select id="chTar">${charmOpts(WOS_DB.charmSteps.findIndex(x=>x.label==='11'))}</select></label><label>Number of Charms<input id="chCount" type="number" min="1" max="18" value="18"></label><label>Guides Available<input id="chG" type="number" min="0" value="0"></label><label>Designs Available<input id="chD" type="number" min="0" value="0"></label><label>Secrets Available<input id="chS" type="number" min="0" value="0"></label></div></div>
 <div class="bc-section"><h3><i class="bi bi-bar-chart-fill"></i> Upgrade Summary</h3><div id="chResult" class="result-grid"></div></div>
 <div class="bc-section"><h3><i class="bi bi-puzzle-fill"></i> 18 Slots</h3><div class="charm-slots">${WOS_DB.chiefCharmsPieces.flatMap(p=>[1,2,3].map(i=>`<div class="tree-item"><b>${p.name} #${i}</b><span>${p.type}</span></div>`)).join('')}</div></div>
 <div class="bc-section"><h3><i class="bi bi-collection-fill"></i> Cost Database</h3><div class="table-scroll"><table class="db-table"><thead><tr><th>Level</th><th>Guides</th><th>Designs</th><th>Secrets</th><th>Score</th></tr></thead><tbody>${WOS_DB.charmSteps.slice(1).map(v=>`<tr><td>${v.label}</td><td>${fmt(v.guides)}</td><td>${fmt(v.designs)}</td><td>${fmt(v.secrets)}</td><td>${fmt(v.score)}</td></tr>`).join('')}</tbody></table></div><div class="source-note">Biaya per langkah untuk 1 charm, dari wostools.net/wiki/gear/chief-charms (dicek 2026-09-28). Kolom Score dikali 70 = poin SvS.</div></div>`;
 ['chCur','chTar','chCount','chG','chD','chS'].forEach(id=>{const e=document.getElementById(id);e?.addEventListener('input',calcCharmDB);e?.addEventListener('change',calcCharmDB);}); calcCharmDB();
}
function charmOpts(sel){return WOS_DB.charmSteps.map((x,i)=>`<option value="${i}" ${i===sel?'selected':''}>${x.label==='0'?'0 (belum ada)':x.label}</option>`).join('');}
function calcCharmDB(){
 const cur=Number(document.getElementById('chCur')?.value)||0, tar=Number(document.getElementById('chTar')?.value)||0, count=Math.max(1,Number(document.getElementById('chCount')?.value)||1);
 const c=WOS_DB.charmCost(cur,tar); const g=c.guides*count,d=c.designs*count,s=c.secrets*count,score=c.score*count;
 const invG=Number(document.getElementById('chG')?.value)||0,invD=Number(document.getElementById('chD')?.value)||0,invS=Number(document.getElementById('chS')?.value)||0;
 const cards=[['<i class="bi bi-book-fill"></i> Guides',g],['<i class="bi bi-journal-text"></i> Designs',d],['<i class="bi bi-gem"></i> Secrets',s],['<i class="bi bi-book-fill"></i> Still needed',Math.max(0,g-invG)],['<i class="bi bi-journal-text"></i> Still needed',Math.max(0,d-invD)],['<i class="bi bi-gem"></i> Still needed',Math.max(0,s-invS)],['<i class="bi bi-trophy-fill"></i> SvS',score*WOS_DB.charmRules.pointsPerScore]];
 const el=document.getElementById('chResult');if(el)el.innerHTML=cards.map(x=>`<div class="stat"><div class="n">${fmt(x[1])}</div><div class="l">${x[0]}</div></div>`).join('');
}
