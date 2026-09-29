/* War Academy Calculator — T11 Helios + T12 Exalted / Molten I-II-III
   Data model follows the public WoSTools War Academy structure.
*/
const WA_HELIOS={
 Infantry:[['Flame Squad',5],['Flame Shield',8],['Flame Strike',8],['Flame Tomahawk',12],['Flame Protection',12],['Flame Legion',12],['Helios Infantry',1],['Helios Infantry Training',10],['Helios Infantry Healing',10],['Helios Infantry First Aid',10]],
 Lancer:[['Flame Squad',5],['Blazing Armor',8],['Blazing Charge',8],['Blazing Lance',12],['Blazing Guardian',12],['Flame Legion',12],['Helios Lancer',1],['Helios Lancer Training',10],['Helios Lancer Healing',10],['Helios Lancer First Aid',10]],
 Marksman:[['Flame Squad',5],['Crystal Armor',8],['Crystal Vision',8],['Crystal Arrow',12],['Crystal Protection',12],['Flame Legion',12],['Helios Marksman',1],['Helios Marksman Training',10],['Helios Marksman Healing',10],['Helios Marksman First Aid',10]]
};
const WA_T12={
 Infantry:{exalted:['Exalted Helm','Exalted Shoulderguard','Exalted Bastion','Exalted Trek','Exalted Armament'],moltenI:['Molten Shields I','Molten Plating I','Molten Guard I','Molten Blades I'],gateway:'Indomitable Wall',moltenII:['Molten Shields II','Molten Plating II','Molten Guard II','Molten Blades II'],solar:'Solar Supremacy',moltenIII:['Molten Shields III','Molten Plating III','Molten Guard III','Molten Blades III'],t12Support:['Exalted Infantry Training','Exalted Infantry Healing','Exalted Infantry First Aid']},
 Lancer:{exalted:['Exalted Warcrown','Exalted Pauldron','Exalted Platemail','Exalted Warpath','Exalted Pike'],moltenI:['Molten Vambrace I','Molten Helmets I','Molten Tactics I','Molten Lance I'],gateway:'Meridian Phalanx',moltenII:['Molten Vambrace II','Molten Helmets II','Molten Tactics II','Molten Lance II'],solar:'Solar Supremacy',moltenIII:['Molten Vambrace III','Molten Helmets III','Molten Tactics III','Molten Lance III'],t12Support:['Exalted Lancer Training','Exalted Lancer Healing','Exalted Lancer First Aid']},
 Marksman:{exalted:['Exalted Veil','Exalted Mantle','Exalted War Garb','Exalted Cadence','Exalted Blunderbuss'],moltenI:['Molten Grips I','Molten Scales I','Molten Sharpshooting I','Molten Shot I'],gateway:'Starfire',moltenII:['Molten Grips II','Molten Scales II','Molten Sharpshooting II','Molten Shot II'],solar:'Solar Supremacy',moltenIII:['Molten Grips III','Molten Scales III','Molten Sharpshooting III','Molten Shot III'],t12Support:['Exalted Marksman Training','Exalted Marksman Healing','Exalted Marksman First Aid']}
};
const WA_T12_MAX=n=>n.includes('Exalted')&&/(Training|Healing|First Aid)$/.test(n)?10:n.includes('Exalted')?5:n==='Solar Supremacy'?15:['Indomitable Wall','Meridian Phalanx','Starfire'].includes(n)?3:50;
const WA_T12_COST={};
function waRes(meat,wood,coal,iron,steel,rfc,shards,seconds){return{meat,wood,coal,iron,steel,rfc,shards,seconds};}
// Exalted tracks are exact 5-level premium-material tracks from the public wiki.
function exaltedRows(base){return [36,36,54,72,108].map((steel,i)=>({...waRes(0,0,0,0,steel*1000,[10,10,15,20,30][i],[70,70,105,140,210][i],0),power:150000}));}
function exaltedHelmRows(){return [40,60,80,100,120].map((steel,i)=>({...waRes(0,0,0,0,steel*1000,[10,15,20,25,30][i],[70,105,140,175,210][i],0),power:180000}));}
WA_T12_COST['Exalted Helm']=exaltedHelmRows();
['Exalted Warcrown','Exalted Veil'].forEach(n=>WA_T12_COST[n]=exaltedRows(36000));
['Exalted Shoulderguard','Exalted Bastion','Exalted Trek','Exalted Armament','Exalted Pauldron','Exalted Platemail','Exalted Warpath','Exalted Pike','Exalted Mantle','Exalted War Garb','Exalted Cadence','Exalted Blunderbuss'].forEach(n=>WA_T12_COST[n]=exaltedRows(36000));
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
WA_T12_COST['Solar Supremacy']=Array.from({length:15},(_,i)=>{const meat=[500,520,550,600,650,700,750,800,850,900,950,1000,1000,1100,1200][i]*1000;const coal=[100,100,110,120,130,140,150,160,170,180,190,200,210,230,250][i]*1000;const iron=[25,26,27,30,32,35,37,40,42,45,47,50,52,57,62][i]*1000;const steel=[25,26.3,27.5,30,32.5,35,37.5,40,40,45,47.5,50,52.5,57.5,62.5][i]*1000;const rfc=[5,5,5,6,6,7,7,8,8,9,9,10,10,11,12][i];const sh=[75,78,82,90,97,105,112,120,127,135,142,150,157,172,187][i];const sec=[720,756,792,864,936,1008,1080,1152,1224,1296,1368,1440,1512,1656,1800][i];return waRes(meat,meat,coal,iron,steel,rfc,sh,sec);});
// Research Power per level (WoSTools War Academy table): Molten I/II/III 50K, Gateway 350K, Solar Supremacy 60K.
// Applied after all cost rows are built; rows that already carry a power (Exalted tracks) are left untouched.
function waApplyT12Power(){
 Object.keys(WA_T12_COST).forEach(n=>{
  const p=/^Molten /.test(n)?50000:['Indomitable Wall','Meridian Phalanx','Starfire'].includes(n)?350000:n==='Solar Supremacy'?60000:null;
  if(p===null)return;
  WA_T12_COST[n].forEach(r=>{if(r.power===undefined)r.power=p;});
 });
}
function exaltedSupportRows(kind){ const meat=[500,520,550,570,600,620,650,700,750,800], coal=[100,100,110,110,120,120,130,140,150,160], iron=[25,26,27,28,30,31,32,35,37,40], steel=[15,15.8,16.5,17.3,18,18.8,19.5,21,22.5,24], rfc=[2,2,2,2,3,3,3,3,3,4], sh=[16,17,17,18,19,20,21,22,24,26], sec=[600,630,660,690,720,750,780,840,900,960]; const power={training:17500,healing:35000,firstAid:10500}[kind]||0; return meat.map((m,i)=>({...waRes(m*1000,m*1000,coal[i]*1000,iron[i]*1000,steel[i]*1000,rfc[i],sh[i],sec[i]*60),power})); }
['Exalted Infantry Training','Exalted Lancer Training','Exalted Marksman Training'].forEach(n=>WA_T12_COST[n]=exaltedSupportRows('training'));
['Exalted Infantry Healing','Exalted Lancer Healing','Exalted Marksman Healing'].forEach(n=>WA_T12_COST[n]=exaltedSupportRows('healing'));
['Exalted Infantry First Aid','Exalted Lancer First Aid','Exalted Marksman First Aid'].forEach(n=>WA_T12_COST[n]=exaltedSupportRows('firstAid'));
waApplyT12Power();
// ---------- STATE ----------
// waLevels[type] = { h: Helios levels (one per track), t12: T12 levels (19 tracks) }.
// waLevels = TARGET levels, waCur = CURRENT levels (same shape). Cost = levels between current and target.
let waLevels={},waCur={};
let waMissing=new Set(); // Helios levels that have no cost data (collected per calculation)
// The public War Academy tables use the same resource/time curves for the
// corresponding Helios branches; only the research/stat names differ by troop type.
// Keep the full verified level data here so every selectable level has a real cost.
function installHeliosRows(){
 const R=(meat,wood,coal,iron,steel,shards,seconds)=>({meat,wood,coal,iron,steel,shards,refinedFC:0,seconds});
 const squad=[
  R(300000,300000,60000,15000,5000,16,28800),R(480000,480000,96000,24000,8000,25,46080),R(780000,780000,150000,39000,13000,41,74880),R(1200000,1200000,250000,64000,21000,68,123840),R(2000000,2000000,400000,100000,33000,108,194400)
 ];
 const shield=[
  R(800000,800000,160000,40000,10000,40,72000),R(1100000,1100000,220000,56000,14000,56,100800),R(1400000,1400000,290000,74000,18000,74,133200),R(2000000,2000000,400000,100000,25000,102,183600),R(2700000,2700000,540000,130000,34000,136,244800),R(3600000,3600000,730000,180000,46000,184,331200),R(4900000,4900000,990000,240000,62000,248,446400),R(6600000,6600000,1300000,330000,83000,334,601200)
 ];
 const tomahawk=[
  R(700000,700000,140000,35000,15000,54,68140),R(860000,860000,170000,43000,18000,66,83812),R(1000000,1000000,210000,52000,22000,81,102210),R(1200000,1200000,250000,63000,27000,97,122652),R(1500000,1500000,300000,77000,33000,118,149908),R(1800000,1800000,370000,94000,40000,145,183978),R(2300000,2300000,460000,110000,49000,178,224862),R(2800000,2800000,560000,140000,60000,216,272560),R(3500000,3500000,700000,170000,75000,270,340700),R(4200000,4200000,840000,210000,90000,324,408840),R(5000000,5000000,1000000,250000,100000,388,490608),R(6200000,6200000,1200000,310000,130000,480,606446)
 ];
 const legion=[
  R(1000000,1000000,210000,54000,23000,83,105617),R(1300000,1300000,260000,66000,28000,102,129908),R(1600000,1600000,320000,81000,34000,125,158425),R(1900000,1900000,390000,97000,41000,150,190110),R(2300000,2300000,470000,110000,51000,184,232357),R(2900000,2900000,580000,140000,62000,225,285165),R(3500000,3500000,710000,170000,76000,276,348536),R(4300000,4300000,860000,210000,93000,334,422468),R(5400000,5400000,1000000,270000,110000,418,528085),R(6500000,6500000,1300000,320000,130000,502,633702),R(7800000,7800000,1500000,390000,160000,602,760442),R(9600000,9600000,1900000,480000,200000,744,939991)
 ];
 const helios=[R(85000000,85000000,17000000,4200000,1000000,2236,7892100)];
 const training=[R(2500000,2500000,500000,120000,30000,102,180000),R(3300000,3300000,670000,160000,40000,137,243000),R(4600000,4600000,920000,230000,55000,188,333000),R(6200000,6200000,1200000,310000,75000,255,450000),R(8300000,8300000,1600000,410000,100000,341,603000),R(11000000,11000000,2200000,560000,130000,459,810000),R(15000000,15000000,3000000,750000,180000,612,1080000),R(20000000,20000000,4100000,1000000,240000,836,1476000),R(27000000,27000000,5500000,1300000,330000,1122,1980000),R(37000000,37000000,7500000,1800000,450000,1530,2700000)];
 const healing=training.map(x=>({...x}));
 const firstAid=[R(1200000,1200000,250000,62000,15000,51,90000),R(1600000,1600000,330000,84000,20000,68,121500),R(2300000,2300000,460000,110000,27000,94,166500),R(3100000,3100000,620000,150000,37000,127,225000),R(4100000,4100000,830000,200000,50000,170,301500),R(5600000,5600000,1100000,280000,67000,229,405000),R(7500000,7500000,1500000,370000,90000,308,540000),R(10000000,10000000,2000000,510000,120000,418,738000),R(13000000,13000000,2700000,680000,160000,561,990000),R(18000000,18000000,3700000,930000,220000,765,1350000)];
 const curves={
  Infantry:{'Flame Squad':squad,'Flame Shield':shield,'Flame Strike':shield,'Flame Tomahawk':tomahawk,'Flame Protection':tomahawk,'Flame Legion':legion,'Helios Infantry':helios,'Helios Infantry Training':training,'Helios Infantry Healing':healing,'Helios Infantry First Aid':firstAid},
  Lancer:{'Flame Squad':squad,'Blazing Armor':shield,'Blazing Charge':shield,'Blazing Lance':tomahawk,'Blazing Guardian':tomahawk,'Flame Legion':legion,'Helios Lancer':helios,'Helios Lancer Training':training,'Helios Lancer Healing':healing,'Helios Lancer First Aid':firstAid},
  Marksman:{'Flame Squad':squad,'Crystal Armor':shield,'Crystal Vision':shield,'Crystal Arrow':tomahawk,'Crystal Protection':tomahawk,'Flame Legion':legion,'Helios Marksman':helios,'Helios Marksman Training':training,'Helios Marksman Healing':healing,'Helios Marksman First Aid':firstAid}
 };
 const rows=[];
 // Research Power per level. Exact values from the official Whiteout Survival Wiki (Flame Shield/Protection/Legion, Helios Lancer First Aid);
 // wostools rounds these to 0.1K. Lancer/Marksman share the Infantry curves.
 const powerOf=new Map([
  [squad,60000],
  [shield,[82500,74250,90750,99000,95700,98175,122925,120450]],
  [tomahawk,[120000,108000,103200,103200,101100,103800,106200,107400,123000,123000,120000,126000]],
  [legion,[150000,135000,175000,135000,174500,142500,146500,184000,122500,160000,157000,194000]],
  [helios,8000000],[training,65000],[healing,155000],[firstAid,137250]
 ]);
 const pv=(arr,i)=>{const p=powerOf.get(arr);return Array.isArray(p)?p[i]:(p||0);};
 Object.values(curves).forEach(map=>Object.entries(map).forEach(([track,arr])=>arr.forEach((q,i)=>rows.push({...q,track,level:i+1,power:pv(arr,i)}))));
 const existing=WOS_DB?.warAcademy?.helios?.verifiedRows||[];
 const key=new Set(existing.map(x=>`${x.track}|${x.level}`));
 rows.forEach(x=>{if(!key.has(`${x.track}|${x.level}`))existing.push(x);});
 WOS_DB.warAcademy.helios.verifiedRows=existing;
}
installHeliosRows();
function resetWAState(){waLevels={};waCur={};Object.keys(WA_HELIOS).forEach(t=>{
 waLevels[t]={h:Array(WA_HELIOS[t].length).fill(0),t12:Array(28).fill(0)};
 waCur[t]={h:Array(WA_HELIOS[t].length).fill(0),t12:Array(28).fill(0)};
});}
resetWAState();

