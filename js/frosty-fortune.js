/* Frosty Fortune Simulator — community-sourced drop tables, local-only session */
(() => {
 'use strict';
 const $=id=>document.getElementById(id),fmt=n=>Math.round(n).toLocaleString('en-US');
 const rarity=[['Splendid',8.5],['Exquisite',24],['Regular',67.5]];
 const tables={
 Splendid:[['Thorn of Enigma ×100',2],['Thorn of Enigma ×50',6],['Thorn of Enigma ×20',42],['Treasure Hunt Chest ×10',9],['Mythic General Hero Shard ×5',1],['Mythic General Hero Shard ×3',5],['Mythic General Hero Shard ×1',15],['Lucky Hero Gear Chest ×1',8],['Fire Crystal ×100',.5],['Fire Crystal ×20',3.5],['Fire Crystal ×10',8]],
 Exquisite:[['Thorn of Enigma ×100',.5],['Thorn of Enigma ×20',6],['Thorn of Enigma ×6',42],['Treasure Hunt Chest ×3',9],['Mythic General Hero Shard ×3',1],['Mythic General Hero Shard ×2',5],['Mythic General Hero Shard ×1',16],['Lucky Hero Gear Chest ×1',8],['Fire Crystal ×50',.5],['Fire Crystal ×10',4],['Fire Crystal ×5',8]],
 Regular:[['Thorn of Enigma ×100',.3],['Thorn of Enigma ×6',10.7],['Thorn of Enigma ×2',40.5],['Treasure Hunt Chest ×1',10],['Mythic General Hero Shard ×3',1],['Mythic General Hero Shard ×2',4],['Mythic General Hero Shard ×1',13],['Lucky Hero Gear Chest ×1',8],['Fire Crystal ×20',.5],['Fire Crystal ×5',4],['Fire Crystal ×2',8]]
 };
 const skinOdds={snowmobile:[[2800,73.28],[3800,97.59],[4800,99.77],[5800,99.98],[6800,99.99],[7800,99.99],[8800,100]],mammoth:[[2800,17.25],[3800,58.54],[4800,84.06],[5800,95.65],[6800,99.15],[7800,99.90],[8800,99.99]],furnace:[[20000,91],[26000,100]]};
 const packs=[[.99,120,500],[2.99,360,1500],[4.99,500,2500],[9.99,900,4000],[19.99,1700,6000],[49.99,3500,12000],[99.99,6000,20000]];
 let s;
 const rewardAsset=label=>{
  const s=String(label||'').toLowerCase();
  if(s.includes('thorn of enigma'))return 'assets/frosty-fortune/thorn_of_enigma.png';
  if(s.includes('treasure hunt chest'))return 'assets/frosty-fortune/treasure_hunt_chest.png';
  if(s.includes('mythic general hero shard'))return 'assets/frosty-fortune/mythic_general_hero_shard.png';
  if(s.includes('lucky hero gear chest'))return 'assets/frosty-fortune/lucky_hero_gear_chest.png';
  if(s.includes('fire crystal'))return 'images/resources/fire-crystal.webp';
  if(s.includes('gems of enigma'))return '';
  return '';
 };
 const rewardIcon=(label,cls='frost-reward-icon')=>{const src=rewardAsset(label);return src?'<img class="'+cls+'" src="'+src+'" alt="" loading="lazy">':''};
 const chestAsset=r=>'assets/frosty-fortune/'+r.toLowerCase()+'_chest.png';
 const weighted=a=>{let r=Math.random()*a.reduce((v,x)=>v+x[1],0);for(const x of a){r-=x[1];if(r<=0)return x[0]}return a[a.length-1][0]};
 function makeBoard(){s.board=Array.from({length:9},()=>{const r=weighted(rarity);return {rarity:r,reward:weighted(tables[r]),opened:false}});s.freeCleared=false;render();}
 function fresh(){s={day:1,gems:0,opened:0,thorns:0,spent:0,free:3,boards:0,rewards:{},board:[]};makeBoard();message('New event session started.');totals();}
 function budget(){return Math.max(0,Number($('frostBudget').value)||0)}
 function canSpend(n){return !budget()||s.spent+n<=budget()}
 function rewardAmount(label){const m=label.match(/×([\d,]+)/);return m?Number(m[1].replace(/,/g,'')):1}
 function open(i){const c=s.board[i];if(!c||c.opened)return;if(!canSpend(60)){message('Gems of Enigma budget reached. Increase your budget to continue.');return}
 c.opened=true;s.spent+=60;s.gems+=60;s.opened++;const label=c.reward;s.rewards[label]=(s.rewards[label]||0)+1;
 if(label.startsWith('Thorn'))s.thorns+=rewardAmount(label);
 render();totals();message('Opened '+c.rarity+' Chest: '+label);
 if(s.board.every(x=>x.opened)){s.freeCleared=true;makeBoard();message('Board cleared! A new board is ready for free.');}
 }
 function refresh(){if(s.board.every(x=>x.opened)){makeBoard();message('Board cleared — free refresh.');return}
 if(s.free>0){s.free--;makeBoard();message('Free refresh used.');return}
 if(!canSpend(90)){message('Not enough Gems of Enigma for a 90-Gem refresh.');return}
 s.spent+=90;s.gems+=90;makeBoard();message('Paid refresh: 90 Gems of Enigma.');totals();}
 function nextDay(){if(s.day>=7){message('You have reached Day 7. Reset the session to start again.');return}s.day++;s.free=3;makeBoard();render();totals();message('Day '+s.day+' started. Three free refreshes restored.');}
 function message(t){$('frostMessage').textContent=t}
 function render(){if(!s)return;$('frostStatus').innerHTML=[['Event day',s.day+' / 7'],['Gems used',fmt(s.gems)],['Free refreshes left',s.free],['Chests opened',s.opened]].map(x=>'<div><span>'+x[0]+'</span><strong>'+x[1]+'</strong></div>').join('');$('frostBoardCount').textContent=s.board.filter(x=>!x.opened).length+'/9 unopened';$('frostBoard').innerHTML=s.board.map((c,i)=>{const art=c.opened?(rewardIcon(c.reward)||'<span class="chest-art">🎁</span>'):'<img class="frost-chest-art" src="'+chestAsset(c.rarity)+'" alt="" loading="lazy">';return '<button class="frost-chest '+c.rarity.toLowerCase()+' '+(c.opened?'opened':'')+'" data-i="'+i+'" '+(c.opened?'disabled':'')+'>'+art+'<strong>'+c.rarity+' Chest</strong><small>'+(c.opened?c.reward:'60 Gems · Tap to open')+'</small></button>';}).join('');$('frostBoard').querySelectorAll('[data-i]').forEach(b=>b.addEventListener('click',()=>open(+b.dataset.i)));skinPlan();}
 function totals(){if(!s)return;$('frostTotals').innerHTML=[['Chests opened',fmt(s.opened)],['Gems of Enigma spent',fmt(s.spent)],['Thorns collected',fmt(s.thorns)],['Gems / Thorn',s.thorns?(s.spent/s.thorns).toFixed(1):'—']].map(x=>'<div><span>'+x[0]+'</span><strong>'+x[1]+'</strong></div>').join('');$('frostTally').innerHTML=Object.entries(s.rewards).length?'<div class="frost-head"><span>Reward</span><span>Draws</span><span>Quantity</span></div>'+Object.entries(s.rewards).map(([k,v])=>'<div><span class="frost-tally-reward">'+(rewardIcon(k,'frost-tally-icon'))+k+'</span><span>'+v+'</span><span>'+fmt(rewardAmount(k)*v)+'</span></div>').join(''):'<div><span>Open a chest to track rewards.</span></div>';render();}
 function chanceAt(rows,n){if(n<=0)return 0;const exact=rows.find(x=>x[0]===n);if(exact)return exact[1];let i=rows.findIndex(x=>x[0]>n);if(i<0)return rows[rows.length-1][1];if(i===0)return rows[0][1]*n/rows[0][0];const a=rows[i-1],b=rows[i];return a[1]+(b[1]-a[1])*(n-a[0])/(b[0]-a[0]);}
 function skinPlan(){if(!$('frostSkin'))return;const k=$('frostSkin').value,n=Math.max(0,+$('frostSkinBudget').value||0),rows=skinOdds[k],chance=chanceAt(rows,n);const p90=rows.find(x=>x[1]>=90)?.[0]||0,p99=rows.find(x=>x[1]>=99)?.[0]||rows[rows.length-1][0];$('frostSkinResult').innerHTML=[['Estimated chance',chance.toFixed(1)+'%'],['Gems for 90%+',fmt(p90)],['Gems for 99%+',fmt(p99)],['Target budget',fmt(n)]].map(x=>'<div><span>'+x[0]+'</span><strong>'+x[1]+'</strong></div>').join('');$('frostSkinTable').innerHTML='<div class="frost-head"><span>Gems spent</span><span>Snowmobile</span><span>Mammoth</span></div>'+[2800,3800,4800,5800,6800,7800,8800].map(v=>'<div><span>'+fmt(v)+'</span><span>'+chanceAt(skinOdds.snowmobile,v).toFixed(2)+'%</span><span>'+chanceAt(skinOdds.mammoth,v).toFixed(2)+'%</span></div>').join('');$('frostPackTable').innerHTML='<div class="frost-head"><span>Pack price</span><span>Enigma Gems</span><span>Gems / $</span></div>'+packs.map(x=>'<div><span>$'+x[0].toFixed(2)+'</span><span>'+fmt(x[1])+'</span><span>'+(x[1]/x[0]).toFixed(1)+'</span></div>').join('');}
 function odds(){const out=[];for(const r of ['Splendid','Exquisite','Regular']){out.push('<div class="frost-head"><span>'+r+' · '+rarity.find(x=>x[0]===r)[1]+'% tiles</span><span>Reward chance</span><span>Per tile</span></div>');tables[r].forEach(x=>out.push('<div><span>'+x[0]+'</span><span>'+x[1]+'%</span><span>'+(x[1]*rarity.find(y=>y[0]===r)[1]/100).toFixed(3)+'%</span></div>'))}$('frostOdds').innerHTML=out.join('');}
 function openAffordableOnly(rarityFilter){const board=s.board;for(let i=0;i<board.length;i++){if(s.board!==board)break;const chest=board[i];if(!chest.opened&&(!rarityFilter||chest.rarity===rarityFilter)&&canSpend(60))open(i);}}
 function bind(){const root=$('frostyFortuneModal');if(!root||root.dataset.bound)return;root.dataset.bound='1';$('frostRefresh').addEventListener('click',refresh);$('frostOpenAll').addEventListener('click',()=>openAffordableOnly(null));$('frostOpenExquisite').addEventListener('click',()=>openAffordableOnly('Exquisite'));$('frostNextDay').addEventListener('click',nextDay);$('frostReset').addEventListener('click',fresh);$('frostSkin').addEventListener('change',skinPlan);$('frostSkinBudget').addEventListener('input',skinPlan);fresh();odds();}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})();