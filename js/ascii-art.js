// ASCII Art gallery (Whiteout Survival): 13 categories of copy-paste designs for
// profile names, alliance tags and chat. Click COPY, then paste in-game.
// All designs are original compositions of common Unicode symbols.

const ASCII_CATEGORIES = [
  {id:'all',      label:'All'},
  {id:'borders',  label:'Borders & dividers'},
  {id:'frost',    label:'Frost & winter'},
  {id:'crowns',   label:'Crowns & ranks'},
  {id:'weapons',  label:'Weapons & battle'},
  {id:'names',    label:'Name decorations'},
  {id:'faces',    label:'Faces & kaomoji'},
  {id:'beasts',   label:'Beasts & animals'},
  {id:'symbols',  label:'Stars & symbols'},
  {id:'banners',  label:'Banners'},
  {id:'love',     label:'Love'},
  {id:'pixel',    label:'Pixel art'},
  {id:'messages', label:'Messages'},
  {id:'general',  label:'General'}
];


// Emoji-square helpers for flags and pixel banners ("　" = full-width blank, same width as an emoji)
const SQ = {R:'🟥',W:'⬜',B:'🟦',Y:'🟨',G:'🟩',K:'⬛',O:'🟧',P:'🟪',N:'🟫',S:'🩷',F:'🌸',D:'😈'};
function sqRows(rows){ return rows.map(r => [...r].map(c => SQ[c] || '　').join('')).join('\n'); }
function stripesH(pattern, w, h){            // horizontal stripes, each h rows tall
  const out = [];
  for(const c of pattern) for(let i=0;i<h;i++) out.push(c.repeat(w));
  return sqRows(out);
}
function stripesV(pattern, h, wEach){        // vertical stripes
  const row = [...pattern].map(c => c.repeat(wEach)).join('');
  return sqRows(Array(h).fill(row));
}
const BRAZIL_FLAG = sqRows([
  'GGGGGGGGGGG','GGGGGYGGGGG','GGGYYBYYGGG','GYYBBBBBYYG','GGGYYBYYGGG','GGGGGYGGGGG','GGGGGGGGGGG'
]);
const JAPAN_FLAG = sqRows(['WWWWWWWWW','WWWRRRWWW','WWWRRRWWW','WWWRRRWWW','WWWWWWWWW']);