const waSum=a=>a.reduce((x,y)=>x+y,0);
function speedFactor(){return 1+(valNum('waSpeed')+valNum('waState')+valNum('waVP'))/100;}
function t12Meta(type){const x=WA_T12[type];return [...x.exalted,...x.moltenI,x.gateway,...x.moltenII,x.solar,...x.moltenIII,...x.t12Support];}
function t12Sections(type){const x=WA_T12[type];return {exalted:[0,5],moltenI:[5,9],gateway:9,moltenII:[10,14],solar:14,moltenIII:[15,19],support:[19,22]};}
function t12Cost(name,from,to){const rows=WA_T12_COST[name]||[];const max=Math.min(to,rows.length);let z=waRes(0,0,0,0,0,0,0,0);for(let i=Math.max(0,from);i<max;i++){waAdd(z,rows[i]);}return z;}
function waAdd(a,b){Object.keys(a).forEach(k=>a[k]+=b[k]);}
// Cost of raising Helios track #track of a troop type from level 0 up to level `to`.
// (Previously the track index was used as the starting LEVEL and the level as an end index, which
// walked past the last track and threw for any level above 10, e.g. the Lv.12 prerequisites.)
// Levels without verified data are NOT guessed: they cost 0 and are reported in the Requirements box.
function heliosCost(type,track,from,to){
 const z=waRes(0,0,0,0,0,0,0,0),rows=WOS_DB?.warAcademy?.helios?.verifiedRows||[];
 const name=WA_HELIOS[type][track][0];
 for(let lv=from+1;lv<=to;lv++){
  const q=rows.find(x=>x.track===name&&x.level===lv);
  if(q)waAdd(z,{meat:q.meat||0,wood:q.wood||0,coal:q.coal||0,iron:q.iron||0,steel:q.steel||0,rfc:q.refinedFC||0,shards:q.shards||0,seconds:q.seconds||0});
  else waMissing.add(`${type} ${name}`);
 }
 return z;
}
// Research Power gained by raising a Helios (T11) track from level `from` to `to`.
function heliosPower(type,track,from,to){
 const rows=WOS_DB?.warAcademy?.helios?.verifiedRows||[],name=WA_HELIOS[type][track][0];let p=0;
 for(let lv=from+1;lv<=to;lv++){const q=rows.find(x=>x.track===name&&x.level===lv);if(q)p+=q.power||0;}
 return p;
}
// ---- Reachability / prerequisite model ----------------------------------
// Requirements are derived from the published War Academy dependency chain.
const WA_T12_FC_REQ=[5,7,8,9,10];
const WA_HELIOS_INDEX={};
Object.keys(WA_HELIOS).forEach(type=>WA_HELIOS_INDEX[type]=Object.fromEntries(WA_HELIOS[type].map((x,i)=>[x[0],i])));
function raise(arr,i,v){if(arr[i]<v){arr[i]=v;return true;}return false;}
function applyHeliosPrereqs(type){
 const h=waLevels[type].h; let changed=false;
 const add=(i,v)=>{if(raise(h,i,v))changed=true;};
 const shieldReq=(level)=>level<=0?0:level<=3?3:level===4?4:5;
 const coreReq=(level)=>level<=0?0:level<=6?6:level===7?7:8;
 // Any Helios-side research ultimately requires the core Flame Legion path.
 const maxHelios=Math.max(...h.slice(6));
 if(maxHelios>0){ add(3,12); add(4,12); add(5,12); }
 // Training/Healing/First Aid require the Helios root.
 if(h[7]>0||h[8]>0||h[9]>0) add(6,1);
 // Direct Flame Shield / Strike targets.
 if(h[1]>0) add(0,shieldReq(h[1]));
 if(h[2]>0) add(0,shieldReq(h[2]));
 // Tomahawk / Protection require their corresponding FC5 core branch depth.
 if(h[3]>0){ add(2,coreReq(h[3])); add(0,5); }
 if(h[4]>0){ add(1,coreReq(h[4])); add(0,5); }
 // Flame Legion depends on both Shield and Strike.
 if(h[5]>0){ add(1,coreReq(h[5])); add(2,coreReq(h[5])); add(0,5); }
 // Helios root requires the full Lv.12 Tomahawk/Protection/Legion prerequisites.
 if(h[6]>0){ add(3,12); add(4,12); add(5,12); }
 return changed;
}
function waT12Upgrading(type){const t=waLevels[type].t12,c=waCur[type].t12;return t.some((v,i)=>v>c[i]);}
function applyT12Prereqs(type){
 const t=waLevels[type].t12,m=WA_T12[type],changed=[]; const add=(i,v)=>{if(raise(t,i,v))changed.push([i,v]);};
 // T12 needs the T11 Helios root of the same troop type (only enforced for T12 levels that are actually being upgraded).
 if(waT12Upgrading(type)&&raise(waLevels[type].h,6,1))changed.push(['helios',1]);
 // Tier 1 Exalted is strictly sequential.
 for(let i=1;i<5;i++) if(t[i]>0) for(let j=0;j<i;j++) add(j,5);
 // Molten I requires all Exalted tracks Lv5.
 if(t.slice(5,9).some(v=>v>0)) for(let i=0;i<5;i++) add(i,5);
 // Gateway levels require all four Molten I tracks at 5/10/15.
 const g=t[9]||0; if(g>0){const need=[5,10,15][Math.min(3,g)-1];for(let i=0;i<4;i++)add(5+i,need);for(let i=0;i<5;i++)add(i,5);}
 // Molten II gates: 1/15/30 -> Gateway 1/2/3.
 const m2=t.slice(10,14),maxM2=Math.max(...m2); if(maxM2>0){const needG=maxM2>=30?3:maxM2>=15?2:1;add(9,needG);for(let i=0;i<5;i++)add(i,5);}
 // Solar gates: 1/6/11 -> Molten II 30/40/50.
 const solar=t[14]||0;if(solar>0){const need=solar>=11?50:solar>=6?40:30;for(let i=0;i<4;i++)add(10+i,need);add(9,3);for(let i=0;i<5;i++)add(i,5);}
 // Molten III requires Solar 15.
 if(t.slice(15,19).some(v=>v>0)){add(14,15);for(let i=0;i<4;i++)add(10+i,50);add(9,3);for(let i=0;i<5;i++)add(i,5);}
 // T12 support tracks: Healing/First Aid open from Gateway 1; Training Lv1 requires Healing+First Aid Lv1.
 const support=t.slice(19,22),training=support[0],healing=support[1],firstAid=support[2];
 if(healing>0||firstAid>0||training>0){add(9,1);for(let i=0;i<5;i++)add(i,5);for(let i=0;i<4;i++)add(5+i,5);}
 if(healing>0) add(20,Math.max(healing-1,0));
 if(firstAid>0) add(21,Math.max(firstAid-1,0));
 if(training>0){add(20,1);add(21,1);}
 return changed.length>0;
}
function t12PrereqProblems(type){
 const t=waLevels[type].t12,m=WA_T12[type],problems=[];
 if(waT12Upgrading(type)&&waLevels[type].h[6]<1&&waCur[type].h[6]<1)problems.push(`T12 ${type} research requires Helios ${type} (T11) unlocked`);
 for(let i=1;i<5;i++) if(t[i]>0&&t[i-1]<5) problems.push(`${m.exalted[i]} requires ${m.exalted[i-1]} Lv.5`);
 if(t.slice(5,9).some(v=>v>0)&&t.slice(0,5).some(v=>v<5)) problems.push('Molten I requires all 5 Exalted tracks Lv.5');
 const g=t[9]||0;if(g>0){const req=[5,10,15][Math.min(3,g)-1];for(let i=0;i<4;i++)if(t[5+i]<req)problems.push(`${m.gateway} Lv.${g} requires all Molten I tracks Lv.${req}`);}
 const m2=t.slice(10,14),maxM2=Math.max(...m2);if(maxM2>0){const reqG=maxM2>=30?3:maxM2>=15?2:1;if(g<reqG)problems.push(`Molten II Lv.${maxM2} requires ${m.gateway} Lv.${reqG}`);}
 const solar=t[14]||0;if(solar>0){const need=solar>=11?50:solar>=6?40:30;for(let i=0;i<4;i++)if(m2[i]<need)problems.push(`Solar Supremacy Lv.${solar} requires all Molten II tracks Lv.${need}`);}
 if(t.slice(15,19).some(v=>v>0)&&solar<15)problems.push('Molten III requires Solar Supremacy Lv.15');
 const support=t.slice(19,22);if(support[1]>0||support[2]>0||support[0]>0){if(g<1)problems.push(`${m.gateway} Lv.1 is required for Exalted Training/Healing/First Aid`);if(support[0]>0&&(support[1]<1||support[2]<1))problems.push('Exalted Training Lv.1 requires Exalted Healing Lv.1 and Exalted First Aid Lv.1');}
 return [...new Set(problems)];
}
function t12TrackFcRequirement(type,index){ if(index<5)return WA_T12_FC_REQ[index]; return 10; }
function t12FcRequirement(type){
 const t=waLevels[type].t12; let req=0;
 for(let i=0;i<5;i++) if(t[i]>0) req=Math.max(req,WA_T12_FC_REQ[i]);
 if(t.slice(5).some(v=>v>0)) req=Math.max(req,10);
 return req;
}
function t12TrainingUnlocked(type){return waLevels[type].t12.slice(0,5).every(v=>v>=5);}

