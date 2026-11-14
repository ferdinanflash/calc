/* Mia's Fortune Hut Simulator
 * Odds, token costs and planner figures are based on the WoSTools reference.
 * Simulator results are random samples, not guaranteed predictions.
 */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const fmt = n => Math.round(n).toLocaleString('en-US');
  const costs = [1,2,3,4,6,8,12,15,20,25];
  const wishPositionOdds = [1.79,2.10,2.50,3.00,3.90,5.10,7.20,11.20,19.50,43.80];
  const cumulativeOdds = wishPositionOdds.map((_,i)=>wishPositionOdds.slice(0,i+1).reduce((a,b)=>a+b,0));
  const dailyChestRewards = [1,1,1,2,2,5,10];
  const poolTemplates = {
    I: [
      ['Fire Crystal ×10',1.59],['Fire Crystal ×5',3.17],['Charm Design ×3',3.17],['Charm Design ×1',3.17],
      ['100 Gems ×5',3.17],['100 Gems ×1',3.17],['3h General Speedup ×1',3.17],['10,000 Hero XP ×2',3.17],
      ['100 Enhancement XP ×3',3.17],['100 Enhancement XP ×1',3.25],['1h General Speedup ×1',3.17],
      ['1h Construction Speedup ×1',3.17],['1h Training Speedup ×1',3.17],['1h Research Speedup ×1',3.17],
      ['100K Meat ×1',9.52],['100K Wood ×1',9.52],['100K Coal ×1',9.52],['100K Iron ×1',9.52],
      ['5m General Speedup ×3',4.76],['5m Construction Speedup ×3',4.76],['5m Training Speedup ×3',4.76],['5m Research Speedup ×3',4.76]
    ],
    II: [
      ['Fire Crystal ×15',2.56],['Fire Crystal ×8',5.13],['8h General Speedup ×1',5.13],['50,000 Hero XP ×4',5.13],
      ['Charm Design ×5',5.13],['Charm Design ×2',5.13],['100 Gems ×15',5.13],['100 Gems ×5',5.13],
      ['3h General Speedup ×2',5.13],['3h General Speedup ×1',5.13],['1M Meat ×1',5.13],['1M Wood ×1',5.13],
      ['1M Coal ×1',5.13],['1M Iron ×1',5.13],['100 Enhancement XP ×6',5.13],['100 Enhancement XP ×2',5.10],
      ['1h General Speedup ×3',5.13],['1h Construction Speedup ×3',5.13],['1h Training Speedup ×3',5.13],['1h Research Speedup ×3',5.13]
    ],
    III: [
      ['Multiplier ×3',4.84,'multiplier',3],['Fire Crystal ×15',2.44],['Fire Crystal ×8',4.88],['8h General Speedup ×1',4.88],
      ['50,000 Hero XP ×4',4.88],['Charm Design ×5',4.88],['Charm Design ×2',4.88],['100 Gems ×15',4.88],
      ['100 Gems ×5',4.88],['3h General Speedup ×2',4.88],['3h General Speedup ×1',4.88],['1M Meat ×1',4.88],
      ['1M Wood ×1',4.88],['1M Coal ×1',4.88],['1M Iron ×1',4.88],['100 Enhancement XP ×6',4.88],
      ['100 Enhancement XP ×2',4.88],['1h General Speedup ×3',4.88],['1h Construction Speedup ×3',4.88],
      ['1h Training Speedup ×3',4.88],['1h Research Speedup ×3',4.88]
    ],
    IV: [['Multiplier ×2',100,'multiplier',2]],
    V: [
      ['1,000 Gems ×10',6.67],['1,000 Gems ×5',6.67],['Fire Crystal ×30',6.67],['Fire Crystal ×20',6.67],
      ['Fire Crystal ×10',6.67],['8h General Speedup ×2',6.67],['8h General Speedup ×1',6.67],
      ['Charm Design ×5',6.67],['3h General Speedup ×2',6.67],['3h General Speedup ×1',6.67],
      ['100 Enhancement XP ×8',6.62],['1h General Speedup ×5',6.67],['1h Construction Speedup ×5',6.67],
      ['1h Training Speedup ×5',6.67],['1h Research Speedup ×5',6.67]
    ],
    VI: [
      ['Multiplier ×5',5.92,'multiplier',5],['Multiplier ×4',5.88,'multiplier',4],['1,000 Gems ×10',5.88],
      ['1,000 Gems ×5',5.88],['Fire Crystal ×30',5.88],['Fire Crystal ×20',5.88],['Fire Crystal ×10',5.88],
      ['8h General Speedup ×2',5.88],['8h General Speedup ×1',5.88],['Charm Design ×5',5.88],
      ['3h General Speedup ×2',5.88],['3h General Speedup ×1',5.88],['100 Enhancement XP ×8',5.88],
      ['1h General Speedup ×5',5.88],['1h Construction Speedup ×5',5.88],
      ['1h Training Speedup ×5',5.88],['1h Research Speedup ×5',5.88]
    ]
  };
  const wishAmounts = {fc:150, essence:18, speed:120, gems:40};
  const TOKEN_ICON = 'assets/mia-fortune/fortune_token.png';
  function assetForReward(label) {
    const text = String(label || '');
    const multiplier = text.match(/Multiplier ×([2-5])/);
    if (multiplier) return 'assets/mia-fortune/multiplier_x' + multiplier[1] + '.png';
    if (/Essence Stone/i.test(text)) return 'assets/mia-fortune/essence-stone.5a885e57.webp';
    if (/Fortune Token/i.test(text)) return TOKEN_ICON;
    if (/Fire Crystal/i.test(text)) return 'images/resources/fire-crystal.webp';
    if (/\bMeat\b/i.test(text)) return 'images/resources/meat.webp';
    if (/\bWood\b/i.test(text)) return 'images/resources/wood.webp';
    if (/\bIron\b/i.test(text)) return 'images/resources/iron.webp';
    if (/\bCoal\b/i.test(text)) return 'images/resources/coal.webp';
    if (/\bSteel\b/i.test(text)) return 'images/resources/steel.webp';
    if (/Gems/i.test(text)) return 'assets/mia-fortune/gem.png';
    if (/Charm Design/i.test(text)) return 'images/charms/material-design.webp';
    if (/Enhancement XP/i.test(text)) return 'assets/mia-fortune/enhancement-xp-component.bc25d724.webp';
    if (/Hero XP/i.test(text)) return 'assets/mia-fortune/hero_xp_10000.png';
    if (/Construction Speedup/i.test(text)) return 'images/speedups/construction.webp';
    if (/Research Speedup/i.test(text)) return 'images/speedups/research.webp';
    if (/Training Speedup/i.test(text)) return 'images/speedups/troop-training.webp';
    if (/Healing Speedup/i.test(text)) return 'images/speedups/troop-healing.webp';
    if (/Learning Speedup/i.test(text)) return 'images/speedups/learning.webp';
    if (/General Speedup/i.test(text)) return 'images/speedups/general.webp';
    return '';
  }
  function rewardFallback(label) {
    return '🎁';
  }
  function rewardIcon(label, extraClass) {
    const src = assetForReward(label);
    return src ? '<img class="' + (extraClass || 'mia-reward-icon') + '" src="' + src + '" alt="" loading="lazy">' : '<span class="' + (extraClass || 'mia-reward-icon') + ' mia-reward-fallback">' + rewardFallback(String(label || '')) + '</span>';
  }
  function renderWishPreview() {
    const el = $('miaWishPreview');
    if (!el) return;
    const kind = $('miaWishType').value;
    const label = kind === 'fc' ? 'Fire Crystal' : kind === 'essence' ? 'Essence Stone' : kind === 'gems' ? 'Gems' : 'General Speedup';
    el.innerHTML = rewardIcon(label, 'mia-preview-icon') || '<span>⏱️</span>';
  }
  let state = null;
  let session = {wishes:0, rounds:0, spent:0, rewardCounts:{}};

  function weighted(items) {
    const total = items.reduce((s,x)=>s+x[1],0);
    let r = Math.random()*total;
    for (const item of items) { r -= item[1]; if (r <= 0) return item; }
    return items[items.length-1];
  }
  function pickWishPosition() {
    const item = weighted(wishPositionOdds.map((v,i)=>[i,v]));
    return item[0];
  }
  function shuffle(a) {
    for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}
    return a;
  }
  function wishText() {
    const kind = $('miaWishType').value;
    if(kind==='fc') return 'Fire Crystal ×'+fmt(Number($('miaFcAmount').value)||150);
    if(kind==='essence') return 'Essence Stone ×18';
    if(kind==='speed') return '1h General Speedup ×120';
    return '1,000 Gems ×40';
  }
  function multiplyReward(label,multiplier) {
    const match=label.match(/^(.*?)(?: ×([\\d,]+))$/);
    if(!match)return label+' (×'+multiplier+')';
    const amount=Number(match[2].replace(/,/g,''))*multiplier;
    return match[1]+' ×'+fmt(amount);
  }
  function buildBoard() {
    const wishAt = pickWishPosition();
    const pools = shuffle(['I','I','I','II','II','III','IV','V','VI']);
    let pi=0;
    const draws = Array.from({length:10},(_,i)=>{
      if(i===wishAt) return {type:'wish'};
      const pool = pools[pi++];
      const draw = weighted(poolTemplates[pool].map(x=>[x,x[1]]))[0];
      return {type:'prize',pool,draw};
    });
    const balls = Array.from({length:10},()=>({opened:false}));
    state = {balls,draws,opened:0,wishFound:false,pendingMultiplier:1,spent:0,limited:Math.max(0,Number($('miaTokenLimit').value)||0)};
    renderBoard();
  }
  function tokenBudgetLeft() {
    if(!state || !state.limited) return Infinity;
    return Math.max(0,state.limited-session.spent);
  }
  function openBall(i) {
    if(!state || state.wishFound || state.balls[i].opened) return;
    const step=state.opened;
    const cost=costs[step];
    if(tokenBudgetLeft()<cost){setMessage('Token limit reached. Increase your limit or clear the session.','warn');return;}
    state.spent+=cost;session.spent+=cost;state.opened++;
    const ball=state.balls[i];const draw=state.draws[step];Object.assign(ball,draw);ball.opened=true;
    if(ball.type==='wish'){
      const mult=state.pendingMultiplier;
      const wish=wishText();
      ball.label=mult>1 ? multiplyReward(wish,mult) : wish;
      ball.isWish=true;state.wishFound=true;session.wishes++;
      session.rewardCounts[ball.label]=(session.rewardCounts[ball.label]||0)+1;
      session.rounds++;
      setMessage('Wish found! Reset is now free. '+ball.label,'good');
    } else {
      const [label,,kind,mult]=ball.draw;
      if(kind==='multiplier'){
        state.pendingMultiplier += (mult-1);
        ball.label=label;
        ball.isMultiplier=true;
      } else {
        ball.label=state.pendingMultiplier>1 ? multiplyReward(label,state.pendingMultiplier) : label;
        session.rewardCounts[ball.label]=(session.rewardCounts[ball.label]||0)+1;
        state.pendingMultiplier=1;
      }
      if(state.opened===10) session.rounds++;
      setMessage('Opened '+ball.pool+' prize: '+ball.label,'');
    }
    renderBoard();renderSession();
  }
  function setMessage(message,kind){const el=$('miaMessage');if(el){el.textContent=message;el.className='mia-message '+(kind||'');}}
  function renderBoard() {
    if(!state)return;
    const board=$('miaBoard');
    board.innerHTML=state.balls.map((b,i)=>{
      const label=b.opened ? (b.isWish?'WISH':b.isMultiplier?'MULTIPLIER':b.pool+' PRIZE') : 'BALL '+(i+1);
      const detail=b.opened ? b.label : 'Tap to reveal';
      const art = b.opened
        ? (rewardIcon(b.label) || '<span class="mia-crystal-art">' + (b.isWish ? '✨' : '🎁') + '</span>')
        : '<span class="mia-crystal-art">🔮</span>';
      return '<button type="button" class="mia-ball '+(b.opened?(b.isWish?'wish':b.isMultiplier?'multiplier':'revealed'):'')+'" data-ball="'+i+'" '+(b.opened||state.wishFound?'disabled':'')+'><span class="mia-ball-num">'+label+'</span>'+art+'<small>'+detail+'</small></button>';
    }).join('');
    board.querySelectorAll('[data-ball]').forEach(btn=>btn.addEventListener('click',()=>openBall(Number(btn.dataset.ball))));
    $('miaWishType').disabled=state.opened>0;
    $('miaFcAmount').disabled=state.opened>0 || $('miaWishType').value!=='fc';
    $('miaNextCost').innerHTML=state.wishFound?'Free reset':state.opened>=10?'Round complete':"<img class=\"mia-token-icon\" src=\"assets/mia-fortune/fortune_token.png\" alt=\"Fortune Token\" loading=\"lazy\">"+' '+fmt(costs[state.opened]);
    $('miaOpenCount').textContent=state.opened+'/10 balls opened';
    $('miaSpentRound').innerHTML="<img class=\"mia-token-icon\" src=\"assets/mia-fortune/fortune_token.png\" alt=\"Fortune Token\" loading=\"lazy\">"+' '+fmt(state.spent);
    $('miaPendingMultiplier').textContent=state.pendingMultiplier>1?'×'+state.pendingMultiplier:'—';
    $('miaResetCost').textContent=state.wishFound?'FREE':state.opened===0?'FREE':fmt([0,15,14,13,10,6,5,4,3,2,1][state.opened])+' tokens';
    $('miaResetBtn').disabled=state.opened===0&&!state.wishFound;
    $('miaOpenUntilBtn').disabled=state.wishFound||state.opened>=10;
  }
  function resetBoard() {
    if(!state)return;
    if(!state.wishFound && state.opened>0){
      const fee=[0,15,14,13,10,6,5,4,3,2,1][state.opened];
      if(tokenBudgetLeft()<fee){setMessage('Not enough tokens for this reset.','warn');return;}
      state.spent+=fee;session.spent+=fee;
    }
    buildBoard();setMessage('New board ready. Your Fortune Tokens carry over.','');
    renderSession();
  }
  function openUntilWish() {
    if(!state)return;
    while(!state.wishFound && state.opened<10){
      const next=state.balls.findIndex((b)=>!b.opened);
      if(next<0)break;
      const cost=costs[state.opened];
      if(tokenBudgetLeft()<cost){setMessage('Token limit reached before the wish appeared.','warn');break;}
      openBall(next);
    }
  }
  function renderSession() {
    $('miaSessionWishes').textContent=fmt(session.wishes);
    $('miaSessionRounds').textContent=fmt(session.rounds);
    $('miaSessionSpent').textContent=fmt(session.spent);
    $('miaAverageCost').textContent=session.wishes?((session.spent/session.wishes).toFixed(1)+' tokens / wish'):'—';
    const milestones=[20,100,250,750];
    const rewards=[5,12,0,0];
    $('miaMilestones').innerHTML=milestones.map((m,i)=>{
      const reached=session.spent>=m;
      return '<div class="mia-milestone '+(reached?'done':'')+'"><strong>'+fmt(m)+'</strong><span>Tokens spent</span><small>'+(reached?(rewards[i]?'+'+rewards[i]+' tokens':'Reward claimed'):'Reward threshold')+'</small></div>';
    }).join('');
    const tally=$('miaRewardTally');
    tally.innerHTML=Object.keys(session.rewardCounts).length
      ? Object.entries(session.rewardCounts).map(([k,v])=>'<div><span>'+rewardIcon(k, 'mia-tally-icon')+k+'</span><strong>'+fmt(v)+'</strong></div>').join('')
      : '<div class="mia-empty">Open balls to build your session reward log.</div>';
  }
  function clearSession(){
    session={wishes:0,rounds:0,spent:0,rewardCounts:{}};
    buildBoard();renderSession();setMessage('Session cleared. Fresh board ready.','');
  }
  function updatePlanner(){
    const tokens=Math.max(0,Number($('miaTokensNow').value)||0);
    const already=Math.max(0,Number($('miaAlreadySpent').value)||0);
    const days=Math.max(0,Math.floor(Number($('miaDaysLeft').value)||0));
    const chestCount=Math.max(0,Math.min(7,Math.floor(Number($('miaDailyChests').value)||0)));
    const packCount=Math.max(0,Math.min(days,Math.floor(Number($('miaPacks').value)||0)));
    const daily=1+dailyChestRewards.slice(0,chestCount).reduce((a,b)=>a+b,0);
    const free=days*daily;
    const milestoneBack=already<20 && already+tokens+free+packCount*50>=20 ? 5 : 0;
    const total=tokens+free+milestoneBack;
    const target=$('miaChance').value;
    const idx=target==='50'?cumulativeOdds.findIndex(x=>x>=50):target==='90'?cumulativeOdds.findIndex(x=>x>=90):9;
    const tokenNeed=costs.slice(0,idx+1).reduce((a,b)=>a+b,0);
    const spendable=total+packCount*50;
    const avgWishes=spendable/66.6;
    const rawPackNeeded=Math.max(0,Math.ceil((tokenNeed-spendable)/50));
    const packNeeded=Math.min(rawPackNeeded,Math.max(0,days-packCount));
    const cost=packNeeded*4.99;
    $('miaFreeTokens').textContent=fmt(free+milestoneBack);
    $('miaTokensTotal').textContent=fmt(total);
    $('miaExpectedWishes').textContent=avgWishes.toFixed(2);
    $('miaChanceTokens').textContent=fmt(tokenNeed);
    $('miaPackCount').textContent=fmt(packCount);
    $('miaPackCost').textContent='$'+(packCount*4.99).toFixed(2);
    $('miaGoalPackCount').textContent=fmt(packNeeded);
    $('miaGoalPackCost').textContent='$'+cost.toFixed(2);
    $('miaPlannerSummary').textContent=rawPackNeeded===0
      ? 'Your current tokens, estimated free tokens and planned packs cover the selected chance target.'
      : packNeeded<rawPackNeeded
        ? 'You need '+fmt(rawPackNeeded)+' additional pack(s), but only '+fmt(packNeeded)+' daily pack slot(s) remain. The event limit is one Common Fortune Token Pack per day.'
        : 'You need '+fmt(packNeeded)+' additional Common Fortune Token Pack(s) after your planned packs to reach the selected chance target. Each pack adds 50 tokens and costs $4.99.';
    $('miaPackBudget').textContent=packCount>0?'Including '+packCount+' planned pack(s), you would have '+fmt(spendable)+' tokens and about '+avgWishes.toFixed(2)+' average wishes.':'Pack purchases are not included in the free-token total.';
  }
  function bind(){
    const root=$('miaFortuneModal');if(!root||root.dataset.bound)return;root.dataset.bound='1';
    $('miaWishType').addEventListener('change',()=>{renderWishPreview();if(state&&state.opened===0)buildBoard();});
    $('miaFcAmount').addEventListener('change',()=>{if(state&&state.opened===0)buildBoard();});
    $('miaTokenLimit').addEventListener('input',()=>{if(state)state.limited=Math.max(0,Number($('miaTokenLimit').value)||0);});
    $('miaResetBtn').addEventListener('click',resetBoard);
    $('miaOpenUntilBtn').addEventListener('click',openUntilWish);
    $('miaClearBtn').addEventListener('click',clearSession);
    ['miaTokensNow','miaAlreadySpent','miaDaysLeft','miaDailyChests','miaPacks','miaChance'].forEach(id=>$(id).addEventListener('input',updatePlanner));
    ['miaDailyChests','miaPacks','miaChance'].forEach(id=>$(id).addEventListener('change',updatePlanner));
    renderWishPreview();buildBoard();renderSession();updatePlanner();
  }
  window.miaFortuneNewBoard=()=>{if(!state||state.wishFound||state.opened===0){buildBoard();setMessage('New board ready.','');}else resetBoard();};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})();
