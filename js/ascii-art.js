// ASCII Art gallery (Whiteout Survival): 13 categories of copy-paste designs for
// profile names, alliance tags and chat. Click COPY, then paste in-game.
// Cleaned & expanded for better in-game compatibility (safer Unicode characters).
// Updated to follow style of wosbot.com/ascii-art with many more designs.

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
    ['Star divider','━━━━━━ ⋆★⋆ ━━━━━━'],
    ['Ornate divider','⊰★⊱━━━━━━━━⊰★⊱'],
    ['Simple ornate','⋆ ──────── ⋆'],
    ['Dot wave','•°•°•°•°•°•°•°•°•'],
    ['Arrow line','➳➳➳➳➳➳➳➳➳➳'],
    ['Star line','★☆★☆★☆★☆★☆★'],
    ['Snow line','❄ ❅ ❆ ❄ ❅ ❆ ❄'],
    ['Wave','~~~~~~~~~~~~~~~~'],
    ['Double line','═══════◈═══════'],
    ['Sparkle line','✦•·····•✦•·····•✦'],
    ['Box top','╔══════════════╗'],
    ['Box bottom','╚══════════════╝'],
    ['Chain','⛓ ⛓ ⛓ ⛓ ⛓ ⛓'],
    ['Block line','▰▰▰▰▰▰▰▰▰▰▰▰▰▰'],
    ['Bold divider','═══════ ❖ ═══════'],
    ['Dash star','┅┅┅┅┅ ✦ ┅┅┅┅┅'],
    ['Thin line','────────────────'],
    ['Double thin','════════════════'],
    ['Star center','───── ★ ─────'],
    ['Diamond center','───── ◆ ─────'],
    ['Frost border','❄──────────────❄'],
    ['Arrow border','➤──────────────➤'],
    ['Heart border','♡──────────────♡'],
    ['Sword border','⚔──────────────⚔'],
    ['Crown border','♛──────────────♛'],
    ['Dot line','· · · · · · · · · ·'],
    ['Bullet line','● ● ● ● ● ● ● ●'],
    ['Triangle line','▲ ▼ ▲ ▼ ▲ ▼ ▲'],
    ['Square line','■ □ ■ □ ■ □ ■'],
    ['Wave star','~★~★~★~★~★~'],
    ['Heavy bar','■■■■■■■■■■■■'],
    ['Light bar','□□□□□□□□□□□□'],
    ['Mixed bar','■□■□■□■□■□■□'],
    ['Corner box','┌──────────────┐'],
    ['Bottom box','└──────────────┘'],
    ['Full box top','┏━━━━━━━━━━━━━━┓'],
    ['Full box bot','┗━━━━━━━━━━━━━━┛'],
['Double star line','★━━━━━━━━★━━━━━━━━★'],
['Wave diamond','～～◆～～◆～～◆～～'],
['Heart wave','♡～♡～♡～♡～♡～♡'],
['Arrow wave','➤～➤～➤～➤～➤'],
['Frost wave','❄～❅～❆～❄～❅'],
['Thick bar','▬▬▬▬▬▬▬▬▬▬▬▬▬▬'],
['Dash diamond','─ ─ ◆ ─ ─ ◆ ─ ─'],
['Star bullets','★ • ★ • ★ • ★'],
['Corner stars','★──────────────★'],
['Triple line','════════════════'],
['Soft dots','· · · · · · · · · · · ·'],
['Pipe line','│ │ │ │ │ │ │ │'],
['Slash line','/ / / / / / / / / /'],
['Backslash line','\\\\ \\\\ \\\\'],
['Equals star','════ ★ ════'],
['Ribbon','╰──────☆──────╯'],
['Top ribbon','╭──────★──────╮'],
['Bracket line','【 ────────── 】'],
['Quote line','「 ────────── 」'],
['Sword divider','⚔══════⚔══════⚔']
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
    ['Frozen','✧❆ FROZEN ❆✧'],
    ['Ice title','❄ ICE ❄'],
    ['Blizzard','❆ BLIZZARD ❆'],
    ['Snowfall','❄ · ❄ · ❄ · ❄'],
    ['Frost star','⋆❄⋆'],
    ['Winter crown','♛ ❄ WINTER ❄ ♛'],
    ['Polar','★ POLAR ★'],
    ['Arctic','✦ ARCTIC ✦'],
    ['Frost wings','❄彡 Name 彡❄'],
    ['Snow frame','【❄ Name ❄】'],
    ['Ice bracket','『❆ Name ❆』'],
    ['Cold line','❄─✧─❄─✧─❄'],
    ['Winter spark','*:･ﾟ✧❄*:･ﾟ✧'],
    ['Frozen heart','❄♡❄'],
    ['Ice sword','⚔ ❄ ⚔'],
    ['Snow mountain','⛰❄⛰❄⛰'],
    ['Whiteout title','★ WHITEOUT ★'],
    ['Frost rank','❄ R5 ❄'],
    ['Ice chief','❄ Chief ❄'],
