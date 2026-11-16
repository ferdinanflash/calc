/* Dreamscape Memory — playable stages for every available map. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const gardenTargets = {
    1:[['Corn',70,69],['Feather',43,72],['Ball',86,98]],
    2:[['Butterfly',97,58],['Rubber duck',28,74],['Corn',67,70]],
    3:[['Butterfly',97,58],['Starfish',18,61],['Rubber duck',28,74]],
    4:[['Spider web',80,27]],
    5:[['Scarf',70,70]]
  };
  const data = () => window.DREAMSCAPE_MAP_DATA || [];
  let mapId='garden-s5', stageNo=1, pool=[], batch=[], currentImage='';
  const state={time:60,found:new Set(),running:false,timer:null,completed:0,total:0,hints:0};
  const currentMap=()=>data().find(m=>m.id===mapId)||data()[0];
  const isGarden=()=>mapId==='garden-s5';
  const assetUrl=p=>p?(p.startsWith('http')?p:'https://wostools.net'+p):'';
  const status=(s,k='')=>{const el=$('dmStatus');if(el){el.textContent=s;el.className='dm-status'+(k?' '+k:'');}};
  const stopTimer=()=>{if(state.timer)clearInterval(state.timer);state.timer=null;};
  const stageObjects=()=>{
    if(isGarden()&&gardenTargets[stageNo]) return gardenTargets[stageNo].map((t,i)=>({n:i+1,item:t[0],x:t[1]/100,y:t[2]/100,w:.055,h:.055,rot:0}));
    const m=currentMap();
    const eligible=(m.coords||[]).filter(c=>!c.stages?.length||c.stages.includes(stageNo));
    return eligible.length?eligible:((m.coords||[]).length?(m.coords||[]):(m.items||[]).map((item,i)=>({n:i+1,item})));
  };
  const shuffle=a=>{const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]];}return x;};
  const pickBatch=()=>{
    batch=pool.splice(0,Math.min(3,pool.length));
    state.found=new Set();state.time=60;state.hints=0;
    render();
    if(batch.length)status('New targets! Find all '+batch.length+' object(s) on the map.','good');
    else finish(true);
  };
  const render=()=>{
    const total=pool.length+batch.length;
    $('dmTime').textContent=state.time+'s';
    $('dmFound').textContent=state.completed+' / '+(state.completed+total);
    $('dmTargets').innerHTML=batch.map((c,i)=>'<div class="dm-target '+(state.found.has(c.n)?'done':'')+'">'+(state.found.has(c.n)?'✓ ':'')+c.item+'</div>').join('')||'<p class="dm-muted">Press Start to show the targets.</p>';
    const hasCoords=(currentMap().coords||[]).length>0;
    $('dmChoiceTitle').textContent=hasCoords?'Tap the object directly on the map':'Tap the matching number on the reference map';
    $('dmChoices').innerHTML=hasCoords?'':batch.map(c=>'<button type="button" class="dm-choice" data-num="'+c.n+'" '+(!state.running||state.found.has(c.n)?'disabled':'')+'>'+String(c.n).padStart(2,'0')+'</button>').join('');
    $('dmMapHotspots').innerHTML='';
    if(hasCoords&&state.running){
      batch.forEach(c=>{if(state.found.has(c.n))return;const b=document.createElement('button');b.type='button';b.className='dm-hotspot';b.style.left=(c.x*100)+'%';b.style.top=(c.y*100)+'%';b.style.width=Math.max(3,c.w*100)+'%';b.style.height=Math.max(3,c.h*100)+'%';b.style.transform='translate(-50%,-50%) rotate('+(c.rot||0)+'deg)';b.setAttribute('aria-label','Find '+c.item);b.title='Tap '+c.item;b.addEventListener('click',()=>foundTarget(c.n));$('dmMapHotspots').appendChild(b);});
    }
    $('dmChoices').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>foundTarget(Number(b.dataset.num))));
  };
  const finish=won=>{state.running=false;stopTimer();render();status(won?'Map cleared! All objects found.':'Time is up! Press Start to try this round again.',won?'good':'bad');};
  const foundTarget=n=>{
    if(!state.running||state.found.has(n))return;
    state.found.add(n);state.completed++;render();
    if(state.found.size===batch.length){
      if(pool.length){pickBatch();}
      else finish(true);
    } else status('Great! '+(batch.length-state.found.size)+' target(s) left in this set.','good');
  };
  const start=()=>{
    stopTimer();state.completed=0;state.found=new Set();state.running=true;
    const objects=stageObjects();
    if(!objects.length){state.running=false;status('This map has no object coordinates yet. Use Map Guide to view the map.','bad');return;}
    pool=shuffle(objects.map(c=>({...c})));pickBatch();
    state.timer=setInterval(()=>{state.time--;if(state.time<=0){state.time=0;finish(false);}else render();},1000);
  };
  const hint=()=>{
    if(!state.running)return;
    const c=batch.find(x=>!state.found.has(x.n));
    if(c)status('Hint: find '+c.item+'. Look for the highlighted tap area on the map.','good');
  };
  const setImage=()=>{
    const m=currentMap();
    const stageImage=isGarden()?'images/dreamscape/cropped/garden-s5-stage-'+stageNo+'.jpg':(m.stages?.[stageNo-1]||m.image);
    currentImage=assetUrl(stageImage);
    $('dmSceneImage').src=currentImage;
    $('dmSceneImage').alt=m.name+' · Stage '+stageNo;
    $('dmSceneImage').onerror=()=>{if($('dmSceneImage').src!==assetUrl(m.image))$('dmSceneImage').src=assetUrl(m.image);};
    $('dmSceneImage').style.aspectRatio=(m.width||523)+' / '+(m.height||858);
  };
  const resetGame=()=>{
    stopTimer();state.running=false;state.found=new Set();state.completed=0;pool=[];batch=[];
    $('dmTime').textContent='60s';$('dmFound').textContent='0 / 0';$('dmTargets').innerHTML='<p class="dm-muted">Targets will appear here when you start.</p>';$('dmChoices').innerHTML='';$('dmMapHotspots').innerHTML='';
  };
  const updateStages=()=>{
    const m=currentMap(),sel=$('dmStage');
    sel.innerHTML=(m.stages||[m.image]).map((_,i)=>'<option value="'+(i+1)+'">Stage '+(i+1)+'</option>').join('');
    stageNo=1;sel.value='1';setImage();
  };
  const changeMap=()=>{
    mapId=$('dmScene').value;updateStages();resetGame();
    $('dmChoiceTitle').textContent=(currentMap().coords||[]).length?'Tap the object directly on the map':'Tap the matching number';
    status(currentMap().name+' selected. Choose a stage and press Start.');
  };
  let currentGuideMap='garden-s5';
  const guideRender=()=>{
    const maps=data(),sceneSelect=$('dmGuideScene');
    if(sceneSelect.options.length!==maps.length)sceneSelect.innerHTML=maps.map(m=>'<option value="'+m.id+'">S'+m.season+' · '+m.name+(m.multiplayer?' · Co-op':'')+'</option>').join('');
    sceneSelect.value=currentGuideMap;
    const map=maps.find(m=>m.id===currentGuideMap)||maps[0];if(!map)return;
    const stageSelect=$('dmGuideStage');
    if(stageSelect.dataset.map!==map.id){stageSelect.dataset.map=map.id;stageSelect.innerHTML=map.stages.map((_,i)=>'<option value="'+(i+1)+'">Stage '+(i+1)+'</option>').join('');stageSelect.value='1';}
    const stage=Math.min(Math.max(1,Number(stageSelect.value)||1),map.stages.length);
    const imageUrl=map.stages[stage-1]||map.image;
    $('dmGuideImage').src=assetUrl(imageUrl);$('dmGuideImage').alt=map.name+' · Stage '+stage;
    $('dmGuideMapSize').style.aspectRatio=(map.width||523)+' / '+(map.height||858);
    const q=($('dmGuideSearch').value||'').trim().toLowerCase();
    const visible=(map.coords||[]).filter(c=>(!c.stages.length||c.stages.includes(stage))&&(!q||c.item.toLowerCase().includes(q)));
    $('dmGuideOverlay').innerHTML=visible.map(c=>{const title=String(c.n).padStart(2,'0')+' · '+c.item;return '<button type="button" class="dm-guide-marker" data-item="'+c.n+'" title="'+title.replace(/"/g,'&quot;')+'" aria-label="'+title.replace(/"/g,'&quot;')+'" style="left:'+(c.x*100)+'%;top:'+(c.y*100)+'%;width:'+(c.w*100)+'%;height:'+(c.h*100)+'%;transform:translate(-50%,-50%) rotate('+c.rot+'deg)"><span>'+c.n+'</span></button>';}).join('');
    const filtered=map.items.map((name,i)=>({name,n:i+1})).filter(x=>!q||x.name.toLowerCase().includes(q));
    $('dmGuideCount').textContent=filtered.length+' / '+map.items.length+' items · '+visible.length+' markers on stage';
    $('dmGuideItems').innerHTML=filtered.map(x=>'<button type="button" class="dm-guide-item" data-item="'+x.n+'"><span>'+String(x.n).padStart(2,'0')+'</span>'+x.name+'</button>').join('')||'<p class="dm-muted">No matching items.</p>';
    const selectItem=n=>{ $('dmGuideItems').querySelectorAll('[data-item]').forEach(el=>el.classList.toggle('selected',Number(el.dataset.item)===n));$('dmGuideOverlay').querySelectorAll('[data-item]').forEach(el=>el.classList.toggle('selected',Number(el.dataset.item)===n));};
    $('dmGuideOverlay').querySelectorAll('[data-item]').forEach(el=>el.addEventListener('click',()=>selectItem(Number(el.dataset.item))));
    $('dmGuideItems').querySelectorAll('[data-item]').forEach(el=>el.addEventListener('click',()=>selectItem(Number(el.dataset.item))));
    $('dmGuideMapTitle').textContent=map.name+' · Season '+map.season+(map.multiplayer?' · Co-op':'');
  };
  const setMode=guide=>{
    $('dmGuidePanel').hidden=!guide;document.querySelector('.dm-toolbar').hidden=guide;document.querySelector('.dm-status').hidden=guide;document.querySelector('.dm-layout').hidden=guide;document.querySelector('.dm-help').hidden=guide;
    $('dmGuideToggle').classList.toggle('active',guide);$('dmPlayMode').classList.toggle('active',!guide);
    if(guide){currentGuideMap=mapId;$('dmGuideScene').value=currentGuideMap;guideRender();}
  };
  const init=()=>{
    if(!$('dmStart')||$('dmStart').dataset.ready)return;
    $('dmStart').dataset.ready='1';
    const maps=data();
    $('dmScene').innerHTML=maps.map(m=>'<option value="'+m.id+'">S'+m.season+' · '+m.name+(m.multiplayer?' · Co-op':'')+'</option>').join('');
    $('dmScene').value=mapId;updateStages();
    $('dmGuideToggle').addEventListener('click',()=>setMode(true));$('dmPlayMode').addEventListener('click',()=>setMode(false));
    $('dmGuideSearch').addEventListener('input',guideRender);
    $('dmGuideScene').addEventListener('change',()=>{currentGuideMap=$('dmGuideScene').value;$('dmGuideStage').dataset.map='';guideRender();});
    $('dmGuideStage').addEventListener('change',guideRender);
    $('dmScene').addEventListener('change',changeMap);
    $('dmStage').addEventListener('change',()=>{stageNo=Number($('dmStage').value)||1;setImage();resetGame();status('Stage '+stageNo+' selected. Press Start to play.');});
    $('dmStart').addEventListener('click',start);$('dmHint').addEventListener('click',hint);
    $('dmSceneImage').removeAttribute('tabindex');$('dmSceneImage').removeAttribute('role');$('dmSceneImage').style.cursor='default';
    resetGame();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();