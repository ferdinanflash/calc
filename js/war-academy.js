// War Academy (Helios research)

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
    ['n',fmt(shards),'<i class="bi bi-fire"></i> FC Shards'],['n',fmt(steel),'<i class="bi bi-gear-fill"></i> Steel'],['n',fmt(meat),'<i class="bi bi-egg-fried"></i> Meat'],['n',fmt(wood),'<i class="bi bi-tree-fill"></i> Wood'],
    ['n',fmt(coal),'<i class="bi bi-hexagon-fill"></i> Coal'],['n',fmt(iron),'<i class="bi bi-link-45deg"></i> Iron'],['n',formatDuration(time),'<i class="bi bi-stopwatch-fill"></i> Research Time'],['n',fmt(lv),'<i class="bi bi-graph-up-arrow"></i> Research Levels']
  ].map(x=>`<div class="stat"><div class="n">${x[1]}</div><div class="l">${x[2]}</div></div>`).join('');
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