['Snow row','❄❄❄❄❄❄❄❄❄'],
['Ice title 2','❆ ICE AGE ❆'],
['Frozen solid','❄ FROZEN SOLID ❄'],
['Winter is here','★ WINTER IS HERE ★'],
['Blizzard alert','⚠ BLIZZARD ⚠'],
['Snow castle','⛰❄ SNOW CASTLE ❄⛰'],
['Ice queen','♕ ICE QUEEN ♕'],
['Frost king','♛ FROST KING ♛'],
['Polar night','★ POLAR NIGHT ★'],
['Aurora','✦ AURORA ✦'],
['Snowball','❄ SNOWBALL FIGHT ❄'],
['Cold blood','❄ COLD BLOOD ❄'],
['Ice wall','❄│❄│❄│❄│❄'],
['Winter storm','🌨 WINTER STORM 🌨'],
['Frost bite','❄ FROSTBITE ❄'],
['Snowflake big','❄'],
['Triple snow','❅ ❄ ❆'],
['Ice path','❄─❄─❄─❄─❄'],
['Frozen heart 2','❄♥❄'],
['Whiteout zone','★ WHITEOUT ZONE ★']
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
    ['Elite','◆ ELITE ◆'],
    ['R5 star','★ R5 ★'],
    ['R4 crown simple','♛ R4 ♛'],
    ['King','♚ KING ♚'],
    ['Captain','✦ CAPTAIN ✦'],
    ['Officer','★ OFFICER ★'],
    ['Leader star','★ LEADER ★'],
    ['R5 fancy','♛【R5】♛'],
    ['R4 fancy','♚【R4】♚'],
    ['Chief crown','♛ Chief ♛'],
    ['Royal rank','⚜ RANK ⚜'],
    ['Top rank','▲ TOP ▲'],
    ['Elite star','★ ELITE ★'],
    ['Crown only','♛'],
    ['Double crown','♛♛'],
    ['Royal line','♛─♚─♛─♚─♛'],
    ['Rank 1','★ RANK 1 ★'],
    ['Rank 2','★ RANK 2 ★'],
    ['Commander star','★ Commander ★'],
    ['Alliance lead','♛ Alliance ♛'],
['R5 only','【R5】'],
['R4 only','【R4】'],
['R3 star','★ R3 ★'],
['Leader only','♔ LEADER'],
['Co-leader','♕ CO-LEADER'],
['Officer rank','★ OFFICER'],
['Member','• MEMBER'],
['Elite force','◆ ELITE FORCE ◆'],
['Royal guard','♛ ROYAL GUARD ♛'],
['War chief','⚔ WAR CHIEF ⚔'],
['Frost chief','❄ CHIEF ❄'],
['King of ice','♚ KING OF ICE'],
['Queen of snow','♕ QUEEN OF SNOW'],
['Commander R5','♜ R5 COMMANDER'],
['Top 1','🥇 TOP 1'],
['Top 10','★ TOP 10 ★'],
['MVP','★ MVP ★'],
['Legend rank','✦ LEGEND ✦'],
['Hero rank','★ HERO ★'],
['Veteran','★ VETERAN ★']
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
    ['War title','⚔ WAR ⚔'],
    ['Attack','▶ ATTACK ◀'],
    ['Defend','🛡 DEFEND 🛡'],
    ['Rally now','⚔ RALLY NOW ⚔'],
    ['Battle ready','★ BATTLE READY ★'],
    ['Sword star','⚔ ★ ⚔'],
    ['Crossed simple','⚔⚔'],
    ['Arrow attack','➤➤➤ ATTACK'],
    ['Shield up','⛨ SHIELD UP ⛨'],
    ['War line','⚔──────────⚔'],
    ['Fight on','⚔ FIGHT ⚔'],
    ['Victory','★ VICTORY ★'],
    ['Defeat','☠ DEFEAT ☠'],
    ['Hunt','🏹 HUNT 🏹'],
    ['Raid','⚡ RAID ⚡'],
    ['Storm','🌪 STORM 🌪'],
    ['Fire','🔥 FIRE 🔥'],
    ['Ice attack','❄ ATTACK ❄'],
    ['Bear trap','🐻 TRAP 🐻'],