// Returns true when it had to raise any level (so the UI can be re-synced).
function autoPrereq(type){
 if(!document.getElementById('waPrereq')?.checked)return false;
 let changed=false;
 // Chains (Molten II -> Gateway -> Molten I -> Exalted; T12 -> Helios) can need several passes to settle.
 for(let i=0;i<8;i++){const a=applyT12Prereqs(type),b=applyHeliosPrereqs(type);if(!a&&!b)break;changed=true;}
 return changed;
}
function t12UnlockCount(type){return waSum(waLevels[type].t12.slice(0,5));}

// ---------- RENDER (controls are built ONCE, afterwards only synced in place) ----------
function waOpts(max){let s='';for(let i=0;i<=max;i++)s+=`<option value="${i}">${i}</option>`;return s;}
function renderSelect(name,idx,max,type,group){
 const key=`${type}|${group}|${idx}`,o=waOpts(max);
 return `<div class="research-row"><span>${name}<small>max ${max}</small></span><select data-wa="${key}" data-mode="current" aria-label="${name} current" onchange="waSetLevel('${type}','${group}',${idx},'current',this.value)">${o}</select><span>→</span><select data-wa="${key}" data-mode="target" aria-label="${name} target" onchange="waSetLevel('${type}','${group}',${idx},'target',this.value)">${o}</select></div>`;
}
function renderT12(type){
 const m=WA_T12[type];
 return `<div class="bc-section t12-section"><h3>🔥 T12 Exalted &amp; Molten ${type}<small class="t12-threshold" id="waThreshold-${type}"></small></h3><div class="notice">T12 unlocks after all 5 Exalted tracks reach Lv.5. Exalted gates: FC5 → FC7 → FC8 → FC9 → FC10. Molten I/II/III require War Academy FC10. Gateway gates Molten II at Lv.1/2/3; Solar gates Molten III.</div><div class="research-list">`
  +m.exalted.map((n,i)=>renderSelect(n,i,5,type,'t12')).join('')
  +m.moltenI.map((n,i)=>renderSelect(n,5+i,20,type,'t12')).join('')
  +renderSelect(m.gateway,9,3,type,'t12')
  +m.moltenII.map((n,i)=>renderSelect(n,10+i,50,type,'t12')).join('')
  +renderSelect(m.solar,14,15,type,'t12')
  +m.moltenIII.map((n,i)=>renderSelect(n,15+i,50,type,'t12')).join('')
  +'<div class="research-divider">⚔️ T12 Support Research</div>'
  +m.t12Support.map((n,i)=>renderSelect(n,19+i,10,type,'t12')).join('')
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
  const cur=waCur[type][group][idx],isCur=s.dataset.mode==='current';
  s.value=String((isCur?waCur:waLevels)[type][group][idx]);
  if(!isCur)Array.from(s.options).forEach(o=>{o.disabled=+o.value<cur;}); // target can't be below current
 });
}
function initWarAcademy(){buildWAControls();syncWAControls();calcWarAcademy();}

