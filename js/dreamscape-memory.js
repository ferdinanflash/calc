/* Dreamscape Memory — Garden S5 direct-tap practice + legacy reference scenes. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const legacyScenes = {
    windmill:{name:'Windmill · Season 5',image:'https://wostools.net/images/dreamscape/windmill-wm.webp',items:'Windmill|Blueprint|Mailbox|Windsock|Toolbox|Flare|Axe|Watchtower|Scarf|Snowmobile|Arrow sign|Hook|Shovel|Heart|Wheat|Hot air balloon|Whip|Water bag|Giant elk|Sign post|Lantern|Pouch|Ladder|Flower bed|Rifle|Stool|Skis|Birds|Horse|Snowman|Plane|Bell|Haystack|Bedroll|Boomerang|Hammer|Barrel|Glove|Wooden brush|Hand saw|Triangle|Apple|Bone|F|Carrot|Headwear|Beast trap'.split('|')},
    hangar:{name:'Hangar · Season 5',image:'https://wostools.net/images/dreamscape/hangar-s5-wm.webp',items:'Air pump|Arrow sign|Blueprint|Brush|Clock|Exhaust fan|Fire alarm|Fuel canister|Glass bottle|Goggles|Hammer|Hook|Kettle|Key|Lighthouse|Lock|Magnet|Medkit|Oil puddle|Oxygen tank|Paint bucket|Paper bag|Pipe|Projector|Scissors|Screwdriver|Searchlight|Spring|Tea set|Triangle|Mop|Wrench|Seagull|Cart|Cogwheel|Moon|Medal|Road cone|Chain|Tape|Tree|Plant|Ladder|Blackboard|Mouse|Scarf|Backpack|Barrel|Paint blob|Paw mark'.split('|')},
    farmhouse:{name:'Farmhouse · Season 5',image:'https://wostools.net/images/dreamscape/farmhouse-s5-wm.webp',items:'Airship|Balloons|Chimney|Earmuffs|Fence|Flower basket|Fork knife|Glass bottle|Glove|Hanging rug|Iron axe|Megaphone|Pine tree|Potatoes|Shovel|Skylight|Spiked flail|Sword|Turkey|Fur mantle|Yak|Eggs|Patch|Ladle|Apple|Chestplate|Fish|Iron pot|Mushroom|Pigeon|Pumpkin|Shield|Corn|Crossbow'.split('|')},
    kitchen:{name:'Kitchen · Season 5',image:'https://wostools.net/images/dreamscape/kitchen-s5-wm.webp',items:'Apple|Backpack|Barrel|Basket|Bird|Book|Bread|Broom|Brush|Cheese|Corn|Curtain|Fish bone|Flame|Footprints|Fork|Garlic|Gloves|Gold coins|Ladle|Lantern|Maple leaf|Milk|Mouse|Pipe|Plant|Pouch|Pumpkin|Rolling pin|Sausage|Scissors|Spatula|Spider web|Stain|Tomatoes|Turkey|Vase|Whisk|Wood pile|Moose antlers|Snowflake|Candles|Tea set|Lamb chops|Bell|Apple pie|Hole|Jam'.split('|')},
    cityhall:{name:'City Hall · Season 5',image:'https://wostools.net/images/dreamscape/city-hall-s5-wm.webp',items:'Air drop|Airship|Balloons|Bowknot|Butterfly|Clock|Compass|Diamond|Envelope|Flag garland|Flowers|Globe|Keys|Lightning|Newspaper|Number plate|Pipe|Shield|Spring|Sun|Swan|Camera|Cat|Chandelier|Chimney|Cogwheel|Crack|Crow|Four leaf clover|Giftbox|Goggles|Harp|Ladder|Medal|Motorcycle|Pine tree|Scarf|Searchlight|Star|Tower|Twin swords|Vines|Walking stick|Wrench|8|Scroll|N|Paper windmill'.split('|')},
    hospital:{name:'Hospital · Season 5',image:'https://wostools.net/images/dreamscape/hospital-s5-wm.webp',items:'Apple|Bandage roll|Book|Bucket|Button|Cane|Clock|Comb|Duffle bag|First aid kit|Hanging banner|IV drip|Mirror|Mortar & pestle|Obelisk|Paper bag|Patch|Pipe|Pliers|Scissors|Slippers|Stethoscope|Thermometer|Towel|Weighing scale|Kettle|Clipboard|Bell|Lamp|Coat rack|Test tubes|Flower vase|Tweezers'.split('|')},
    bedroom:{name:'Bedroom · Season 5',image:'https://wostools.net/images/dreamscape/bedroom-s5-wm.webp',items:'Bucket|Calendar|Cheese|Clock|Clothes hanger|Curtain|Diary|Easter egg|Frying pan|Gift box|Gold coins|Guitar|Headwear|Key|Mask|Mouse|Mug|Painting|Plant|Pouch|Rifle|Rope|Rubber ball|Scroll|Snowflake|Spider|Spring|Towel|Vent|Brush|Camera|Candle|Coat|Comb|Glass bottle|Goggles|Hand drum|Hourglass|Lion wall art|Plate|Slippers|Stain|Teddy|Tree|E'.split('|')},
    court:{name:'Court · Season 5',image:'https://wostools.net/images/dreamscape/court-s5-wm.webp',items:'Backpack|Bandage roll|Binoculars|Branch|Cane|Clock|Coat|Compass|Curtain|Dagger|Diamond|Footprints|Globe|Gold coins|Handcuff|Hanging banner|Hourglass|Ink bottle|Key|Ladder|Magnifier|Mask|Paper plane|Photo frame|Pigeon|Wheat|Plant|Pouch|Scroll|Shield|Ship|Shoe|Snowflake|Stamp|Statue|Sun|Sword|Thermometer|Tie|Trophy|Typewriter|Umbrella|Wall light|Water bag|Weighing scale|Wrench|Top hat|Judge’s gavel'.split('|')},
    mine:{name:'Mine · Season 5',image:'https://wostools.net/images/dreamscape/mine-s5-wm.webp',items:'Arrow sign|Barrel|Broom|Bucket|Canned food|Cart|Chain|Chest|Chimney|Cogwheel|Crystal|Flame|Footprints|Glass bottle|Hammer|Hanging banner|Iron pot|Key|Ladder|Mailbox|Megaphone|Motorcycle|Music note|Oxygen tank|Parcel|Pickaxe|Pipe|Plane|Plant|Pliers|Pouch|Safety helmet|Shovel|Sign post|Ski|Snowman|Spider|Tower|Wheel|Withered branch|Wrench|Icicles|Spider web|6|A|Lamp|Carriage|Birds|Mushroom'.split('|')}
  };
  const gardenStages = {
    'garden-1':{name:'Garden · Stage 1',image:'images/dreamscape/cropped/garden-s5-stage-1.jpg',targets:[['Corn',70,69],['Feather',43,72],['Ball',86,98]]},
    'garden-2':{name:'Garden · Stage 2',image:'images/dreamscape/cropped/garden-s5-stage-2.jpg',targets:[['Butterfly',97,58],['Rubber duck',28,74],['Corn',67,70]]},
    'garden-3':{name:'Garden · Stage 3',image:'images/dreamscape/cropped/garden-s5-stage-3.jpg',targets:[['Butterfly',97,58],['Starfish',18,61],['Rubber duck',28,74]]},
    'garden-4':{name:'Garden · Stage 4',image:'images/dreamscape/cropped/garden-s5-stage-4.jpg',targets:[['Spider web',80,27]]},
    'garden-5':{name:'Garden · Stage 5',image:'images/dreamscape/cropped/garden-s5-stage-5.jpg',targets:[['Scarf',70,70]]}
  };
  let currentScene='garden-1', legacyItems=[], activeTargets=[];
  const state={time:60,found:new Set(),running:false,timer:null,hints:0};
  const isGarden=()=>!!gardenStages[currentScene];
  const currentTargets=()=>isGarden()?gardenStages[currentScene].targets:legacyItems.map((name,i)=>[name,i+1,0]);
  const shuffle=a=>{const x=[...a];for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]];}return x;};
  const status=(s,k='')=>{const el=$('dmStatus');if(el){el.textContent=s;el.className='dm-status'+(k?' '+k:'');}};
  const render=()=>{
    const total=isGarden()?activeTargets.length:legacyItems.length;
    $('dmTime').textContent=state.time+'s';$('dmFound').textContent=state.found.size+' / '+total;
    $('dmTargets').innerHTML=activeTargets.length?activeTargets.map((t,i)=>'<div class="dm-target '+(state.found.has(isGarden()?i:i+1)?'done':'')+'">'+(state.found.has(isGarden()?i:i+1)?'✓ ':'')+t[0]+'</div>').join(''):'<p class="dm-muted">Press Start to show the targets.</p>';
    $('dmChoices').innerHTML=isGarden()?'':legacyItems.map((name,i)=>'<button type="button" class="dm-choice" data-num="'+(i+1)+'" '+(!state.running||state.found.has(i+1)?'disabled':'')+'>'+String(i+1).padStart(2,'0')+'</button>').join('');
    $('dmChoiceTitle').textContent=isGarden()?'Tap the object directly on the map':'Tap the matching number';
    $('dmMapHotspots').innerHTML='';
    if(isGarden()&&state.running){
      activeTargets.forEach((t,i)=>{if(state.found.has(i))return;const b=document.createElement('button');b.type='button';b.className='dm-hotspot';b.style.left=t[1]+'%';b.style.top=t[2]+'%';b.setAttribute('aria-label','Found '+t[0]);b.title='Tap '+t[0];b.addEventListener('click',()=>foundTarget(i));$('dmMapHotspots').appendChild(b);});
    }
    $('dmChoices').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>chooseLegacy(Number(b.dataset.num))));
  };
  const finish=won=>{state.running=false;if(state.timer)clearInterval(state.timer);state.timer=null;render();status(won?'Stage cleared! All requested objects found.':'Time is up! Press Start to try again.',won?'good':'bad');};
  const foundTarget=i=>{
    if(!state.running||state.found.has(i))return;
    state.found.add(i);
    if(state.found.size===activeTargets.length){finish(true);return;}
    render();status('Nice find! Keep looking for the remaining object(s).','good');
  };
  const chooseLegacy=n=>{
    if(!state.running||state.found.has(n))return;
    state.found.add(n);render();
    if(state.found.size===legacyItems.length)finish(true);
  };
  const start=()=>{
    if(state.timer)clearInterval(state.timer);
    state.time=60;state.found=new Set();state.running=true;state.hints=0;
    if(isGarden()){activeTargets=gardenStages[currentScene].targets;render();status('Go! Tap each requested object directly on the scene.','good');}
    else{legacyItems=legacyScenes[currentScene].items;activeTargets=legacyItems.map((name,i)=>[name]);render();status('Go! Find the numbered objects on the reference map.','good');}
    state.timer=setInterval(()=>{state.time--;render();if(state.time<=0)finish(false);},1000);
  };
  const hint=()=>{
    if(!state.running)return;
    if(isGarden()){const i=activeTargets.findIndex((_,n)=>!state.found.has(n));if(i<0)return;status('Hint: look closely for '+activeTargets[i][0]+'.','good');}
    else{const n=legacyItems.findIndex((_,i)=>!state.found.has(i+1));if(n>=0)status('Hint: look for '+legacyItems[n]+' — number '+(n+1)+'.','good');}
  };
  const changeScene=()=>{
    currentScene=$('dmScene').value;const data=gardenStages[currentScene]||legacyScenes[currentScene];
    $('dmSceneImage').src=data.image;$('dmSceneImage').alt='Dreamscape Memory '+data.name;
    if(state.timer)clearInterval(state.timer);state.timer=null;state.running=false;state.found=new Set();activeTargets=[];legacyItems=[];
    $('dmTime').textContent='60s';$('dmFound').textContent='0 / '+(gardenStages[currentScene]?.targets.length||legacyScenes[currentScene].items.length);
    $('dmTargets').innerHTML='<p class="dm-muted">Targets will appear here when you start.</p>';$('dmChoices').innerHTML='';$('dmMapHotspots').innerHTML='';$('dmChoiceTitle').textContent=isGarden()?'Tap the object directly on the map':'Tap the matching number';
    status('Selected '+data.name+'. Press Start to play.');
  };

  const guideRender=()=>{
    const scene=legacyScenes[currentScene]||gardenStages[currentScene];
    const data=legacyScenes[currentScene]||{name:gardenStages[currentScene].name,image:gardenStages[currentScene].image,items:['Map','Corn','Feather','Butterfly','Balloon','Camera','Rubber duck','Starfish','Sunflower','Wing','Drifting bottle','Spider web','Scarf','Ball']};
    $('dmGuideImage').src=data.image;$('dmGuideImage').alt=data.name+' map';
    const q=($('dmGuideSearch').value||'').trim().toLowerCase();
    const filtered=data.items.filter(x=>x.toLowerCase().includes(q));
    $('dmGuideCount').textContent=filtered.length+' / '+data.items.length+' items';
    $('dmGuideItems').innerHTML=filtered.map((x,i)=>'<div class="dm-guide-item"><span>'+(data.items.indexOf(x)+1)+'</span>'+x+'</div>').join('')||'<p class="dm-muted">No matching items.</p>';
  };
  const setMode=guide=>{
    $('dmGuidePanel').hidden=!guide;
    document.querySelector('.dm-toolbar').hidden=guide;
    document.querySelector('.dm-status').hidden=guide;
    document.querySelector('.dm-layout').hidden=guide;
    document.querySelector('.dm-help').hidden=guide;
    $('dmGuideToggle').classList.toggle('active',guide);
    $('dmPlayMode').classList.toggle('active',!guide);
    if(guide)guideRender();
  };
  const init=()=>{
    if(!$('dmStart')||$('dmStart').dataset.ready)return;
    $('dmStart').dataset.ready='1';
    $('dmGuideToggle').addEventListener('click',()=>setMode(true));$('dmPlayMode').addEventListener('click',()=>setMode(false));$('dmGuideSearch').addEventListener('input',guideRender);$('dmStart').addEventListener('click',start);$('dmScene').addEventListener('change',()=>{changeScene();if(!$('dmGuidePanel').hidden)guideRender();});$('dmHint').addEventListener('click',hint);
    $('dmSceneImage').removeAttribute('tabindex');$('dmSceneImage').removeAttribute('role');$('dmSceneImage').style.cursor='default';
    render();
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