['Swords crossed','⚔'],
['Battle cry','⚔ BATTLE CRY ⚔'],
['To war','➤ TO WAR'],
['Charge','⚔ CHARGE ⚔'],
['Hold the line','⛨ HOLD THE LINE'],
['No mercy','⚔ NO MERCY ⚔'],
['Blood and ice','⚔❄ BLOOD & ICE ❄⚔'],
['War path','➤ WAR PATH ➤'],
['Siege','⚔ SIEGE ⚔'],
['Ambush','⚡ AMBUSH ⚡'],
['Scout','🔍 SCOUT'],
['March','➤ MARCH ➤'],
['Stand ground','⛨ STAND GROUND'],
['All out','⚔ ALL OUT ⚔'],
['Victory or death','★ VICTORY OR DEATH ★'],
['For the alliance','⚔ FOR THE ALLIANCE ⚔'],
['Burn it','🔥 BURN IT 🔥'],
['Ice and fire','❄🔥 ICE & FIRE 🔥❄'],
['Last stand','⚔ LAST STAND ⚔'],
['War drums','🥁 WAR DRUMS']
  ],
  names:[
    ['Corner brackets','『Name』'],
    ['Lenticular','【Name】'],
    ['Star wings','★彡Name彡★'],
    ['Diamonds','✦ Name ✦'],
    ['Curly','༺Name༻'],
    ['Flower','꧁Name꧂'],
    ['Royal frame','꧁༺Name༻꧂'],
    ['Dots','°°·.·°Name°·.·°°'],
    ['Swords','⚔ Name ⚔'],
    ['Star','☆Name☆'],
    ['Quote','「Name」'],
    ['Triangles','◥Name◤'],
    ['Crown name','♛ Name ♛'],
    ['Snow name','❄ Name ❄'],
    ['Bars','▌║ Name ║▌'],
    ['Star frame','★ Name ★'],
    ['Diamond frame','◆ Name ◆'],
    ['Heart frame','♡ Name ♡'],
    ['Frost frame','❄ Name ❄'],
    ['Double star','★★ Name ★★'],
    ['Arrow name','➤ Name ➤'],
    ['Box name','【★ Name ★】'],
    ['Soft box','『✦ Name ✦』'],
    ['Line name','─ Name ─'],
    ['Wave name','~ Name ~'],
    ['Bullet name','• Name •'],
    ['Elite name','◆ ELITE Name ◆'],
    ['Chief name','♛ Chief Name ♛'],
    ['R5 name','【R5】 Name'],
    ['R4 name','【R4】 Name'],
    ['Alliance name','★ Alliance Name ★'],
    ['Ice wings','❄彡Name彡❄'],
    ['Fire wings','🔥彡Name彡🔥'],
    ['Simple star','⋆Name⋆'],
    ['Double diamond','◈ Name ◈'],
    ['Crown star','♛★Name★♛'],
    ['Flower star','꧁★Name★꧂'],
    ['Curly star','༺★Name★༻'],
    ['Safe brackets','[ Name ]'],
    ['Angle','〈 Name 〉'],
    ['Pipe','| Name |'],
    ['Slash','/ Name /'],
    ['Underline','_Name_'],
['Flower curly','꧁༺Name༻꧂'],
['Star curly','༺★Name★༻'],
['Snow curly','༺❄Name❄༻'],
['Sword frame','⚔【Name】⚔'],
['Crown frame','♛【Name】♛'],
['Diamond wings','◈彡Name彡◈'],
['Star box','【★Name★】'],
['Ice box','【❄Name❄】'],
['Fire box','【🔥Name🔥】'],
['Heart box','【♡Name♡】'],
['Elite box','【◆Name◆】'],
['Double quote','「「Name」」'],
['Triple star','★★★Name★★★'],
['Wave name 2','～★Name★～'],
['Bar name','║ Name ║'],
['Side stars','★ Name ★'],
['Side snow','❄ Name ❄'],
['Side swords','⚔ Name ⚔'],
['Side crowns','♛ Name ♛'],
['Side diamonds','◆ Name ◆'],
['Side hearts','♡ Name ♡'],
['Side sparkles','✦ Name ✦'],
['Mini frame','‹Name›'],
['Dot frame','·Name·'],
['Equals frame','═Name═']
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
    ['Crying','(T_T)'],
    ['Smile','(•‿•)'],
    ['Wink','(•‿•)'],
    ['Love face','(♡‿♡)'],
    ['Angry','(╬ಠ益ಠ)'],
    ['Surprise','(⊙_⊙)'],
    ['Sleep','(-_-) zzz'],
    ['Thumbs up','(•̀ᴗ•́)و'],
    ['Peace','✌(◕‿-)'],
    ['Cry happy','(T_T)♡'],
    ['Confused','(・_・)?'],
    ['Determined','(•̀ᴗ•́)'],
    ['Cute','(｡◕‿◕｡)'],
    ['Blush','(⁄ ⁄•⁄ω⁄•⁄ ⁄)'],
    ['Wave','(￣▽￣)ノ'],
    ['Bow','m(_ _)m'],
    ['Flex','ᕦ(ò_óˇ)ᕤ'],
['Happy simple','(＾▽＾)'],
['Sad simple','(T_T)'],
['Angry simple','(>_<)'],
['Wink simple','(^_~)'],
['Love simple','(♥_♥)'],
['Cool shades','(■_■¬)'],
['Shrug 2','┐(￣ヘ￣)┌'],
['Thumbs','d(＾▽＾)b'],
['Fight 2','(ง^_^)ง'],
['Sleep 2','(-_-) Zzz'],
['Cry 2','(;_;)'],
['Joy 2','ヽ(°▽°)ノ'],
['Nervous','(;;_)'],
['Proud','(￣^￣)'],
['Kiss','(*^3^)/~☆'],
['Hug 2','⊂(￣▽￣)⊃'],
['Wave 2','(￣▽￣)/'],
['Bow 2','m(._.)m'],
['Flex 2','ᕙ(⇀‸↼‶)ᕗ'],
['Peek','(/ω＼)']
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
    ['Bear (face)','(ᵔᴥᵔ)'],
    ['Cat face','(=^･ω･^=)'],
    ['Dog face','U・ᴥ・U'],
    ['Fox','=^･^='],
    ['Owl','(//_v_\\\\)'],
    ['Snake','～～～～～'],
    ['Bird','~(\\__/'],
    ['Bunny ears','(/) (\\)'],
    ['Paw','ฅ^•ﻌ•^ฅ'],
    ['Wolf','🐺'],
    ['Bear emoji','🐻'],
    ['Fox emoji','🦊'],
    ['Penguin emoji','🐧'],
    ['Owl emoji','🦉'],
    ['Cat emoji','🐱'],
    ['Dog emoji','🐶'],
    ['Rabbit emoji','🐰'],
    ['Fish emoji','🐟'],
    ['Dragon','🐉'],
    ['Simple fish','><(((º>  <º)))><'],
    ['Ocean fish', '🐡    🐠             /`·.¸        🐡           🐠            \n' +
        '        🐠            /¸...¸`:·.           🐡           \n' +
        '          🐡    ¸.·´)¸  )`·.¸.·´)               \n' +
        '  🐟          : o ):´; ). ) ¸  {      🐟              🐠\n' +
        '        🐟      `·.¸)`·  ¸.·´\\`·¸)         🐠     🐡\n' +
        ' 🐡     🐠          `\\\\´´\\¸.·´            🐠'],
    ['Fish line','🐟 🐠 🐡 🐟 🐠 🐡'],
['Cat row','🐱 🐱 🐱'],
['Dog row','🐶 🐶 🐶'],
['Bear row','🐻 🐻 🐻'],
['Wolf pack','🐺 🐺 🐺'],
['Fish swim','🐟🐠🐡🐟🐠'],
['Bird fly','🕊️ 🕊️ 🕊️'],
['Dragon roar','🐉 🔥 🐉'],
['Owl wise','🦉 🦉'],
['Fox sly','🦊'],
['Rabbit cute','🐰 🐰'],
['Penguin cold','🐧 ❄ 🐧'],
['Snake long','🐍～～～'],
['Paw prints','🐾 🐾 🐾'],
['Howl','🐺 HOWL 🐺'],
['Roar','🐻 ROAR 🐻'],
['Meow','🐱 MEOW'],
['Woof','🐶 WOOF'],
['Beast mode','★ BEAST MODE ★'],
['Animal pack','🐻🐺🦊🐱🐶'],
['Sea life','🐟🐠🐡🦈']
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
    ['Infinity','∞ ✧ ∞'],
    ['Check','✓ ✔'],
    ['Cross','✘ ✕'],
    ['Warning','⚠'],
    ['Star single','★'],
    ['Empty star','☆'],
    ['Sparkle','✦'],
    ['Diamond','◆'],
    ['Circle','● ○'],
    ['Square','■ □'],
    ['Triangle','▲ ▼'],
    ['Heart','♡ ❤'],
    ['Snow','❄ ❅ ❆'],
    ['Crown','♛ ♔'],
    ['Sword','⚔'],
    ['Shield','⛨'],
    ['Fire','🔥'],
    ['Ice','❄'],
    ['Star row','★★★★★'],
['Star5','★★★★★'],
['Star3','★★★'],
['Diamond3','◆◆◆'],
['Heart3','♡♡♡'],
['Snow3','❄❄❄'],
['Fire3','🔥🔥🔥'],
['Sword3','⚔⚔⚔'],
['Crown3','♛♛♛'],
['Check3','✔✔✔'],
['Arrow3','➤➤➤'],
['Spark3','✦✦✦'],
['Circle3','●●●'],
['Square3','■■■'],
['Tri up','▲▲▲'],
['Tri down','▼▼▼'],
['Plus line','＋＋＋＋＋'],
['Dot3','•••'],
['Bar3','━━━'],
['Wave3','～～～'],
['Star spark','★✦★✦★']
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
⚔━━━━━━━━━━━━━⚔`],
    ['Simple welcome','★ WELCOME ★'],
    ['Join us','★ JOIN US ★'],
    ['Active only','★ ACTIVE ONLY ★'],
    ['Rally banner','⚔ RALLY ⚔'],
    ['SvS ready','★ SVS READY ★'],
    ['Shield up','⛨ SHIELD UP ⛨'],
    ['War time','⚔ WAR TIME ⚔'],
    ['Good luck','✦ GOOD LUCK ✦'],
    ['GG','★ GG ★'],
    ['Nice try','★ NICE TRY ★'],
['Rally time','⚔ RALLY TIME ⚔'],
['Bear now','🐻 BEAR TRAP NOW 🐻'],
['Foundry now','⚔ FOUNDRY NOW ⚔'],
['SvS fight','★ SVS FIGHT ★'],
['Shields up','⛨ SHIELDS UP ⛨'],
['Open borders','★ OPEN BORDERS ★'],
['Close borders','★ CLOSE BORDERS ★'],
['Nap active','☮ NAP ACTIVE ☮'],
['War declared','⚔ WAR DECLARED ⚔'],
['Peace','☮ PEACE ☮'],
['Recruit active','♛ RECRUITING ♛'],
['Need R4','★ NEED R4 ★'],
['Active check 2','★ WHO IS ACTIVE? ★'],
['Gift time','🎁 GIFTS READY 🎁'],
['Event start','★ EVENT START ★'],
['Event end','★ EVENT END ★'],
['Good fight','★ GOOD FIGHT ★'],
['Well done','★ WELL DONE ★'],
['Try harder','★ TRY HARDER ★'],
['Never give up','★ NEVER GIVE UP ★']
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
    ['Big love','♥ ♡ ♥ ♡ ♥'],
    ['Simple love','★ LOVE ★'],
    ['Heart star','♡★♡'],
    ['Love you','♡ LOVE YOU ♡'],
    ['Miss you','♡ MISS YOU ♡'],
    ['Best friend','★ BFF ★'],
    ['Family','♡ FAMILY ♡'],
    ['Alliance love','♡ ALLIANCE ♡'],
    ['Heart border','♡────────♡'],
    ['Double heart','♡♡'],
    ['Spark heart','✦♡✦'],
    ['Frost love','❄♡❄'],
    ['Crown love','♛♡♛'],
    ['Sparkle heart flower',`✨        
   🌸💕✨　　    ✨💕🌸
💗　　    🌸　🌸　　    💗
🌸                                      🌸　    
 ✨                                    ✨    
　💕                              💕
　   🌸                        🌸
　　　   ✨         ✨
                       💞`],
['Heart row 2','♡♡♡♡♡♡♡'],
['Love stars','★♡★♡★'],
['Love snow','❄♡❄♡❄'],
['Love crown','♛♡♛'],
['Love sword','⚔♡⚔'],
['Be mine','♡ BE MINE ♡'],
['Soulmate','♡ SOULMATE ♡'],
['Bestie','★ BESTIE ★'],
['Family first','♡ FAMILY FIRST ♡'],
['Alliance family','♡ ALLIANCE = FAMILY ♡'],
['Miss you 2','♡ MISS YOU SO MUCH ♡'],
['Thank you love','♡ THANK YOU ♡'],
['Stay strong','♡ STAY STRONG ♡'],
['Together','♡ TOGETHER ♡'],
['Forever','♡ FOREVER ♡'],
['XOXO','♡ XOXO ♡'],
['Hugs','♡ HUGS ♡'],
['Kisses','♡ KISSES ♡'],
['Heart fire','🔥♡🔥'],
['Heart ice','❄♡❄']
  ],
  pixel:[
    // Prefer monochrome / simple blocks for better compatibility
    ['Heart mono',` ██  ██
████████
████████
 ██████
  ████
   ██`],
    ['Crown mono',`█ █ █ █
███████
███████`],
    ['Star mono',`   █
   █
███████
 █████
 ██ ██
██   ██`],
    ['Sword mono',`      ██
     ██
 █  ██
  ████
   ██
  █  █`],
    ['Tree mono',`   █
  ███
 █████
███████
   █`],
    ['Smile mono',` █████
█     █
█ █ █ █
█     █
█ ███ █
 █████`],
    ['Invader mono',`  █   █
   ███
  █████
 ██ █ ██
 ███████
 █ ███ █`],
    ['Heart block',`■  ■
■■■■
■■■■
 ■■
  ■`],
    ['Star block',`  ■
■■■■■
 ■■■
■ ■ ■`],
    ['Sword block',`  ■
  ■
■■■
  ■
 ■ ■`],
    // Keep a few popular emoji pixel that often work
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
    ['Frog', sqRows([
      '..WW...WW..',
      '.WKWGGGWKW.',
      'GGGGGGGGGGG',
      'GGGGGGGGGGG',
      'GGGKKKKKGGG',
      '.GGGGGGGGG.',
      '..GG...GG..'
    ])],
    ['Bear pixel', sqRows([
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
    ['Star pixel', sqRows([
      '.....Y.....',
      '.....Y.....',
      'YYYYYYYYYYY',
      '.YYYYYYYYY.',
      '..YYYYYYY..',
      '..YYY.YYY..',
      '.YYY...YYY.',
      'YY.......YY'
    ])],
    ['Snowman pixel', sqRows([
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
    // Notebook cat kept as popular
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
    ['Heart moon',`🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑
🌑🌑🌑🌑🌑💟🌑🌑🌑💟💟🌑💟💟🌑🌑
🌑🌑🌑🌑💟💟🌑🌑💟💟💟💟💟💟💟🌑
🌑🌑💟🌑🌑💟🌑🌑💟💟💟💟💟💟💟🌑
🌑💟💟💟🌑💟🌑🌑🌑💟💟💟💟💟🌑🌑
🌑🌑💟🌑🌑💟🌑🌑🌑🌑💟💟💟🌑🌑🌑
🌑🌑🌑🌑💟💟💟🌑🌑🌑🌑💟🌑🌑🌑🌑
🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑🌑`],
['Small heart',` ♡
♡♡♡
 ♡`],
['Small star',`  ★
 ★★★
★ ★ ★`],
['Small sword',`  ⚔
  │
  │`],
['Check big',`  ✔
 ✔✔
✔  ✔`],
['Snow big',`  ❄
 ❄❄❄
❄ ❄ ❄`],
    ['Heart block 2',`  ██  ██
 ████████
 ████████
  ██████
   ████
    ██`],
    ['Star block 2',`    █
   ███
  █████
 ███████
  █ █ █
 █  █  █`],
    ['Smile block',` █████
█     █
█ █ █ █
█     █
█ ███ █
 █████`],
    ['Ghost',` █████
███████
█ █ █ █
███████
███████
█ █ █ █`],
    ['Mushroom',`  █████
 ███████
█████████
   ███
  █████
 ███████`],
    ['House',`   █
  ███
 █████
███████
█ ███ █
█ ███ █`],
    ['Tree 2',`   █
  ███
 █████
███████
   █
   █`],
    ['Arrow up',`  █
 ███
█████
  █
  █
  █`],
    ['Arrow down',`  █
  █
  █
█████
 ███
  █`],
    ['Diamond pixel',`  █
 ███
█████
 ███
  █`],
    ['Cross pixel',`  █
  █
█████
  █
  █`],
    ['Box open',`█████
█   █
█   █
█   █
█████`],
    ['Box filled',`█████
█████
█████
█████
█████`],
    ['Stairs',`█
██
███
████
█████`],
    ['Wave pixel',`█  █  █
 █  █  █
█  █  █
 █  █  █`],
    ['Checker',`█ █ █ █
 █ █ █ █
█ █ █ █
 █ █ █ █`],
    ['Border box',`╔═══╗
║   ║
║   ║
╚═══╝`],
    ['Cat face pixel',`█   █
█████
█ █ █
█████
 █ █`],
    ['Alien',`  █ █
 █████
█ █ █ █
█████
 █   █`],
    ['Robot',` ████
█ ██ █
██████
 █  █
 █  █`],
    ['Sword pixel 2',`    █
   █
  █
 ███
  █
 █ █`],
    ['Shield pixel',` ████
█    █
█    █
 █  █
  ██`],
    ['Crown pixel 2',`█ █ █
█████
█████
 ███`],
    ['Flag pixel',`█
████
█
█
█`],
    ['Moon pixel',` ███
█
█
█
 ███`],
    ['Sun pixel',`  █
█ ███ █
 █████
█ ███ █
  █`],
    ['Music note',`  ██
 █  █
 █  █
███
█`],
    ['Coffee pixel',` ███
█   █
█████
 ███
  █`],
    ['Ice cream',`  ███
 █████
 █████
  ███
   █`],
    ['Candy',`  ██
 ████
██████
 ████
  ██`],
    ['Balloon',`  ███
 █████
 █████
  ███
   █
   █`],
    ['Gift box',`  █
█████
█ █ █
█████
█████`],
    ['Letter A',`  █
 █ █
█████
█   █
█   █`],
    ['Letter B',`████
█   █
████
█   █
████`],
    ['Letter S',` ████
█
 ███
    █
████`],
    ['Number 1',`  █
 ██
  █
  █
 ███`],
    ['Number 5',`████
█
 ███
    █
████`],
    ['Heart emoji grid', sqRows([
      '.RRR...RRR.',
      'RRRRR.RRRRR',
      'RRRRRRRRRRR',
      '.RRRRRRRRR.',
      '..RRRRRRR..',
      '...RRRRR...',
      '....RRR....',
      '.....R.....'
    ])],
    ['Smile emoji grid', sqRows([
      '..YYYYY..',
      '.YYYYYYY.',
      'YYKYYYKY Y'.replace(' ',''),
      'YYYYYYYYY',
      'YYKYYY KYY'.replace(' ',''),
      'YYYKKKYYY',
      '.YYYYYYY.',
      '..YYYYY..'
    ])],
    ['Fire pixel',`  █
 █ █
 █ █ █
███████
 █████
  ███`],
    ['Snowflake pixel',`  █  █
█  █  █
  █████
█  █  █
  █  █`],
    ['Mountain pixel',`    █
   █ █
  █   █
 █     █
█████████`],
    ['Wave sea',`~  ~  ~
 ~  ~  ~
~  ~  ~
 ~  ~  ~`],
    ['Bar chart',`    █
  █ █
█ █ █
█ █ █
█████`],
    ['Target',`  ███
 █   █
█  █  █
 █   █
  ███`],
    ['Key',` ███
█   █
 ███
  █
  ██`],
    ['Lock',`  ██
 █  █
██████
█    █
 ████`],
    ['Lightning pixel',`  █
 ██
█████
  ██
  █`],
    ['Drop',`  █
 ███
█████
█████
 ███`],
    ['Leaf',`   █
  ███
 █████
  ███
   █`],
    ['Paw pixel',`█  █  █
 █████
███████
 █████
  ███`],
    ['Fish pixel',`  ████
 █    ██
█  █    █
 █    ██
  ████`],
    ['Bird pixel',`  █
 ███
█████ █
 ███
  █ █`],
    ['Cat sit',`█   █
█████
█ █ █
█████
█   █`],
    ['Dog sit',`  ██
 ████
█ █ █
█████
█   █`],
    ['Bunny pixel',`█   █
█   █
█████
█ █ █
█████`],
    ['Bear pixel 2',`█   █
█████
█ █ █
█████
 █ █`],
    ['Owl pixel',` ████
█ █ █ █
██████
 ████
 █  █`],
    ['Frog pixel',` █   █
███████
█ █ █ █
███████
 █   █`],
    ['Snake pixel',`████
   █
 ████
 █
████`],
    ['Cactus',`  █
█ █ █
█ █ █
  █
  █`],
    ['Flower pixel',`  █ █
 █ █ █
  █ █
   █
   █`],
    ['Star row pixel',`★ ★ ★
★ ★ ★
★ ★ ★`],
    ['Heart row pixel',`♡ ♡ ♡
♡ ♡ ♡
♡ ♡ ♡`],
    ['Snow row pixel',`❄ ❄ ❄
❄ ❄ ❄
❄ ❄ ❄`],
    ['Block pyramid',`    █
   ███
  █████
 ███████
█████████`],
    ['Invader 2',` █   █
  ███
 █████
█ █ █ █
███████
█ ███ █`],
    ['Tank',`  █
█████
█ ███ █
███████
 █   █`],
    ['Plane',`    █
    █
  █████
    █
   █ █`],
    ['Car pixel',`  ████
 ██████
█ █  █ █
 ██████
  █  █`],
    ['Boat',`    █
   ███
  █████
 ███████
█████████`],
    ['Castle',`█ █ █ █
███████
█ ███ █
█ ███ █
███████`],
    ['Bridge',`█     █
█ ███ █
███████
  █ █
  █ █`],
    ['Window',`█████
█ █ █
█████
█ █ █
█████`],
    ['Door',` ███
█   █
█  █ █
█   █
█████`],
    ['Chair',`█
████
█  █
█  █
█  █`],
    ['Table',`█████
█ █ █
█ █ █`],
    ['Clock',` ████
█ █  █
█  █ █
█    █
 ████`],
    ['Book',`████
█  █
█  █
█  █
████`],
    ['Phone',` ███
█   █
█ ███
█   █
 ███`],
    ['Controller',` █████
█ █ █ █
█████
 █   █`],
    ['Trophy',` █ █ █
 █████
  ███
   █
  ███`],
    ['Medal',`  █
 ███
█████
 ███
  █`],
    ['Gem pixel',`  █
 ███
█████
 ███
  █`],
    ['Coin',`  ███
 █   █
█  █  █
 █   █
  ███`],
    ['Bomb',`  █
 ███
█████
█████
 ███`],
    ['Explosion',`█ █ █
 █ █ █
█ █ █
 █ █ █`],
    ['Smoke',`  █ █
 █   █
█  █  █
 █   █`],
    ['Cloud pixel',`  ███
 █████
███████
 █████`],
    ['Rain',`  █ █ █
 █ █ █
█ █ █ █
 █ █ █`],
    ['Big X',`█   █
 █ █
  █
 █ █
█   █`],
    ['Big O',` ███
█   █
█   █
█   █
 ███`],
    ['Plus pixel',`  █
  █
█████
  █
  █`],
    ['Minus pixel',`█████`],
    ['Equal pixel',`█████

█████`],
    ['Happy square',`████████
█      █
█ █  █ █
█      █
█ ████ █
█      █
████████`],
    ['Sad square',`████████
█      █
█ █  █ █
█      █
█ ████ █
█      █
████████`.replace('█ ████ █','█ ▀▀▀▀ █')],
    ['WOS logo text',`W O S
★ ★ ★
❄ ❄ ❄`],
    ['R5 pixel',`████
█  █
████
█ █
█  █`],
    ['Alliance pixel',`█   █
█   █
█████
█   █
█   █`]

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
    ['GG','GG, well played ✧'],
    ['Rally simple','⚔ RALLY NOW ⚔'],
    ['Thanks simple','★ THANK YOU ★'],
    ['Good job','★ GOOD JOB ★'],
    ['Well played','★ WELL PLAYED ★'],
    ['Shield','⛨ SHIELD UP ⛨'],
    ['Join rally','▶ JOIN RALLY ◀'],
    ['Need help','⚠ NEED HELP ⚠'],
    ['On the way','➤ ON THE WAY'],
    ['Almost there','★ ALMOST THERE ★'],
    ['Done','✔ DONE'],
    ['Coming','➤ COMING'],
    ['Wait','⏳ WAIT'],
    ['Ready','★ READY ★'],
    ['Go go go','▶ GO GO GO ◀'],
    ['Push','⚔ PUSH ⚔'],
    ['Hold','⛨ HOLD ⛨'],
    ['Retreat','◀ RETREAT'],
    ['Nice','★ NICE ★'],
    ['Sorry','★ SORRY ★'],
    ['Welcome','★ WELCOME ★'],
    ['Good night','🌙 GOOD NIGHT'],
    ['See you','★ SEE YOU ★'],
    ['Miss you','♡ MISS YOU ♡'],
    ['Love alliance','♡ LOVE THIS ALLIANCE ♡'],
    ['Best alliance','★ BEST ALLIANCE ★'],
    ['Active check','★ ACTIVE? ★'],
    ['Online','★ ONLINE ★'],
    ['Farming','🌾 FARMING'],
    ['Building','🏗 BUILDING'],
    ['Research','🔬 RESEARCH'],
['Rally my city','▶ RALLY MY CITY ◀'],
['Join me','▶ JOIN ME ◀'],
['Need reinforce','⚠ NEED REINFORCE'],
['Sending help','➤ SENDING HELP'],
['On the way 2','➤ OTW'],
['Arrived','✔ ARRIVED'],
['Done 2','✔ DONE ✓'],
['Sorry late','★ SORRY IM LATE ★'],
['Good morning 2','☀ GOOD MORNING ☀'],
['Good night 2','🌙 GOOD NIGHT 🌙'],
['Have fun','★ HAVE FUN ★'],
['Take care','♡ TAKE CARE ♡'],
['See you later','★ SEE YOU LATER ★'],
['Welcome back','★ WELCOME BACK ★'],
['Congrats','★ CONGRATS ★'],
['Happy birthday','🎂 HAPPY BIRTHDAY'],
['New member','★ WELCOME NEW MEMBER ★'],
['Read rules','⚠ PLEASE READ RULES'],
['Discord link','★ JOIN DISCORD ★'],
['Check pin','★ CHECK PINNED ★'],
['Farm open','🌾 FARM OPEN'],
['Farm closed','🌾 FARM CLOSED'],
['Rss help','📦 NEED RSS'],
['Speedup help','⏱ NEED SPEEDUPS'],
['Gem help','💎 NEED GEMS']
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
    ['Dots','· • ● •  ·'],
    ['Star','★'],
    ['Empty star','☆'],
    ['Sparkle','✦'],
    ['Diamond','◆'],
    ['Heart','♡'],
    ['Snow','❄'],
    ['Crown','♛'],
    ['Sword','⚔'],
    ['Fire','🔥'],
    ['Ice','❄'],
    ['Check mark','✔'],
    ['Cross mark','✘'],
    ['Arrow right','➤'],
    ['Arrow left','◀'],
    ['Plus','＋'],
    ['Minus','－'],
    ['Equal','＝'],
    ['Infinity','∞'],
    ['Yes','✔ YES'],
    ['No','✘ NO'],
    ['OK','★ OK ★'],
    ['Wait 2','⏳ PLEASE WAIT'],
    ['Loading','⏳ LOADING...'],
    ['Online 2','🟢 ONLINE'],
    ['Offline','🔴 OFFLINE'],
    ['Busy','🟡 BUSY'],
    ['AFK','💤 AFK'],
    ['BRB','➤ BRB'],
    ['GG 2','★ GG WP ★'],
    ['WP','★ WP ★'],
    ['NT','★ NT ★'],
    ['GLHF','★ GLHF ★'],
    ['TY','★ TY ★'],
    ['NP','★ NP ★'],
    ['YW','★ YW ★'],
    ['LOL','★ LOL ★'],
    ['OMG','★ OMG ★'],
    ['RIP','☠ RIP']
  ]
};

const ASCII_CUSTOM_KEY = 'wosAsciiCustom';
let asciiCat = 'all';
let asciiAll = [];
let asciiShared = [];
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
  asciiShared.forEach(d => asciiAll.push({cat:d.cat, name:d.name, art:d.art, by:d.by, custom:false, shared:true}));
  // once a design you shared is approved it comes back as shared, so hide your local copy
  const seen = new Set(asciiShared.map(d => d.name + '\u0000' + d.art));
  loadAsciiCustom().forEach((c, i) => {
    if(seen.has(c.name + '\u0000' + c.art)) return;
    asciiAll.push({cat:c.cat, name:c.name, art:c.art, by:c.by, custom:true, ci:i});
  });
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
  asciiShareUI();
  renderAsciiArt();
  if(!asciiSharedLoaded && typeof loadAsciiShared === 'function'){
    asciiSharedLoaded = true;
    loadAsciiShared().then(ok => { if(ok) renderAsciiArt(); });
  }
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
      ${a.shared ? '<span class="ascii-badge">COMMUNITY</span>' : (a.custom ? '<span class="ascii-badge mine">MY DESIGN</span>' : '')}
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

async function addAsciiCustom(){
  const name = document.getElementById('asciiNewName').value.trim();
  const cat  = document.getElementById('asciiNewCat').value;
  const by   = (document.getElementById('asciiNewBy')?.value || '').trim();
  const art  = document.getElementById('asciiNewArt').value.replace(/\s+$/,'');
  if(!name || !art){ showAsciiToast('Fill in the name and the design'); return; }
  const shareBox = document.getElementById('asciiShare');
  const wantShare = !!(shareBox && shareBox.checked) && typeof asciiShareEnabled === 'function' && asciiShareEnabled();
  document.getElementById('asciiNewName').value = '';
  document.getElementById('asciiNewArt').value = '';
  if(document.getElementById('asciiNewBy')) document.getElementById('asciiNewBy').value = '';
  document.getElementById('asciiForm').classList.remove('open');
  showAsciiToast(wantShare ? 'Sending...' : 'Saving...');
  const msg = await asciiSaveEntry({name, cat, art, by}, wantShare);
  renderAsciiArt();
  showAsciiToast(msg);
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