// ---------- ACTIONS ----------
function waSetLevel(type,group,idx,mode,val){
 const cur=waCur[type][group],tgt=waLevels[type][group];val=+val;
 if(mode==='current'){cur[idx]=val;if(tgt[idx]<val)tgt[idx]=val;} // raising current past target drags target along (0 upgrades)
 else tgt[idx]=Math.max(val,cur[idx]);
 autoPrereq(type);
 syncWAControls();calcWarAcademy();
}
function waSetBranch(type,v,group){ // v=0: "Reset Current" (Helios + T12 current back to 0); v>0: "Max Helios" (targets)
 if(v===0){
  waCur[type].h=waCur[type].h.map(()=>0);waCur[type].t12=waCur[type].t12.map(()=>0);
 }else{
  waLevels[type].h=waLevels[type].h.map((x,i)=>Math.max(waCur[type].h[i],Math.min(v,WA_HELIOS[type][i][1])));
 }
 autoPrereq(type);
 syncWAControls();calcWarAcademy();
}
function waSetAll(v){ // "Set All Helios Lv.N": sets TARGETS, never below current
 Object.keys(WA_HELIOS).forEach(type=>{waLevels[type].h=waLevels[type].h.map((x,i)=>Math.max(waCur[type].h[i],Math.min(v,WA_HELIOS[type][i][1])));autoPrereq(type);});
 syncWAControls();calcWarAcademy();
}
function waSetT12(type,v){ // targets only
 const arr=waLevels[type].t12,cur=waCur[type].t12;
 if(v===5){for(let i=0;i<5;i++)arr[i]=Math.max(cur[i],5);}else{t12Meta(type).forEach((n,i)=>arr[i]=Math.max(cur[i],WA_T12_MAX(n)));}
 syncWAControls();calcWarAcademy();
}