const ASCII_DATA = {
  borders:[
    ['Diamond divider','◈━━━━◈━━━━◈'],
    ['Ornate divider','⊰★⊱━━━━━━━━⊰★⊱'],
    ['Dot wave','•°•°•°•°•°•°•°•°•'],
    ['Arrow line','➳➳➳➳➳➳➳➳➳➳'],
    ['Star line','★☆★☆★☆★☆★☆★'],
    ['Snow line','❄ ❅ ❆ ❄ ❅ ❆ ❄'],
    ['Wave','~~~~~~~~~~~~~~~~'],
    ['Double line','═══════◈═══════'],
    ['Sparkle line','✦•·····•✦•·····•✦'],
    ['Box top','╔══════════════╗'],
    ['Box bottom','╚══════════════╝'],
    ['Chain','⛓ ⛓ ⛓ ⛓ ⛓ ⛓']
  ],
  frost:[
    ['Snow trio','❄ ❅ ❆'],
    ['Snowman','☃ Snowman ☃'],
    ['Frost sparkle','❅*:･ﾟ✧*:･ﾟ❆'],
    ['Frost line','✧･ﾟ: *✧･ﾟ:* ❄ *:･ﾟ✧*:･ﾟ✧'],
    ['Winter title','❆❅❆ WINTER ❆❅❆'],
    ['Whiteout','☃ Whiteout ☃'],
    ['Frost divider','❄ ── ✦ ── ❄'],
    ['Snow burst','*｡٭❅٭｡*'],
    ['Mountain','⛰ ❄ ⛰'],
    ['Ice crystal','◇❄◇❄◇'],
    ['Cold front','❄━━━━━━━━❄'],
    ['Frozen','✧❆ FROZEN ❆✧']
  ],
  crowns:[
    ['R5 crown','♛ R5 ♛'],
    ['R4 crown','♚ R4 ♚'],
    ['Leader','♔ Leader ♔'],
    ['Queen','♕ Queen ♕'],
    ['R5 bracket','【R5】'],
    ['R4 star','★ R4 ★'],
    ['Chief','⚜ Chief ⚜'],
    ['Commander','♜ Commander ♜'],
    ['Crown line','♛━━━━♛━━━━♛'],
    ['Royal','✦ ♛ ROYAL ♛ ✦'],
    ['Rank 1','❶ 𝗥𝗔𝗡𝗞 𝟭 ❶'],
    ['Elite','◆ ELITE ◆']
  ],
  weapons:[
    ['Crossed swords','⚔ ⚔'],
    ['Battle title','⚔ BATTLE ⚔'],
    ['Sword','o==[]::::::::>'],
    ['Classic sword','▬▬ι═══════ﺤ'],
    ['Bow and arrow','➳ ─── ➶'],
    ['Shield wall','⛨ ⛨ ⛨ ⛨ ⛨'],
    ['Rally','💥 RALLY 💥'],
    ['Sword line','⚔━━━━━◆━━━━━⚔'],
    ['Fight','(ง •̀_•́)ง'],
    ['Dagger','†═══════════'],
    ['Axe','⚒ ═══ ⚒'],
    ['Crossed swords (art)',String.raw`\\      //
 \\    //
  \\  //
   \\//
   //\\
  //  \\
 //    \\`]
  ],
  names:[
    ['Corner brackets','『Name』'],
    ['Lenticular','【Name】'],
    ['Star wings','★彡Name彡★'],
    ['Diamonds','✦ Name ✦'],
    ['Curly','༺Name༻'],
    ['Flower','꧁Name꧂'],
    ['Dots','°°·.·°Name°·.·°°'],
    ['Swords','⚔ Name ⚔'],
    ['Star','☆Name☆'],
    ['Quote','「Name」'],
    ['Triangles','◥Name◤'],
    ['Crown name','♛ Name ♛'],
    ['Snow name','❄ Name ❄'],
    ['Bars','▌║ Name ║▌']
  ],
  faces:[
    ['Shrug',String.raw`¯\_(ツ)_/¯`],
    ['Table flip','(╯°□°)╯︵ ┻━┻'],
    ['Bear','ʕ•ᴥ•ʔ'],
    ['Cool','(⌐■_■)'],
    ['Happy','(◕‿◕)♡'],
    ['Disapprove','ಠ_ಠ'],
    ['Hug','(づ｡◕‿‿◕｡)づ'],
    ['Lenny','( ͡° ͜ʖ ͡°)'],
    ['Ready to fight','(ง •̀_•́)ง'],
    ['Tired','(；一_一)'],
    ['Salute','o7'],
    ['Cheer','ヽ(´▽`)/'],
    ['Joy','(≧▽≦)'],
    ['Crying','(T_T)']
  ],
  beasts:[
    ['Bear','ʕ•ᴥ•ʔ'],
    ['Polar bear','ʕ·͡ᴥ·ʔ'],
    ['Cat','=^..^='],
    ['Dog','U･ᴥ･U'],
    ['Fish','><(((º>'],
    ['Fish (left)','<º)))><'],
    ['Mouse','<:3 )~~~~'],
    ['Bat','/|\\ ^._.^ /|\\'],
    ['Spider','/\\(oo)/\\'],
    ['Penguin','(°<)'],
    ['Rabbit',String.raw`(\_/)
(o.o)
(> <)`],
    ['Bear (face)','(ᵔᴥᵔ)']
  ],
  symbols:[
    ['Stars','★☆★☆★'],
    ['Sparkles','✦✧✦✧✦'],
    ['Star types','✪ ✯ ✰'],
    ['Card suits','♥ ♦ ♣ ♠'],
    ['Peace','☯ ☮ ☸'],
    ['Music','♪ ♫ ♬'],
    ['Flowers','✿ ❀ ✿'],
    ['Diamonds','❖ ◆ ◇'],
    ['Weather','☀ ☁ ☂ ☃'],
    ['Lightning','⚡ ✧ ⚡'],
    ['Arrows','→ ← ↑ ↓'],
    ['Infinity','∞ ✧ ∞']
  ],
  banners:[
    ['Alliance banner',`▛▀▀▀▀▀▀▀▀▀▀▀▀▜
    ALLIANCE
▙▄▄▄▄▄▄▄▄▄▄▄▄▟`],
    ['Victory banner',`◢◤◢◤◢◤◢◤◢◤◢◤
   V I C T O R Y
◥◣◥◣◥◣◥◣◥◣◥◣`],
    ['Indonesia Flag', stripesH('RW',9,2)+'\nMERDEKA!'],
    ['Romania Flag', stripesV('BYR',5,3)+'\nROMANIA'],
    ['Brazil Flag', BRAZIL_FLAG+'\nBRASIL'],
    ['France Flag', stripesV('BWR',5,3)+'\nFRANCE'],
    ['Italy Flag', stripesV('GWR',5,3)+'\nITALIA'],
    ['Germany Flag', stripesH('KRY',9,2)+'\nDEUTSCHLAND'],
    ['Netherlands Flag', stripesH('RWB',9,2)+'\nNEDERLAND'],
    ['Russia Flag', stripesH('WBR',9,2)+'\nRUSSIA'],
    ['Poland Flag', stripesH('WR',9,2)+'\nPOLSKA'],
    ['Ukraine Flag', stripesH('BY',9,2)+'\nUKRAINE'],
    ['Thailand Flag', stripesH('RWBBWR',9,1)+'\nTHAILAND'],
    ['Spain Flag', stripesH('RYYR',9,1)+'\nESPAÑA'],
    ['Hungary Flag', stripesH('RWG',9,2)+'\nMAGYARORSZÁG'],
    ['Ireland Flag', stripesV('GWO',5,3)+'\nÉIRE'],
    ['Belgium Flag', stripesV('KYR',5,3)+'\nBELGIË'],
    ['Japan Flag', JAPAN_FLAG+'\nNIHON'],
    ['Welcome',String.raw`+--------------------+
|   WELCOME TO THE   |
|      ALLIANCE      |
+--------------------+`],
    ['Recruiting',String.raw`=====================
 NOW RECRUITING!
 ACTIVE PLAYERS ONLY
 JOIN US  >>>  >>>
=====================`],
    ['Rally call',`>>>>>>>>>>>>>>>>>>>>
>>>   RALLY NOW   <<<
>>>>>>>>>>>>>>>>>>>>`],
    ['Thank you',`*  .  *  .  *  .  *
   THANK YOU ALL!
*  .  *  .  *  .  *`],
    ['Bear Trap',`★━━━━━━━━━━━━━━★
   BEAR TRAP NOW
★━━━━━━━━━━━━━━★`],
    ['Foundry',`⚔━━━━━━━━━━━━━⚔
 FOUNDRY BATTLE
⚔━━━━━━━━━━━━━⚔`]
  ],
  love:[
    ['Flower bouquet',`🌺🌷🌼🌸🌻
🌹✨🌷✨🌺
　🌼🌸🌹🌼
　　＼｜／
　　ʕ•ᴥ•ʔ
　　 ♡`],
    ['LOVE',`　🌸🌸　🌸🌸
🌸💗💗🌸💗💗🌸
🌸💗💗💗💗💗🌸
　🌸💗💗💗🌸
　　🌸💗🌸
　　　🌸`],
    ['Cuddle',` ∩────────∩
 ||(•ᴗ•)(•ᴗ•)||
 ||________||
  warm together`],
    ['Love you hard','(•̀ᴗ•́)و ̑̑ 💕 LOVE YOU!'],
    ['Heart eyes','(♡ᴗ♡)'],
    ['Flying hearts','💕 ・゜゜・。。・゜゜💗'],
    ['Heart','♡'],
    ['Hearts','❤ ❥ ❣'],
    ['Sparkle heart','♡･ﾟ: *✧･ﾟ:*'],
    ['Gift heart','(っ◔◡◔)っ ♥'],
    ['Happy heart','♥‿♥'],
    ['Heart row','❥❥❥❥❥'],
    ['Curl heart','ღ♥ღ'],
    ['Cute','(´,,•ω•,,)♡'],
    ['Heart divider','──♡──'],
    ['Love line','♡━━━━♡━━━━♡'],
    ['Cupid','♡ ➳ ♡'],
    ['Big love','♥ ♡ ♥ ♡ ♥']
  ],
  pixel:[
    ['Notebook cat',`◾　　　　　　　　　　　　　◾◾
◾◾◾　　　　　　　　　　◾📒◾
◾📒◾　　　　　　　　　◾📒📒◾
◾📒📒◾　　　　　　　◾📒📒📒◾
◾📒📒◾◾　　　　　◾◾📒📒📒◾
◾◾📒📒◾◾◾◾◾◾◾📒📒📒◾　
　◾📒📒📒📒📒📒📒📒📒📒📒◾　　
　◾📒📒📒📒📒📒📒📒📒📒📒◾　　
　◾◾📒📒📒📒📒📒📒📒📒📒◾　　
　◾📒📒📒📒📒📒📒📒📒📒📒📒◾　
 ◾📒⚪◾📒📒📒📒📒📒⚪◾📒◾　
◾◾📒◾◾📒📒📒📒📒📒◾◾📒◾◾
◾📒📕📒📒📒📒◾◾📒📒📒📒📕📒◾
◾◾📕📕📒📒📒📒📒📒📒📒📕📕◾◾
　◾◾📕📒📒📒◾◾📒📒📒📕◾◾　
　◾📒📒📒📒📒📒📒📒📒📒📒📒◾　
◾◾📒📒📒📒📒📒📒📒📒📒📒📒◾◾
◾📒📒📒📒📒📒📒📒📒📒📒📒📒📒◾
◾📒📒◾📒📒📒📒📒📒📒📒◾📒📒◾
◾📒◾📒📒📒📒📒📒📒📒📒📒◾📒◾`],
    ['Red heart', sqRows([
      '.RRR...RRR.',
      'RWRRR.RRRRR',
      'RRRRRRRRRRR',
      'RRRRRRRRRRR',
      '.RRRRRRRRR.',
      '..RRRRRRR..',
      '...RRRRR...',
      '....RRR....',
      '.....R.....'
    ])],
    ['Whale', sqRows([
      '....W.W....',
      '.....W.....',
      '..BBBBBB..B',
      '.BBBBBBBBBB',
      'BBKBBBBBBB.',
      'BBBBBBBBB..',
      'BWWWWWWBB..',
      '.BBBBBBB...'
    ])],
    ['Beer mug', sqRows([
      'WWWWWWWWW..',
      'WWWWWWWWW..',
      'NOOOOOOONNN',
      'NOOOOOOON.N',
      'NOOOOOOON.N',
      'NOOOOOOONNN',
      'NOOOOOOON..',
      'NNNNNNNNN..'
    ])],
    ['Hot coffee', sqRows([
      '..W...W....',
      '...W...W...',
      'WWWWWWWWW..',
      'WNNNNNNNWWW',
      'WNNNNNNNW.W',
      'WNNNNNNNWWW',
      'WWWWWWWWW..',
      '..WWWWW....'
    ])],
    ['Thumbs up', sqRows([
      '....YY.....',
      '....YY.....',
      '...YYY.....',
      'BBYYYYYYYY.',
      'BBYYYYYYYYY',
      'BBYYYYYYYYY',
      'BBYYYYYYYY.',
      'BBYYYYYYY..'
    ])],
    ['Pizza slice', sqRows([
      'NNNNNNNNNNN',
      '.YYRYYYYRY.',
      '..YYYYRYY..',
      '...YRYYY...',
      '....YYR....',
      '.....Y.....'
    ])],
    ['Devil cat', sqRows([
      'D.........D',
      'DD.......DD',
      'DDDDDDDDDDD',
      'DDWKDDDWKDD',
      'DDDDDDDDDDD',
      'DDDDDKDDDDD',
      '.DDDDDDDDD.',
      '..DDDDDDD..'
    ])],
    ['Frog', sqRows([
      '..WW...WW..',
      '.WKWGGGWKW.',
      'GGGGGGGGGGG',
      'GGGGGGGGGGG',
      'GGGKKKKKGGG',
      '.GGGGGGGGG.',
      '..GG...GG..'
    ])],
    ['Bear', sqRows([
      '.NN.....NN.',
      'NNNNNNNNNNN',
      'NNKNNNNNKNN',
      'NNNNOOONNNN',
      'NNNNOKONNNN',
      'NNNNOOONNNN',
      '.NNNNNNNNN.',
      '..NNNNNNN..'
    ])],
    ['Panda', sqRows([
      'KK.......KK',
      '.KWWWWWWWK.',
      'WWWWWWWWWWW',
      'WKKWWWWWKKW',
      'WWWWWKWWWWW',
      '.WWWWWWWWW.',
      '..WWWWWWW..'
    ])],
    ['Bunny', sqRows([
      '.WW.....WW.',
      '.WS.....SW.',
      '.WS.....SW.',
      'WWWWWWWWWWW',
      'WWKWWWWWKWW',
      'WWWWWSWWWWW',
      '.WWWWWWWWW.',
      '..WWWWWWW..'
    ])],
    ['Duck', sqRows([
      '...YYYY....',
      '..YYKYYOO..',
      '..YYYYYOO..',
      '...YYYY....',
      '..YYYYYYYY.',
      '.YYYYYYYYY.',
      '..YYYYYYY..',
      '...OO.OO...'
    ])],
    ['Blossom', sqRows([
      '....FFF....',
      '..F.FFF.F..',
      '.FFFFYFFFF.',
      '..F.FFF.F..',
      '....FFF....',
      '.....G.....',
      '...GGG.....'
    ])],
    ['Skull', sqRows([
      '..WWWWWWW..',
      '.WWWWWWWWW.',
      'WWKKWWWKKWW',
      'WWKKWWWKKWW',
      'WWWWWKWWWWW',
      '.WWWWWWWWW.',
      '..WKWKWKW..',
      '..WWWWWWW..'
    ])],
    ['Star', sqRows([
      '.....Y.....',
      '.....Y.....',
      'YYYYYYYYYYY',
      '.YYYYYYYYY.',
      '..YYYYYYY..',
      '..YYY.YYY..',
      '.YYY...YYY.',
      'YY.......YY'
    ])],
    ['Snowman', sqRows([
      '....RRR....',
      '...RRRRR...',
      '..WWWWWWW..',
      '..WKWWWKW..',
      '..WWWOWWW..',
      '..WWWWWWW..',
      '.WWWWKWWWW.',
      '.WWWWKWWWW.',
      '.WWWWWWWWW.',
      '..WWWWWWW..'
    ])],
    ['Heart',` ██  ██
████████
████████
 ██████
  ████
   ██`],
    ['Crown',`█ █ █ █
███████
███████`],
    ['Star',`   █
   █
███████
 █████
 ██ ██
██   ██`],
    ['Sword',`      ██
     ██
 █  ██
  ████
   ██
  █  █`],
    ['Tree',`   █
  ███
 █████
███████
   █`],
    ['Smile',` █████
█     █
█ █ █ █
█     █
█ ███ █
 █████`],
    ['Invader',`  █   █
   ███
  █████
 ██ █ ██
 ███████
 █ ███ █`]
  ],
  messages:[
    ['Rally','▶ Rally at my city, join now! ◀'],
    ['Thanks','★ Thank you for the help! ★'],
    ['Good luck','✦ Good luck everyone! ✦'],
    ['Bear Trap','⚔ Bear Trap starts soon, get ready ⚔'],
    ['Gifts','❄ Alliance gifts are ready, claim now ❄'],
    ['Foundry','✔ Foundry Battle: all in!'],
    ['Defend','⚠ Defend your city, shield up ⚠'],
    ['Recruiting','♛ Recruiting: active players welcome ♛'],
    ['Morning','☀ Good morning everyone ☀'],
    ['GG','GG, well played ✧']
  ],
  general:[
    ['Check / cross','✔ ✘'],
    ['Check','✓'],
    ['Arrow','→'],
    ['Triangles','▶ ▷ ▸'],
    ['Bullets','• ● ○'],
    ['Squares','◆ ◇ ■ □'],
    ['Up / down','▲ ▼'],
    ['Brackets','【 】『 』'],
    ['Guillemets','« »'],
    ['Flag','⚑'],
    ['Warning','⚠'],
    ['Dots','· • ● •  ·']
  ]
};

