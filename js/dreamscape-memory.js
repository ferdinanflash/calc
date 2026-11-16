/* Dreamscape Memory — local timed scene-reference practice. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const scenes = {
    garden: {name:'Garden · Season 5', image:'https://wostools.net/images/dreamscape/garden-s5-wm.webp', items:['Map','Corn','Feather','Butterfly','Balloon','Camera','Rubber duck','Starfish','Sunflower','Wing','Drifting bottle','Spider web','Scarf','Ball']},
    windmill: {name:'Windmill · Season 5', image:'https://wostools.net/images/dreamscape/windmill-wm.webp', items:['Windmill','Blueprint','Mailbox','Windsock','Toolbox','Flare','Axe','Watchtower','Scarf','Snowmobile','Arrow sign','Hook','Shovel','Heart','Wheat','Hot air balloon','Whip','Waterbag','Giant elk','Sign post','Lantern','Pouch','Ladder','Flower bed','Rifle','Stool','Skis','Birds','Horse','Snowman','Plane']},
    farmhouse: {name:'Farmhouse · Season 5', image:'https://wostools.net/images/dreamscape/farmhouse-s5-wm.webp', items:['Airship','Balloons','Chimney','Earmuffs','Fence','Flower basket','Fork knife','Glass bottle','Glove','Hanging rug','Iron axe','Megaphone','Pine tree','Potatoes','Shovel','Skylight','Spiked flail','Sword','Turkey','Fur mantle','Yak','Eggs','Patch','Ladle','Apple','Chestplate','Fish','Iron pot','Mushroom','Pigeon','Pumpkin','Shield','Corn','Crossbow']},
    cityhall: {name:'City Hall · Season 5', image:'https://wostools.net/images/dreamscape/city-hall-s5-wm.webp', items:['Air drop','Airship','Balloons','Bowknot','Butterfly','Clock','Compass','Diamond','Envelope','Flag garland','Flowers','Globe','Keys','Lightning','Newspaper','Number plate','Pipe','Shield','Spring','Sun','Swan','Camera','Cat','Chandelier','Chimney','Cogwheel','Crack','Crow','Four leaf clover','Giftbox','Goggles','Harp','Ladder','Medal','Motorcycle','Pine tree','Scarf','Searchlight','Star','Tower','Twin swords','Vines','Walking stick','Wrench','8','Scroll','N','Paper windmill']}
  };
  let currentScene='garden';
  let items = scenes[currentScene].items;
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
    render();status(won?'Scene cleared! You found all '+items.length+' objects.':'Time is up! Press Start to try again.',won?'good':'bad');
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
    items=scenes[currentScene].items;state.time=60;state.found=new Set();state.queue=shuffle(items.map((_,i)=>i+1));state.active=[];state.running=true;state.hints=0;
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
    $('dmScene').addEventListener('change',()=>{currentScene=$('dmScene').value;items=scenes[currentScene].items;$('dmSceneImage').src=scenes[currentScene].image;$('dmSceneImage').alt='Dreamscape Memory '+scenes[currentScene].name+' annotated scene';if(state.timer)clearInterval(state.timer);state.timer=null;state.running=false;state.found=new Set();state.active=[];state.queue=[];$('dmTime').textContent='60s';$('dmFound').textContent='0 / '+items.length;$('dmTargets').innerHTML='<p class="dm-muted">Targets will appear here when you start.</p>';$('dmChoices').innerHTML='';status('Selected '+scenes[currentScene].name+'. Press Start to play.');});
    $('dmHint').addEventListener('click',hint);
    const sceneImage=$('dmSceneImage');
    sceneImage.tabIndex=0;
    sceneImage.setAttribute('role','button');
    sceneImage.setAttribute('aria-label','Tap to enlarge the Dreamscape map');
    sceneImage.title='Tap to enlarge map';
    const openMapZoom=()=>{
      if($('dmImageZoom'))return;
      const overlay=document.createElement('div');
      overlay.id='dmImageZoom';
      overlay.className='dm-image-zoom';
      overlay.setAttribute('role','dialog');
      overlay.setAttribute('aria-modal','true');
      overlay.setAttribute('aria-label','Enlarged Dreamscape map');
      overlay.innerHTML='<button type="button" class="dm-image-zoom-close" aria-label="Close enlarged map">×</button><img alt="">';
      overlay.querySelector('img').src=sceneImage.currentSrc||sceneImage.src;
      overlay.querySelector('img').alt=sceneImage.alt;
      const close=()=>overlay.remove();
      overlay.addEventListener('click',e=>{if(e.target===overlay||e.target.classList.contains('dm-image-zoom-close'))close();});
      document.addEventListener('keydown',function onKey(e){if(e.key==='Escape'&&$('dmImageZoom')){close();document.removeEventListener('keydown',onKey);}});
      document.body.appendChild(overlay);
      overlay.querySelector('.dm-image-zoom-close').focus();
    };
    sceneImage.addEventListener('click',openMapZoom);
    sceneImage.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openMapZoom();}});
    render();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
