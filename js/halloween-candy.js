/* Halloween Candy Planner — estimates based on community event data.
 * Source reference: wostools.net/halloween-candy-planner
 */
(function () {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const num = (id) => Math.max(0, Number($(id)?.value) || 0);
  const checked = (id) => !!$(id)?.checked;
  const fmt = (n) => Math.round(n).toLocaleString('en-US');
  const set = (id, value) => { const el = $(id); if (el) el.textContent = value; };

  function calculateHalloweenCandy() {
    const currentCandy = num('hcCurrentCandy');
    const currentPoints = num('hcCurrentPoints');
    const remainingChests = Math.floor(num('hcDailyChests'));
    const targetPoints = num('hcTargetPoints') || 12500;

    const kofStages = Math.min(7, Math.floor(num('hcKofStages')));
    const kofMilestones = kofStages >= 7 ? 0 : Math.min(5, Math.floor(num('hcKofMilestones')));
    const milestoneRewards = [250, 300, 350, 400, 400];
    const kofCandy = kofStages * 1700 + milestoneRewards.slice(0, kofMilestones).reduce((a, b) => a + b, 0);

    const tuneRuns = Math.floor(num('hcTuneRuns'));
    const tuneCandy = tuneRuns * num('hcTuneCandy') + (checked('hcTunePack') ? 1400 : 0);

    const ownDoorDays = num('hcDoorDays');
    const ownKnocksPerDay = Math.min(3, num('hcOwnKnocks'));
    const ownDoorCandy = ownDoorDays * ownKnocksPerDay * num('hcOwnDoorAvg');
    const sharedVisits = num('hcSharedVisits');
    const sharedAvg = $('hcWitchType')?.value === 'candy' ? 111 : 157;
    const sharedCandy = sharedVisits * sharedAvg;
    const visitors = num('hcVisitors');
    const visitorCandy = visitors * 20;

    const gemsCandy = Math.floor(num('hcGems') / 1000) * 10;
    const speedupCandy = Math.floor(num('hcSpeedupHours') / 2) * 10;
    const gatheringCandy = Math.min(3000, num('hcGatherHours') * num('hcGatherRate'));
    const beastCandy = Math.min(4000, Math.floor(num('hcBeasts')) * 10);

    const ghoulCandy = Math.min(3, Math.floor(num('hcGhoulMilestones'))) * 100;
    const scarletCandy = Math.min(4, Math.floor(num('hcScarletMilestones'))) * 160;
    const otherCandy = num('hcOtherCandy');

    const sources = [
      ['King of Phantoms', kofCandy],
      ['Halloween Tune', tuneCandy],
      ['Trick or treat! — own doors', ownDoorCandy],
      ['Trick or treat! — shared doors', sharedCandy],
      ['Visitors to your doors', visitorCandy],
      ['Sugar Storm — gems', gemsCandy],
      ['Sugar Storm — speedups', speedupCandy],
      ['Sugar Storm — gathering', gatheringCandy],
      ['Sugar Storm — beasts', beastCandy],
      ['Spooky Gathering — Ghoul Baron', ghoulCandy],
      ['Spooky Gathering — Scarlet Count', scarletCandy],
      ['Other candy', otherCandy]
    ];
    const earnedCandy = sources.reduce((sum, item) => sum + item[1], 0);

    const chestPoints = remainingChests * 300;
    const chestAttacks = remainingChests * 150;
    const pointsAfterChests = Math.max(0, targetPoints - currentPoints - chestPoints);
    const extraAttacks = Math.ceil(pointsAfterChests / 2);
    const totalAttacks = chestAttacks + extraAttacks;
    const attackCost = checked('hcLuckStrike') ? 16.3 : 20;
    const candySpend = totalAttacks * attackCost;
    const totalCandy = currentCandy + earnedCandy;
    const remainingCandy = totalCandy - candySpend;
    const affordableAttacks = Math.min(totalAttacks, Math.floor(totalCandy / attackCost));
    const projectedPoints = currentPoints + affordableAttacks * 2;
    const leftoverChests = Math.max(0, Math.floor(remainingCandy));

    set('hcEarnedCandy', fmt(earnedCandy));
    set('hcTotalCandy', fmt(totalCandy));
    set('hcAttackCount', fmt(totalAttacks));
    set('hcAttackCost', fmt(candySpend));
    set('hcProjectedPoints', fmt(projectedPoints));
    set('hcRemainingCandy', (remainingCandy < 0 ? '-' : '') + fmt(Math.abs(remainingCandy)));
    set('hcDailyChestPoints', fmt(chestPoints));
    set('hcResourceChests', fmt(leftoverChests));
    set('hcGoalStatus', projectedPoints >= targetPoints ? 'Target reached' : 'Not enough candy for target');
    set('hcLevelStatus', projectedPoints >= 2120 ? '2,120-point level 21 threshold reached' : fmt(2120 - projectedPoints) + ' points to the level 21 threshold');

    const breakdown = $('hcBreakdown');
    if (breakdown) {
      breakdown.innerHTML = sources.map(([name, value]) =>
        '<div class="hc-break-row"><span>' + name + '</span><strong>' + fmt(value) + '</strong></div>'
      ).join('');
    }
    const warning = $('hcPlannerWarning');
    if (warning) {
      warning.textContent = remainingCandy >= 0
        ? 'Estimated candy balance after the planned attacks is positive.'
        : 'You are short by ' + fmt(Math.abs(remainingCandy)) + ' candy for this target with the selected assumptions.';
      warning.className = 'hc-warning ' + (remainingCandy >= 0 ? 'ok' : 'warn');
    }
  }

  function bind() {
    const root = $('halloweenCandyModal');
    if (!root || root.dataset.bound) return;
    root.dataset.bound = '1';
    root.addEventListener('input', calculateHalloweenCandy);
    root.addEventListener('change', calculateHalloweenCandy);
    calculateHalloweenCandy();
  }

  window.calculateHalloweenCandy = calculateHalloweenCandy;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind);
  else bind();
})();