// ---------- CALC ----------
function calcWarAcademy(){
 let total=waRes(0,0,0,0,0,0,0,0),levels=0,power=0,hPower=0,changed=false;const per={};waMissing=new Set();
 Object.keys(WA_HELIOS).forEach(type=>{
  if(autoPrereq(type))changed=true;
  const lv=waLevels[type],cu=waCur[type],c=waRes(0,0,0,0,0,0,0,0);
  lv.h.forEach((to,i)=>{waAdd(c,heliosCost(type,i,cu.h[i],to));hPower+=heliosPower(type,i,cu.h[i],to);});
  const problems=t12PrereqProblems(type),fcReq=t12FcRequirement(type),fcLocked=valNum('waFcLevel')<fcReq, fc=valNum('waFcLevel');
  // Count only prerequisite-valid tracks. Each T12 track is independently gated by its required War Academy FC.
  let countedT12Levels=0;
  if(!problems.length || document.getElementById('waPrereq')?.checked){
    t12Meta(type).forEach((n,i)=>{ const trackReq=t12TrackFcRequirement(type,i); if(fc>=trackReq){waAdd(c,t12Cost(n,cu.t12[i],lv.t12[i])); countedT12Levels+=Math.max(0,lv.t12[i]-cu.t12[i]); const rows=WA_T12_COST[n]||[]; for(let j=cu.t12[i];j<Math.min(lv.t12[i],rows.length);j++) power+=(rows[j].power||0);} });
  }
  waAdd(total,c);
  levels+=waSum(lv.h)-waSum(cu.h)+countedT12Levels;
  per[type]={c,unlock:t12UnlockCount(type),heliosUnlocked:lv.h[6]>0,problems,fcReq,t12TrainingUnlocked:t12TrainingUnlocked(type),fcLocked};
 });
 if(changed)syncWAControls(); // "Auto-add Prerequisites" was just ticked -> reflect it in the selects
 const inv={shards:valNum('waShards'),rfc:valNum('waRfc'),steel:valNum('waSteel'),meat:valNum('waMeat'),wood:valNum('waWood'),coal:valNum('waCoal'),iron:valNum('waIron')};
 window._warAcademyTotals={...total};
 const gap={};Object.keys(inv).forEach(k=>gap[k]=Math.max(0,total[k]-inv[k]));
 Object.keys(WA_T12).forEach(type=>{const el=document.getElementById('waThreshold-'+type);if(el){const n=per[type]?.unlock||0;el.textContent=` · ${n}/25 Tier 1 Exalted`;el.className='t12-threshold '+(n>=25?'ok':'warn');}});
 const result=document.getElementById('waResult');if(!result)return;
 result.innerHTML=[
  [fmt(total.shards),'<img class="res-ic" src="images/resources/fire-crystal-shard.webp" alt="FC Shard"> FC Shards'],
  [fmt(total.rfc),'<i class="bi bi-gem"></i> Refined FC'],
  [fmt(total.steel),'<i class="bi bi-gear-fill"></i> Steel'],
  [fmt(total.meat),'<img class="res-ic" src="images/resources/meat.webp" alt="Meat"> Meat'],
  [fmt(total.wood),'<img class="res-ic" src="images/resources/wood.webp" alt="Wood"> Wood'],
  [fmt(total.coal),'<img class="res-ic" src="images/resources/coal.webp" alt="Coal"> Coal'],
  [fmt(total.iron),'<img class="res-ic" src="images/resources/iron.webp" alt="Iron"> Iron'],
  [formatDuration(total.seconds/speedFactor()),'<i class="bi bi-stopwatch-fill"></i> Research Time'],
  [fmt(levels),'<i class="bi bi-graph-up-arrow"></i> Upgrades (levels)'],
  [fmt(power),'<i class="bi bi-lightning-charge-fill"></i> T12 Research Power'],
  [fmt(hPower),'<i class="bi bi-lightning-charge"></i> Helios (T11) Research Power'],
  [fmt(gap.shards),'<i class="bi bi-exclamation-circle"></i> FC Shards Needed'],
  [fmt(gap.rfc),'<i class="bi bi-exclamation-circle"></i> Refined FC Needed']
 ].map(x=>statCard(x[0],x[1])).join('');
 const fc=valNum('waFcLevel'),warnings=[];
 Object.entries(per).forEach(([type,p])=>{
  if(p.problems.length)warnings.push(`${type}: ${p.problems.join('; ')}.`);
  if(p.fcLocked)warnings.push(`${type}: some selected T12 research is locked at War Academy FC ${fc}; the required FC gate is up to FC ${p.fcReq}. Locked track costs are excluded from totals.`);
  if(p.c.rfc>0&&fc<10)warnings.push(`${type}: War Academy FC 10 is required for Molten research.`);
 });
 if(waMissing.size){const m=[...waMissing];warnings.push(`No verified cost data for ${m.slice(0,5).join(', ')}${m.length>5?` +${m.length-5} more`:''}: those levels are not included in the totals.`);}
 let box=document.getElementById('waWarnings');
 if(!box){box=document.createElement('div');box.id='waWarnings';box.className='notice';result.parentElement.appendChild(box);}
 box.innerHTML=warnings.length?`<b>Requirements:</b> ${warnings.join(' ')}`:`<b>Requirements:</b> all selected research prerequisites and FC gates are satisfied.`;
}
