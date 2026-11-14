/* Mergeventure Planner — local-only board and Merge Energy planner */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const KEY = 'wos3475_mergeventure_v1';
  const names = {
    farm:['Ear of Wheat','Wheat Bundle','Bag of Flour','Dough','Loaf of Bread','Sliced Bread','Jam Toast','Triangular Sandwich','Double-Decker Sandwich','Fried Egg Sandwich','Strawberry Pie','Rainbow Fruit Pie'],
    mine:['Piece of Ore','Pile of Ore','Crate of Ore','Iron Ingot','Stack of Iron Ingots','Metal Brazier','Blazing Brazier','Fireplace Stove','Heating Stove','Chimney Coal Stove','Heating Boiler','Blazing Furnace']
  };
  const fmt = n => Math.max(0,Math.ceil(n)).toLocaleString('en-US');
  const val = id => Math.max(0,Math.floor(Number($(id)?.value)||0));
  const fields = () => Math.max(1,val('mvFields'));
  const energyCost = level => 2 ** (level - 1);
  function readCounts() {
    return Array.from({length:12},(_,i)=>({loose:val('mvL'+(i+1)),buried:val('mvB'+(i+1))}));
  }
  // Free merges first. Buried Pieces are paired with loose Pieces before loose/loose pairs.
  function mergeCounts(source, stopLevel=12) {
    const a=source.map(x=>({...x}));
    const steps=[];
    for(let level=1;level<stopLevel;level++){
      const buriedPairs=Math.min(a[level-1].buried,a[level-1].loose);
      a[level-1].buried-=buriedPairs;
      a[level-1].loose-=buriedPairs;
      const loosePairs=Math.floor(a[level-1].loose/2);
      a[level-1].loose-=loosePairs*2;
      const made=buriedPairs+loosePairs;
      if(made){a[level].loose+=made;steps.push({level,made,buriedPairs,loosePairs});}
    }
    return {counts:a,steps};
  }
  function makePlan() {
    const board=$('mvBoard').value;
    const cleared=Math.min(8,val('mvCleared'));
    const fieldCount=fields();
    const energyNow=val('mvEnergy');
    const drinkCount=val('mvDrinks');
    const timerCount=Math.min(9,val('mvRefills'));
    let inventory=readCounts();
    const freeMerge=mergeCounts(inventory);
    inventory=freeMerge.counts;
    let energyAvailable=energyNow+drinkCount*5+timerCount*15;
    let energyUsed=0;
    const rows=[];
    for(let patch=cleared;patch<8;patch++){
      const target=patch+5;
      const need=energyCost(target);
      const have=inventory.slice(0,target).reduce((sum,x,i)=>sum+(x.loose+x.buried)*energyCost(i+1),0);
      const missing=Math.max(0,need-have);
      const energy=Math.ceil(missing/fieldCount);
      const generated=energy*fieldCount;
      inventory[0].loose+=generated;
      energyUsed+=energy;
      energyAvailable-=energy;
      const merged=mergeCounts(inventory,target);
      inventory=merged.counts;
      const ready=inventory[target-1].loose+inventory[target-1].buried;
      let clearedNow=false;
      if(ready>0){
        if(inventory[target-1].loose>0) inventory[target-1].loose--;
        else inventory[target-1].buried--;
        clearedNow=true;
      }
      rows.push({patch:patch+1,target,need,energy,generated,energyLeft:energyAvailable,cleared:clearedNow,remaining:Math.max(0,energyAvailable)});
    }
    const totalEnergy=energyNow+drinkCount*5+timerCount*15;
    const spent=Math.min(totalEnergy,energyUsed);
    const left=Math.max(0,totalEnergy-spent);
    const remainingPatches=rows.filter(x=>x.energy>0).length;
    const allEnergyToPieces=left*fieldCount;
    const bestLevel=allEnergyToPieces>0?Math.min(12,Math.floor(Math.log2(allEnergyToPieces))+1):0;
    return {board,cleared,fieldCount,energyNow,drinkCount,timerCount,totalEnergy,energyUsed,spent,left,rows,freeMerge,bestLevel,remainingPatches,inventory};
  }
  function render() {
    const p=makePlan();
    $('mvPieceHead').textContent=p.board==='farm'?'Piece (Jessie’s Dream Farm)':'Piece (Smith’s Snow Mountain Mine)';
    $('mvPieceRows').innerHTML=names[p.board].map((name,i)=>'<div class="mv-piece-row"><div><strong>Lv. '+(i+1)+' '+name+'</strong>'+(i===4?'<small>Clears fog patch 1</small>':i>4?'<small>Clears fog patch '+(i-3)+'</small>':'')+'</div><label>Loose<input id="mvL'+(i+1)+'" type="number" min="0" step="1" value="'+readCounts()[i].loose+'"></label><label>Buried<input id="mvB'+(i+1)+'" type="number" min="0" step="1" value="'+readCounts()[i].buried+'"></label></div>').join('');
    $('mvFreeMerge').innerHTML=p.freeMerge.steps.length?p.freeMerge.steps.map(x=>'<div class="mv-merge-line"><span>Lv. '+x.level+' → Lv. '+(x.level+1)+'</span><strong>'+fmt(x.made)+' merge(s)</strong><small>'+fmt(x.buriedPairs)+' buried + '+fmt(x.loosePairs)+' loose pairs</small></div>').join(''):'<div class="mv-empty">No free merges available from the current pieces.</div>';
    $('mvPlanRows').innerHTML=p.rows.map(x=>'<div class="mv-plan-row '+(x.energy===0?'ready':'')+'"><div><strong>Fog patch '+x.patch+'</strong><small>Lv. '+x.target+' '+names[p.board][x.target-1]+'</small></div><div><strong>'+fmt(x.energy)+' Energy</strong><small>'+(x.energy===0?'Already have enough Pieces':fmt(x.energy)+' × '+p.fieldCount+' field(s) = '+fmt(x.generated)+' Lv. 1 Pieces')+'</small></div><div class="mv-plan-status">'+(x.energy===0?'Ready':'Needs energy')+'</div></div>').join('');
    $('mvTotalEnergy').textContent=fmt(p.totalEnergy);
    $('mvEnergyNeeded').textContent=fmt(p.energyUsed);
    $('mvEnergyLeft').textContent=fmt(p.left);
    $('mvDrinkNeeded').textContent=fmt(Math.ceil(Math.max(0,p.energyUsed-p.energyNow-p.timerCount*15)/5));
    $('mvPatchCount').textContent=fmt(p.rows.filter(x=>x.energy===0).length)+' / '+p.rows.length;
    $('mvBestPiece').textContent=p.bestLevel?'Lv. '+p.bestLevel+' '+names[p.board][p.bestLevel-1]:'—';
    $('mvEnergyBreakdown').textContent=fmt(p.energyNow)+' now + '+fmt(p.drinkCount*5)+' from Drinks + '+fmt(p.timerCount*15)+' from timer';
    $('mvSummary').textContent=p.energyUsed<=p.totalEnergy
      ? 'Your current Merge Energy covers all remaining fog patches in this estimate.'
      : 'You are short by '+fmt(p.energyUsed-p.totalEnergy)+' Merge Energy to clear all remaining fog patches. Consider more fields, timer refills or Energy Drinks.';
    $('mvSaveStatus').textContent='Saved on this device only';
    save();
  }
  function save(){
    const data={board:$('mvBoard').value,cleared:$('mvCleared').value,fields:$('mvFields').value,energy:$('mvEnergy').value,drinks:$('mvDrinks').value,refills:$('mvRefills').value,counts:readCounts()};
    try{localStorage.setItem(KEY,JSON.stringify(data));}catch(e){}
  }
  function load(){
    try{
      const d=JSON.parse(localStorage.getItem(KEY)||'null');if(!d)return;
      $('mvBoard').value=d.board||'farm';$('mvCleared').value=d.cleared??0;$('mvFields').value=d.fields??1;
      $('mvEnergy').value=d.energy??0;$('mvDrinks').value=d.drinks??0;$('mvRefills').value=d.refills??0;
      (d.counts||[]).forEach((x,i)=>{if(i<12){$('mvL'+(i+1)).value=x.loose||0;$('mvB'+(i+1)).value=x.buried||0;}});
    }catch(e){}
  }
  function reset(){
    ['mvEnergy','mvDrinks','mvRefills'].forEach(id=>$(id).value=0);
    $('mvBoard').value='farm';$('mvCleared').value=0;$('mvFields').value=1;
    for(let i=1;i<=12;i++){$('mvL'+i).value=0;$('mvB'+i).value=0;}
    render();
  }
  function bind(){
    const root=$('mergeventureModal');if(!root||root.dataset.bound)return;root.dataset.bound='1';
    root.addEventListener('input',e=>{if(e.target.matches('input,select'))render();});
    root.addEventListener('change',e=>{if(e.target.matches('input,select'))render();});
    $('mvReset').addEventListener('click',reset);
    load();render();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bind);else bind();
})();