/* Dreamscape Memory — local timed scene-reference practice. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const items = [
    'Map','Corn','Feather','Butterfly','Balloon','Camera','Rubber duck',
    'Starfish','Sunflower','Wing','Drifting bottle','Spider web','Scarf','Ball'
  ];
  const state={time:60,found:new Set(),queue:[],active:[],running:false,timer:null,hints:0};
  const shuffle=a=>{const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]];}return x;};
  const status=(s,k='')=>{const el=$('dmStatus');if(el){el.textContent=s;el.className='dm-status'+(k?' '+k:'');}};
  const render=()=>{
    $('dmTime').textContent=state.time+'s';
    $('dmFound').textContent=state.found.size+' / '+items.length;
    $('dmTargets').innerHTML=state.active.length?state.active.map(i=>'<div class="dm-target '+(state.found.has(i)?'done':'')+'">'+(state.found.has(i)?'✓ ':'')+items[i-1]+'</div>').join(''):'<p class="dm-muted">Round complete.</p>';
    $('dmChoices').innerHTML=items.map((name,i)=>'<button type="button" class="dm-choice" data-num="'+(i+1)+'" '+(!state.running||state.found.has(i+1)?'disabled':'')+'>'+String(i+1).padStart(2,'0')+'</button>').join('');
    $('dmChoices').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>choose(Number(b.dataset.num))));
  };
  const finish=(won)=>{
    state.running=false;if(state.timer)clearInterval(state.timer);state.timer=null;
    render();status(won?'Scene cleared! You found all 14 objects.':'Time is up! Press Start to try again.',won?'good':'bad');
  };
  const nextRound=()=>{
    if(state.found.size===items.length){finish(true);return;}
    state.active=state.queue.splice(0,3);
    if(!state.active.length)state.active=items.map((_,i)=>i+1).filter(i=>!state.found.has(i)).slice(0,3);
    render();
  };
  const choose=n=>{
    if(!state.running||state.found.has(n))return;
    if(!state.active.includes(n)){status('Not one of the current targets — check the map number again.');return;}
    state.found.add(n);
    if(state.active.every(i=>state.found.has(i)))nextRound();else render();
    if(state.found.size===items.length)finish(true);
  };
  const start=()=>{
    if(state.timer)clearInterval(state.timer);
    state.time=60;state.found=new Set();state.queue=shuffle(items.map((_,i)=>i+1));state.active=[];state.running=true;state.hints=0;
    nextRound();status('Go! Find the numbered objects before the timer runs out.','good');
    state.timer=setInterval(()=>{state.time--;render();if(state.time<=0)finish(false);},1000);
  };
  const hint=()=>{
    if(!state.running||!state.active.length)return;
    const left=state.active.filter(i=>!state.found.has(i));
    if(!left.length)return;
    const target=left[0];state.hints++;
    status('Hint: look for '+items[target-1]+' — it is marked as number '+target+'.','good');
  };
  const init=()=>{
    if(!$('dmStart')||$('dmStart').dataset.ready)return;
    $('dmStart').dataset.ready='1';
    $('dmStart').addEventListener('click',start);
    $('dmHint').addEventListener('click',hint);
    render();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