const ASCII_CUSTOM_KEY = 'wosAsciiCustom';
let asciiCat = 'all';
let asciiAll = [];
let asciiToastTimer = null;

function loadAsciiCustom(){
  try{ return JSON.parse(localStorage.getItem(ASCII_CUSTOM_KEY)) || []; }catch(e){ return []; }
}
function saveAsciiCustom(list){
  try{ localStorage.setItem(ASCII_CUSTOM_KEY, JSON.stringify(list)); }catch(e){}
}

function buildAsciiList(){
  asciiAll = [];
  Object.keys(ASCII_DATA).forEach(cat => {
    ASCII_DATA[cat].forEach(([name, art, by]) => asciiAll.push({cat, name, art, by, custom:false}));
  });
  loadAsciiCustom().forEach((c, i) => asciiAll.push({cat:c.cat, name:c.name, art:c.art, by:c.by, custom:true, ci:i}));
}

function initAsciiArt(){
  const chips = document.getElementById('asciiChips');
  if(chips && !chips.dataset.ready){
    chips.dataset.ready = '1';
    chips.innerHTML = ASCII_CATEGORIES.map(c =>
      `<button type="button" class="ascii-chip${c.id===asciiCat?' active':''}" data-cat="${c.id}" onclick="setAsciiCat('${c.id}')">${c.label}</button>`
    ).join('');
    const sel = document.getElementById('asciiNewCat');
    if(sel) sel.innerHTML = ASCII_CATEGORIES.filter(c => c.id!=='all')
      .map(c => `<option value="${c.id}">${c.label}</option>`).join('');
  }
  renderAsciiArt();
}

