/* Marvelous Fantasia — original local-only tile matching practice game. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const BEST_KEY = 'wos3475_marvelous_fantasia_best_v1';
  const TILE_SET = [['🔥','Fire'],['❄️','Frost'],['💎','Gem'],['🪵','Wood'],['🪨','Stone'],['⚔️','Sword'],['🛡️','Shield'],['⭐','Star'],['🍖','Meat'],['🪙','Coin'],['🌲','Pine'],['🏹','Bow']];
  const state = {level:1,best:1,tiles:[],storage:[],charges:{withdraw:1,reconstruct:1,remove:1},over:false,busy:false,serial:0};
  const rand = n => Math.floor(Math.random()*n);
  const shuffle = a => {for(let i=a.length-1;i>0;i--){const j=rand(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;};
  const setMessage = (msg,kind='') => {const el=$('mfMessage');if(el){el.textContent=msg;el.className='mf-game-status'+(kind?' '+kind:'');}};
  const getLayout = level => {
    const a=[];
    for(let y=0;y<4;y++)for(let x=0;x<8;x++)a.push({x,y,z:0});
    for(let y=0;y<2;y++)for(let x=1;x<7;x++)a.push({x,y:y+1,z:1});
    for(let x=2;x<6;x++)a.push({x,y:2,z:2});
    const extra=Math.min(12,Math.floor((level-1)/2));
    for(let i=0;i<extra;i++)a.push({x:rand(8),y:rand(4),z:3});
    while(a.length%3)a.push({x:rand(8),y:rand(4),z:0});
    return a;
  };
  const newGame = (level=1) => {
    state.level=level;state.storage=[];state.over=false;state.busy=false;
    state.charges={withdraw:1,reconstruct:1,remove:1};
    const layout=getLayout(level),deck=[];
    for(let i=0;i<layout.length/3;i++){const t=rand(TILE_SET.length);deck.push(t,t,t);}
    shuffle(deck);
    state.tiles=layout.map((p,i)=>({id:++state.serial,type:deck[i],x:p.x,y:p.y,z:p.z,removed:false}));
    render();setMessage('Tap any tile that is not covered by another tile.');
  };
  const isCovered = tile => state.tiles.some(o=>!o.removed&&o.z>tile.z&&Math.abs(o.x-tile.x)<=1&&Math.abs(o.y-tile.y)<=1);
  const accessible = () => state.tiles.filter(t=>!t.removed&&!isCovered(t));
  const addToStorage = tile => {
    state.storage.push(tile);
    const matches=state.storage.filter(t=>t.type===tile.type);
    if(matches.length>=3){
      let n=0;
      state.storage=state.storage.filter(t=>{if(t.type===tile.type&&n<3){n++;return false;}return true;});
      setMessage('Match cleared! Three '+TILE_SET[tile.type][1]+' tiles removed.','good');
    }
    if(state.storage.length>=7){state.over=true;setMessage('Storage Zone is full. Run over — restart this level to try again.','bad');}
  };
  const advance = () => {
    state.best=Math.max(state.best,state.level+1);
    try{localStorage.setItem(BEST_KEY,String(state.best));}catch(_){}
    setMessage('Board cleared! Next level is ready.','good');render();state.busy=true;
    window.setTimeout(()=>newGame(state.level+1),850);
  };
  const pickTile = id => {
    if(state.over||state.busy)return;
    const t=state.tiles.find(x=>x.id===id);
    if(!t||t.removed||isCovered(t))return;
    t.removed=true;addToStorage(t);
    if(!state.over&&state.tiles.every(x=>x.removed)){
      if(state.storage.length===0){advance();return;}
      state.over=true;setMessage('Board cleared, but Storage is not empty. Run over!','bad');
    }
    render();
  };
  const render = () => {
    const board=$('mfBoard'),storage=$('mfStorage');if(!board||!storage)return;
    $('mfLevel').textContent=state.level;$('mfBest').textContent=state.best;
    $('mfStorageCount').textContent=state.storage.length+' / 7';
    $('mfWithdrawCount').textContent=state.charges.withdraw;
    $('mfReconstructCount').textContent=state.charges.reconstruct;
    $('mfRemoveCount').textContent=state.charges.remove;
    board.innerHTML='';
    state.tiles.filter(t=>!t.removed).sort((a,b)=>a.z-b.z).forEach(t=>{
      const covered=isCovered(t),b=document.createElement('button');
      b.type='button';b.className='mf-tile'+(covered?' mf-covered':'');
      b.textContent=TILE_SET[t.type][0];b.title=covered?'Covered tile':TILE_SET[t.type][1];
      b.disabled=covered||state.over||state.busy;
      b.style.left=(t.x*48+t.z*7)+'px';b.style.top=(t.y*58-t.z*7)+'px';
      b.style.zIndex=t.z*100+t.y*8+t.x;b.addEventListener('click',()=>pickTile(t.id));
      board.appendChild(b);
    });
    storage.innerHTML='';
    for(let i=0;i<7;i++){
      const slot=document.createElement('div'),t=state.storage[i];
      slot.className='mf-slot'+(t?' filled':'');slot.textContent=t?TILE_SET[t.type][0]:'·';
      slot.title=t?TILE_SET[t.type][1]:'Empty slot';storage.appendChild(slot);
    }
    $('mfWithdraw').disabled=state.over||!state.charges.withdraw||!state.storage.length;
    $('mfReconstruct').disabled=state.over||!state.charges.reconstruct||!state.tiles.some(t=>!t.removed);
    $('mfRemove').disabled=state.over||!state.charges.remove||!accessible().length||state.storage.length>=7;
  };
  const withdraw = () => {
    if(state.over||!state.charges.withdraw||!state.storage.length)return;
    const t=state.storage.pop();t.removed=false;state.charges.withdraw--;
    setMessage('Last tile returned to the board.','good');render();
  };
  const reconstruct = () => {
    if(state.over||!state.charges.reconstruct)return;
    const a=state.tiles.filter(t=>!t.removed),types=shuffle(a.map(t=>t.type));
    a.forEach((t,i)=>t.type=types[i]);state.charges.reconstruct--;
    setMessage('Remaining tiles have been shuffled.','good');render();
  };
  const remove = () => {
    if(state.over||!state.charges.remove)return;
    const picks=accessible().slice(0,Math.min(3,7-state.storage.length));
    if(!picks.length)return;
    picks.forEach(t=>{t.removed=true;addToStorage(t);});
    state.charges.remove--;
    if(!state.over&&state.tiles.every(t=>t.removed)&&state.storage.length===0){advance();return;}
    render();
  };
  const init = () => {
    if(!$('mfBoard')||$('mfBoard').dataset.ready)return;
    $('mfBoard').dataset.ready='1';
    try{state.best=Math.max(1,Number(localStorage.getItem(BEST_KEY))||1);}catch(_){}
    $('mfRestart').addEventListener('click',()=>newGame(state.level));
    $('mfWithdraw').addEventListener('click',withdraw);
    $('mfReconstruct').addEventListener('click',reconstruct);
    $('mfRemove').addEventListener('click',remove);
    newGame(1);
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
