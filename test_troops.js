const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  page.on('console', msg => { if (msg.type() === 'error') errors.push('CONSOLE: ' + msg.text()); });
  await page.goto('file:///home/claude/work/calc-main/index.html');

  // Open Training Troops Calculator
  await page.click('text=Training Troops Calculator');
  await page.waitForTimeout(200);

  const modalVisible = await page.isVisible('#troopsModal.open');
  console.log('Troops modal open:', modalVisible);

  const resultHTML = await page.$eval('#dbTroopResult', el => el.innerHTML).catch(e => 'ERROR: ' + e.message);
  console.log('dbTroopResult has content:', resultHTML.length > 50, resultHTML.slice(0,300));

  // Test Training mode default (T12 target)
  const trainCards = await page.$$eval('#dbTroopResult .stat .n', els => els.map(e => e.textContent));
  console.log('Training T12 cards:', trainCards);

  // Switch to Promotion mode
  await page.selectOption('#dbTroopMode', 'promote');
  await page.waitForTimeout(100);
  const fromVisible = await page.isVisible('#dbTroopFromWrap');
  console.log('From tier field visible after switching to promote:', fromVisible);
  const promoCards = await page.$$eval('#dbTroopResult .stat .n', els => els.map(e => e.textContent));
  console.log('Promotion T11->T12 cards:', promoCards);

  // set invalid combo: from=target
  await page.selectOption('#dbTroopFrom', 'T12');
  await page.selectOption('#dbTroopTier', 'T12');
  await page.waitForTimeout(100);
  const warnVisible = await page.isVisible('#dbTroopWarn:not(.hidden)');
  console.log('Warning shown for invalid tier order:', warnVisible);
  const invalidCards = await page.$$eval('#dbTroopResult .stat .n', els => els.map(e => e.textContent));
  console.log('Invalid combo cards (should be all 0):', invalidCards);

  await page.click('#troopsModal .modal-close');
  await page.waitForTimeout(150);

  // Now check other modals for crash-free open
  for (const [label, id] of [['War Academy','warAcademyModal'],['Chief Charm','charmModal'],['Chief Gear','chiefGearModal'],['SvS Calculator','svsModal'],['Building Calculator','buildingModal']]) {
    await page.click(`.menu-card:has-text("${label}")`);
    await page.waitForTimeout(150);
    const open = await page.isVisible('#'+id+'.open');
    console.log(label, 'opened:', open);
    await page.click('#'+id+' .modal-close');
    await page.waitForTimeout(100);
  }

  console.log('JS ERRORS:', errors.length ? errors : 'none');
  await browser.close();
})();