function setAsciiCat(id){
  asciiCat = id;
  document.querySelectorAll('#asciiChips .ascii-chip').forEach(b =>
    b.classList.toggle('active', b.dataset.cat === id));
  renderAsciiArt();
}

function renderAsciiArt(){
  const box = document.getElementById('asciiList');
  if(!box) return;
  buildAsciiList();
  const count = document.getElementById('asciiCount');
  if(count) count.textContent = asciiAll.length;
  const q = (document.getElementById('asciiSearch')?.value || '').trim().toLowerCase();
  const items = asciiAll
    .map((a, i) => ({...a, i}))
    .filter(a => (asciiCat==='all' || a.cat===asciiCat) &&
                 (!q || a.name.toLowerCase().includes(q) || a.art.toLowerCase().includes(q)));
  if(!items.length){
    box.innerHTML = '<div class="ascii-empty">No design found.</div>';
    return;
  }
  box.innerHTML = items.map(a => {
    const multi = a.art.includes('\n');
    const emoji = /\p{Extended_Pictographic}/u.test(a.art);
    const wide = multi && Math.max(...a.art.split('\n').map(l => [...l].length)) > 13;
    const body = multi
      ? `<pre class="ascii-pre${emoji?' emoji':''}${wide?' wide':''}">${escapeAscii(a.art)}</pre>`
      : `<span class="ascii-one${emoji?' emoji':''}">${escapeAscii(a.art)}</span>`;
    return `<div class="ascii-card">
      ${a.custom ? '<span class="ascii-badge">COMMUNITY</span>' : ''}
      <div class="ascii-art">${body}</div>
      <div class="ascii-name">${escapeAscii(a.name)}</div>
      ${a.by ? `<div class="ascii-by">by ${escapeAscii(a.by)}</div>` : ''}
      <div class="ascii-actions">
        <button type="button" class="ascii-copy" onclick="copyAscii(${a.i})"><i class="bi bi-copy"></i> COPY</button>
        ${a.custom ? `<button type="button" class="ascii-del" title="Delete" onclick="deleteAsciiCustom(${a.ci})"><i class="bi bi-trash"></i></button>` : ''}
      </div>
    </div>`;
  }).join('');
}

function escapeAscii(s){
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

async function copyAscii(i){
  const text = asciiAll[i]?.art;
  if(text == null) return;
  let ok = false;
  try{
    await navigator.clipboard.writeText(text);
    ok = true;
  }catch(e){
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
    document.body.appendChild(ta);
    ta.select();
    try{ ok = document.execCommand('copy'); }catch(_){}
    ta.remove();
  }
  showAsciiToast(ok ? `Copied: ${asciiAll[i].name}` : 'Copy failed, select the text manually');
}

function toggleAsciiForm(){
  const f = document.getElementById('asciiForm');
  if(f) f.classList.toggle('open');
}

function addAsciiCustom(){
  const name = document.getElementById('asciiNewName').value.trim();
  const cat  = document.getElementById('asciiNewCat').value;
  const by   = (document.getElementById('asciiNewBy')?.value || '').trim();
  const art  = document.getElementById('asciiNewArt').value.replace(/\s+$/,'');
  if(!name || !art){ showAsciiToast('Fill in the name and the design'); return; }
  const list = loadAsciiCustom();
  list.push({name, cat, art, by});
  saveAsciiCustom(list);
  document.getElementById('asciiNewName').value = '';
  document.getElementById('asciiNewArt').value = '';
  if(document.getElementById('asciiNewBy')) document.getElementById('asciiNewBy').value = '';
  document.getElementById('asciiForm').classList.remove('open');
  renderAsciiArt();
  showAsciiToast('Design added (saved in this browser)');
}

function deleteAsciiCustom(ci){
  const list = loadAsciiCustom();
  list.splice(ci, 1);
  saveAsciiCustom(list);
  renderAsciiArt();
}

function showAsciiToast(msg){
  const t = document.getElementById('asciiToast');
  if(!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(asciiToastTimer);
  asciiToastTimer = setTimeout(() => t.classList.remove('show'), 1800);
}
