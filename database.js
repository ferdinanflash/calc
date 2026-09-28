/* Whiteout Survival calculator database
   Values are sourced from public WoSTools/WoS references checked 2026-09-28.
   Keep this file separate so future balance/data updates do not require UI changes.
*/
const WOS_DB = {
  meta:{updated:'2026-09-28', sources:['https://wostools.net/troop-training-calculator','https://wostools.net/wiki/troops','https://wostools.net/war-academy-calculator','https://wostools.net/wiki/buildings/war-academy','https://wostools.net/chief-charms-calculator','https://wostools.net/chief-gear-calculator','https://wostools.net/wiki/gear/chief-gear']},
  troops:{
    T1:{meat:36,wood:27,coal:7,iron:2,seconds:12,power:3,hoc:90,svs:3,koi:1,as:1},
    T2:{meat:58,wood:44,coal:10,iron:3,seconds:17,power:4,hoc:120,svs:4,koi:2,as:1},
    T3:{meat:92,wood:69,coal:17,iron:4,seconds:24,power:6,hoc:180,svs:5,koi:3,as:2},
    T4:{meat:120,wood:90,coal:21,iron:5,seconds:32,power:9,hoc:265,svs:8,koi:5,as:3},
    T5:{meat:156,wood:117,coal:27,iron:6,seconds:44,power:13,hoc:385,svs:12,koi:7,as:4},
    T6:{meat:186,wood:140,coal:33,iron:7,seconds:60,power:20,hoc:595,svs:18,koi:11,as:7},
    T7:{meat:279,wood:210,coal:49,iron:11,seconds:83,power:28,hoc:830,svs:25,koi:16,as:10},
    T8:{meat:558,wood:419,coal:98,iron:21,seconds:113,power:38,hoc:1130,svs:35,koi:23,as:14},
    T9:{meat:1394,wood:1046,coal:244,iron:51,seconds:131,power:50,hoc:1485,svs:45,koi:30,as:18},
    T10:{meat:2788,wood:2091,coal:488,iron:102,seconds:152,power:66,hoc:1960,svs:60,koi:39,as:24},
    T11:{meat:6970,wood:5228,coal:1220,iron:253,seconds:180,power:80,hoc:2520,svs:75,koi:49,as:30},
    /* promotion = verified T11→T12 promotion delta (Target − From). The Troop
       Training Calculator now derives this same delta generically for every
       tier pair, so this object is kept only as a cross-check reference and
       is not read directly by script.js. seconds here is the T12-T11 time
       difference (480-180), consistent with the meat/wood/coal/iron deltas. */
    T12:{meat:9143,wood:8451,coal:1755,iron:418,seconds:480,power:130,hoc:2957,svs:94,koi:57,as:35, promotion:{meat:2173,wood:3223,coal:535,iron:165,seconds:300}},
  },
  /* Unit power by FC level, used by Training Troops Calculator.
     T10 uses Base + FC1..FC10; T11/T12 use FC0..FC10. */
  troopPower:{
    T10:[66,71,76,83,88,95,99,104,110,117,124],
    T11:[80,86,92,100,106,114,120,126,135,141,148],
    T12:[130,138,146,156,166,178,188,198,210,222,235]
  },
  troopTypes:['Infantry','Lancer','Marksman'],
  chiefGearPieces:[
    {id:'helmet',name:'Helmet',type:'Lancer'}, {id:'watch',name:'Watch',type:'Lancer'},
    {id:'jacket',name:'Jacket',type:'Infantry'}, {id:'pants',name:'Pants',type:'Infantry'},
    {id:'ring',name:'Ring',type:'Marksman'}, {id:'cane',name:'Cane',type:'Marksman'}
  ],
  /* Verified per-step costs exposed by the current public gear guide.
     Later Red families are represented by their published aggregate totals as a consistency check. */
  /* Chief Gear: 150 upgrade levels per piece (Green 0★ -> Red T6 3★), all 6 pieces share the same path.
     Costs/SvS, power and deployment capacity follow the public tables at
     wostools.net/wiki/gear/chief-gear (checked 2026-09-28). Built by WOS_buildChiefGear() below.
     Level 0 = "None (Not Started)". */
  chiefGear:null,
  chiefCharmsPieces:[
    {id:'helmet',name:'Helmet',type:'Lancer'},{id:'watch',name:'Watch',type:'Lancer'},
    {id:'jacket',name:'Jacket',type:'Infantry'},{id:'pants',name:'Pants',type:'Infantry'},
    {id:'ring',name:'Ring',type:'Marksman'},{id:'cane',name:'Cane',type:'Marksman'}
  ],
  /* Chief Charm per-step costs (Level 0 -> 18, incl. sub-levels): built by the Chief Charm
     builder at the end of this file from wostools.net/wiki/gear/chief-charms (checked 2026-09-28).
     WOS_DB.charmSteps[i] = {label, guides, designs, secrets, score}; index 0 = Level 0 (none). */
  charmSteps:null,
  charmRules:{pointsPerScore:70,exchange:{guideToDesign:2,designToGuide:2,guideToSecret:40,designToSecret:40}},
  warAcademy:{
    troopBranches:['Infantry','Lancer','Marksman'],
    helios:{
      common:[
        ['Flame Squad',5],['Flame Shield',8],['Flame Strike',8],['Flame Tomahawk',12],['Flame Protection',12],['Flame Legion',12],
        ['Helios',1],['Helios Training',10],['Helios Healing',10],['Helios First Aid',10]
      ],
      t12:{
        exalted:5,moltenI:20,gatewayI:3,moltenII:50,solar:15,moltenIII:50,training:10,healing:10,firstAid:10
      },
      verifiedRows:[
        {track:'Flame Squad',level:1,meat:300000,wood:300000,coal:60000,iron:15000,steel:5000,shards:16,refinedFC:0,seconds:28800,power:60000},
        {track:'Flame Squad',level:2,meat:480000,wood:480000,coal:96000,iron:24000,steel:8000,shards:25,refinedFC:0,seconds:46080,power:60000},
        {track:'Flame Squad',level:3,meat:780000,wood:780000,coal:150000,iron:39000,steel:13000,shards:41,refinedFC:0,seconds:74880,power:60000},
        {track:'Flame Protection',level:1,meat:700000,wood:700000,coal:140000,iron:35000,steel:15000,shards:54,refinedFC:0,seconds:68140,power:120000},
        {track:'Flame Protection',level:2,meat:860000,wood:860000,coal:170000,iron:43000,steel:18000,shards:66,refinedFC:0,seconds:83812,power:108000},
        {track:'Molten Plating I',level:1,meat:500000,wood:500000,coal:100000,iron:25000,steel:15000,shards:16,refinedFC:2,seconds:36000,power:50000},
        {track:'Molten Plating I',level:2,meat:520000,wood:520000,coal:100000,iron:26000,steel:15800,shards:17,refinedFC:2,seconds:37800,power:50000},
        {track:'Molten Plating I',level:5,meat:600000,wood:600000,coal:120000,iron:30000,steel:18000,shards:19,refinedFC:3,seconds:43200,power:50000},
        {track:'Molten Plating II',level:1,meat:500000,wood:500000,coal:100000,iron:25000,steel:18000,shards:75,refinedFC:5,seconds:43200,power:50000},
        {track:'Solar Supremacy',level:1,meat:500000,wood:500000,coal:100000,iron:25000,steel:25000,shards:75,refinedFC:5,seconds:43200,power:60000}
      ]
    }
  }
};

/* =========================================================================
   BUILDING CALCULATOR DATA
   Source: https://wostools.net/wiki/buildings/* (fetched 2026-09-28), which
   publishes per-level Meat/Wood/Coal/Iron/Fire Crystal/Refined FC costs and
   build times for all 15 Whiteout Survival buildings, taken from in-game
   verification + community data.
   These are the real numbers (not a fabricated growth curve), so totals
   here should line up with https://wostools.net/building-calculator.
   ========================================================================= */
(function(){
  // ---- helpers -----------------------------------------------------------
  function amt(s){
    if (s === '-' || s === '' || s == null) return 0;
    s = String(s).trim();
    const m = s.match(/^([\d.]+)\s*([KM]?)$/i);
    if (!m) return parseFloat(s) || 0;
    let n = parseFloat(m[1]);
    if (/K/i.test(m[2])) n *= 1e3;
    if (/M/i.test(m[2])) n *= 1e6;
    return Math.round(n);
  }
  function secs(s){
    if (s === '-' || s === '' || s == null) return 0;
    s = String(s).trim();
    if (/^<\s*1m$/i.test(s)) return 30;
    let total = 0;
    const d = s.match(/(\d+)\s*d/); if (d) total += parseInt(d[1], 10) * 86400;
    const h = s.match(/(\d+)\s*h/); if (h) total += parseInt(h[1], 10) * 3600;
    const minMatch = s.match(/(\d+)\s*m(?!\w)/); if (minMatch) total += parseInt(minMatch[1], 10) * 60;
    return total;
  }
  // row: [meat, wood, coal, iron, timeStr] -> base-level step
  function baseRow(r){
    return { meat: amt(r[0]), wood: amt(r[1]), coal: amt(r[2]), iron: amt(r[3]), fc: 0, rfc: 0, seconds: secs(r[4]) };
  }
  // row: [meat, wood, coal, iron, fcStr, rfcStr, timeStr] -> FC sub-level row
  function fcRow(r){
    return { meat: amt(r[0]), wood: amt(r[1]), coal: amt(r[2]), iron: amt(r[3]), fc: amt(r[4]), rfc: amt(r[5]), seconds: secs(r[6]) };
  }
  function rep(row, n){ return Array.from({length:n}, () => row.slice()); }
  function sumRows(rows){
    return rows.reduce((a,r)=>({
      meat:a.meat+r.meat, wood:a.wood+r.wood, coal:a.coal+r.coal, iron:a.iron+r.iron,
      fc:a.fc+r.fc, rfc:a.rfc+r.rfc, seconds:a.seconds+r.seconds
    }), {meat:0,wood:0,coal:0,iron:0,fc:0,rfc:0,seconds:0});
  }
  // Chunk a flat FC sub-level sequence into 10 "FC1..FC10" tiers, 5 rows per
  // tier (matches the site's real sub-level granularity: e.g. Furnace's
  // "FC1" tier = 30-1,30-2,30-3,30-4,FC1). Leftover rows (e.g. War Academy's
  // trailing FC10) form the final tier.
  function chunkFc(flatRows){
    const rows = flatRows.map(fcRow);
    const tiers = [];
    for (let i = 0; i < rows.length; i += 5){
      tiers.push(sumRows(rows.slice(i, i+5)));
    }
    while (tiers.length < 10) tiers.push({meat:0,wood:0,coal:0,iron:0,fc:0,rfc:0,seconds:0});
    return tiers.slice(0,10);
  }

  // ---- raw tables, transcribed verbatim from wostools.net/wiki/buildings -
  const RAW = {
    Furnace: {
      base: [
        ['-','-','-','-','-'],['-','180','-','-','<1m'],['-','805','-','-','1m'],
        ['-','1.8K','360','-','3m'],['-','7.6K','1.5K','-','10m'],['-','19.0K','3.8K','960','30m'],
        ['-','69.0K','13.0K','3.4K','1h'],['-','120.0K','25.0K','6.3K','2h 30m'],['-','260.0K','52.0K','13.0K','4h 30m'],
        ['-','460.0K','92.0K','23.0K','6h'],['1.3M','1.3M','260.0K','65.0K','7h 30m'],['1.6M','1.6M','330.0K','84.0K','9h'],
        ['2.3M','2.3M','470.0K','110.0K','11h'],['3.1M','3.1M','630.0K','150.0K','14h'],['4.6M','4.6M','930.0K','230.0K','18h'],
        ['5.9M','5.9M','1.1M','290.0K','1d 6h'],['9.3M','9.3M','1.8M','460.0K','1d 12h'],['12.0M','12.0M','2.5M','620.0K','1d 19h'],
        ['15.0M','15.0M','3.1M','780.0K','2d 17h'],['21.0M','21.0M','4.3M','1.0M','3d 10h'],['27.0M','27.0M','5.4M','1.3M','4d 10h'],
        ['36.0M','36.0M','7.2M','1.8M','6d 16h'],['44.0M','44.0M','8.9M','2.2M','9d 8h'],['60.0M','60.0M','12.0M','3.0M','13d 2h'],
        ['81.0M','81.0M','16.0M','4.0M','18d 8h'],['100.0M','100.0M','21.0M','5.2M','21d 2h'],['140.0M','140.0M','24.0M','7.4M','25d 7h'],
        ['190.0M','190.0M','39.0M','9.9M','29d 2h'],['240.0M','240.0M','49.0M','12.0M','33d 11h'],['300.0M','300.0M','60.0M','15.0M','40d 4h']
      ],
      fc: [].concat(
        rep(['67.0M','67.0M','13.0M','3.3M','132','-','7d'],5),
        rep(['72.0M','72.0M','14.0M','3.6M','158','-','9d'],5),
        rep(['79.0M','79.0M','15.0M','3.9M','238','-','11d'],5),
        rep(['82.0M','82.0M','16.0M','4.1M','280','-','12d'],5),
        rep(['84.0M','84.0M','16.0M','4.2M','335','-','14d'],5),
        rep(['96.0M','96.0M','19.0M','4.8M','200','10','15d'],4), [['96.0M','96.0M','19.0M','4.8M','100','20','15d']],
        rep(['100.0M','100.0M','21.0M','5.4M','240','15','18d'],4), [['100.0M','100.0M','21.0M','5.4M','120','30','18d']],
        rep(['130.0M','130.0M','26.0M','6.6M','240','20','20d'],4), [['130.0M','130.0M','26.0M','6.6M','120','40','20d']],
        rep(['140.0M','140.0M','29.0M','7.2M','280','30','13d'],4), [['140.0M','140.0M','29.0M','7.2M','140','60','13d']],
        rep(['160.0M','160.0M','33.0M','8.4M','350','70','20d'],4), [['160.0M','160.0M','33.0M','8.4M','175','140','20d']]
      )
    },
    Embassy: {
      base: [
        ['-','60','-','-','<1m'],['-','90','-','-','<1m'],['-','400','-','-','1m'],['-','900','180','-','2m'],
        ['-','3.8K','760','-','6m'],['-','9.6K','1.9K','480','13m'],['-','34.0K','6.9K','1.7K','25m'],['-','63.0K','12.0K','3.1K','45m'],
        ['-','130.0K','26.0K','6.5K','2h'],['-','230.0K','46.0K','11.0K','3h 57m'],['260.0K','260.0K','52.0K','13.0K','4h 57m'],
        ['330.0K','330.0K','67.0K','16.0K','5h 56m'],['470.0K','470.0K','95.0K','23.0K','7h 15m'],['630.0K','630.0K','120.0K','31.0K','9h 14m'],
        ['930.0K','930.0K','180.0K','46.0K','11h 52m'],['1.1M','1.1M','230.0K','59.0K','20h 7m'],['1.8M','1.8M','370.0K','93.0K','1d'],
        ['2.5M','2.5M','500.0K','120.0K','1d 4h'],['3.1M','3.1M','620.0K','150.0K','1d 19h'],['4.3M','4.3M','860.0K','210.0K','2d 6h'],
        ['5.4M','5.4M','1.0M','270.0K','2d 22h'],['7.2M','7.2M','1.4M','360.0K','4d 9h'],['8.9M','8.9M','1.7M','440.0K','6d 4h'],
        ['12.0M','12.0M','2.4M','600.0K','8d 15h'],['16.0M','16.0M','3.2M','810.0K','12d 2h'],['21.0M','21.0M','4.2M','1.0M','13d 22h'],
        ['29.0M','29.0M','5.9M','1.4M','16d 17h'],['39.0M','39.0M','7.9M','1.9M','19d 5h'],['49.0M','49.0M','9.8M','2.4M','22d 2h'],
        ['60.0M','60.0M','12.0M','3.0M','26d 12h']
      ],
      fc: [].concat(
        rep(['13.0M','13.0M','2.7M','670.0K','33','-','4d 14h'],5),
        rep(['14.0M','14.0M','2.9M','720.0K','39','-','5d 22h'],5),
        rep(['15.0M','15.0M','3.1M','790.0K','59','-','7d 6h'],5),
        rep(['16.0M','16.0M','3.2M','820.0K','70','-','7d 22h'],5),
        rep(['16.0M','16.0M','3.3M','840.0K','83','-','9d 5h'],5),
        rep(['19.0M','19.0M','3.8M','960.0K','50','2','9d 21h'],4), [['19.0M','19.0M','3.8M','960.0K','25','5','9d 21h']],
        rep(['21.0M','21.0M','4.3M','1.0M','60','3','11d 21h'],4), [['21.0M','21.0M','4.3M','1.0M','30','7','11d 21h']],
        rep(['26.0M','26.0M','5.3M','1.3M','60','5','13d 4h'],4), [['26.0M','26.0M','5.3M','1.3M','30','10','13d 4h']],
        rep(['29.0M','29.0M','5.8M','1.4M','70','7','8d 13h'],4), [['29.0M','29.0M','5.8M','1.4M','35','15','8d 13h']],
        rep(['33.0M','33.0M','6.7M','1.6M','87','17','13d 4h'],4), [['33.0M','33.0M','6.7M','1.6M','43','35','13d 4h']]
      )
    },
    'Research Center': {
      base: [
        ['-','105','-','-','<1m'],['-','160','-','-','<1m'],['-','725','-','-','<1m'],['-','1.6K','320','-','2m'],
        ['-','6.8K','1.3K','-','4m'],['-','17.0K','3.4K','860','9m'],['-','62.0K','12.0K','3.1K','18m'],['-','110.0K','22.0K','5.6K','27m'],
        ['-','230.0K','47.0K','11.0K','40m'],['-','410.0K','82.0K','20.0K','54m'],['520.0K','520.0K','100.0K','26.0K','1h 7m'],
        ['670.0K','670.0K','130.0K','33.0K','1h 21m'],['950.0K','950.0K','190.0K','47.0K','1h 39m'],['1.2M','1.2M','250.0K','63.0K','2h 6m'],
        ['1.8M','1.8M','370.0K','93.0K','2h 42m'],['2.3M','2.3M','470.0K','110.0K','4h 34m'],['3.7M','3.7M','740.0K','180.0K','5h 29m'],
        ['5.0M','5.0M','1.0M','250.0K','6h 35m'],['6.2M','6.2M','1.2M','310.0K','9h 52m'],['8.6M','8.6M','1.7M','430.0K','12h 20m'],
        ['10.0M','10.0M','2.1M','540.0K','16h 2m'],['14.0M','14.0M','2.8M','720.0K','1d'],['17.0M','17.0M','3.5M','890.0K','1d 9h'],
        ['24.0M','24.0M','4.8M','1.2M','1d 23h'],['32.0M','32.0M','6.5M','1.6M','2d 18h'],['42.0M','42.0M','8.4M','2.1M','3d 3h'],
        ['59.0M','59.0M','11.0M','2.9M','3d 19h'],['79.0M','79.0M','15.0M','3.9M','4d 8h'],['98.0M','98.0M','19.0M','4.9M','5d'],
        ['120.0M','120.0M','24.0M','6.0M','6d']
      ],
      fc: null
    },
    'Infantry Camp': {
      base: [
        ['-','-','-','-','<1m'],['-','140','-','-','<1m'],['-','645','-','-','<1m'],['-','1.4K','285','-','2m'],
        ['-','6.0K','1.2K','-','4m'],['-','15.0K','3.0K','765','9m'],['-','55.0K','11.0K','2.7K','18m'],['-','100.0K','20.0K','5.0K','27m'],
        ['-','200.0K','41.0K','10.0K','40m'],['-','360.0K','73.0K','18.0K','54m'],['460.0K','460.0K','92.0K','23.0K','1h 7m'],
        ['580.0K','580.0K','110.0K','29.0K','1h 21m'],['830.0K','830.0K','160.0K','41.0K','1h 39m'],['1.1M','1.1M','220.0K','55.0K','2h 6m'],
        ['1.6M','1.6M','320.0K','81.0K','2h 42m'],['2.0M','2.0M','410.0K','100.0K','4h 34m'],['3.2M','3.2M','650.0K','160.0K','5h 29m'],
        ['4.3M','4.3M','870.0K','210.0K','6h 35m'],['5.4M','5.4M','1.0M','270.0K','9h 52m'],['7.5M','7.5M','1.5M','370.0K','12h 20m'],
        ['9.5M','9.5M','1.9M','470.0K','16h 2m'],['12.0M','12.0M','2.5M','630.0K','1d'],['15.0M','15.0M','3.1M','490.0K','1d 9h'],
        ['21.0M','21.0M','4.2M','1.0M','1d 23h'],['28.0M','28.0M','5.7M','1.4M','2d 18h'],['36.0M','36.0M','7.3M','1.8M','3d 3h'],
        ['52.0M','52.0M','10.0M','2.6M','3d 19h'],['69.0M','69.0M','13.0M','3.4M','4d 8h'],['86.0M','86.0M','17.0M','4.3M','5d'],
        ['100.0M','100.0M','21.0M','5.2M','6d']
      ],
      fc: [].concat(
        rep(['23.0M','23.0M','4.7M','1.1M','59','-','1d 1h'],5),
        rep(['25.0M','25.0M','5.0M','1.2M','71','-','1d 8h'],5),
        rep(['27.0M','27.0M','5.5M','1.3M','107','-','1d 15h'],5),
        rep(['28.0M','28.0M','5.7M','1.4M','126','-','1d 19h'],5),
        rep(['29.0M','29.0M','5.9M','1.4M','150','-','2d 2h'],5),
        rep(['33.0M','33.0M','6.7M','1.6M','90','4','2d 6h'],4), [['33.0M','33.0M','6.7M','1.6M','45','9','2d 6h']],
        rep(['38.0M','38.0M','7.6M','1.9M','108','6','2d 16h'],4), [['38.0M','38.0M','7.6M','1.9M','54','13','2d 16h']],
        rep(['46.0M','46.0M','9.3M','2.3M','108','9','3d'],4), [['46.0M','46.0M','9.3M','2.3M','54','19','3d']],
        rep(['50.0M','50.0M','10.0M','2.5M','126','13','1d 22h'],4), [['50.0M','50.0M','10.0M','2.5M','63','27','1d 22h']],
        rep(['59.0M','59.0M','11.0M','2.9M','157','31','3d'],4), [['59.0M','59.0M','11.0M','2.9M','78','63','3d']]
      )
    },
    'Command Center': {
      base: [
        ['-','80','-','-','<1m'],['-','125','-','-','<1m'],['-','565','-','-','<1m'],['-','1.2K','250','-','1m'],
        ['-','5.3K','1.0K','-','3m'],['-','13.0K','2.6K','670','7m'],['-','48.0K','9.6K','2.4K','14m'],['-','88.0K','17.0K','4.4K','21m'],
        ['-','180.0K','36.0K','9.1K','32m'],['-','320.0K','64.0K','16.0K','43m'],['390.0K','390.0K','79.0K','19.0K','54m'],
        ['500.0K','500.0K','100.0K','25.0K','1h 4m'],['710.0K','710.0K','140.0K','35.0K','1h 19m'],['940.0K','940.0K','180.0K','47.0K','1h 40m'],
        ['1.3M','1.3M','270.0K','69.0K','2h 9m'],['1.7M','1.7M','350.0K','89.0K','3h 39m'],['2.7M','2.7M','550.0K','130.0K','4h 23m'],
        ['3.7M','3.7M','750.0K','180.0K','5h 16m'],['4.7M','4.7M','940.0K','230.0K','7h 54m'],['6.4M','6.4M','1.2M','320.0K','9h 52m'],
        ['8.1M','8.1M','1.6M','400.0K','12h 50m'],['10.0M','10.0M','2.1M','540.0K','19h 15m'],['13.0M','13.0M','2.6M','670.0K','1d 2h'],
        ['18.0M','18.0M','3.6M','900.0K','1d 13h'],['24.0M','24.0M','4.9M','1.2M','2d 4h'],['31.0M','31.0M','6.3M','1.5M','2d 12h'],
        ['44.0M','44.0M','8.9M','2.2M','3d'],['59.0M','59.0M','11.0M','2.9M','3d 11h'],['73.0M','73.0M','18.0M','4.5M','4d'],
        ['90.0M','90.0M','18.0M','4.5M','4d 19h']
      ],
      fc: [].concat(
        rep(['20.0M','20.0M','4.0M','1.0M','26','-','20h 9m'],5),
        rep(['21.0M','21.0M','4.3M','1.0M','31','-','1d 1h'],5),
        rep(['23.0M','23.0M','4.7M','1.1M','47','-','1d 7h'],5),
        rep(['24.0M','24.0M','4.9M','1.2M','56','-','1d 10h'],5),
        rep(['25.0M','25.0M','5.0M','1.2M','67','-','1d 16h'],5),
        rep(['29.0M','29.0M','5.8M','1.4M','40','2','1d 19h'],4), [['29.0M','29.0M','5.8M','1.4M','20','4','1d 19h']],
        rep(['32.0M','32.0M','6.5M','1.5M','48','3','2d 1h'],4), [['32.0M','32.0M','6.5M','1.5M','24','6','2d 1h']],
        rep(['39.0M','39.0M','7.9M','1.9M','48','4','2d 9h'],4), [['39.0M','39.0M','7.9M','1.9M','24','8','2d 9h']],
        rep(['43.0M','43.0M','8.7M','2.1M','56','6','1d 13h'],4), [['43.0M','43.0M','8.7M','2.1M','28','12','1d 13h']],
        rep(['50.0M','50.0M','10.0M','2.5M','70','14','2d 9h'],4), [['50.0M','50.0M','10.0M','2.5M','35','28','2d 9h']]
      )
    },
    'War Academy': {
      base: Array.from({length:30}, () => ['-','-','-','-','-']), // unlocks directly at FC tiers, negligible pre-FC cost
      fc: [].concat(
        [['-','-','-','-','-','-','<1m']],
        rep(['36.0M','36.0M','7.2M','1.8M','71','-','1d 19h'],4),
        [['36.0M','36.0M','7.2M','1.8M','71','-','1d 19h']],
        rep(['39.0M','39.0M','7.9M','1.9M','107','-','2d 4h'],4),
        [['39.0M','39.0M','7.9M','1.9M','107','-','2d 4h']],
        rep(['41.0M','41.0M','8.2M','2.0M','126','-','2d 9h'],4),
        [['41.0M','41.0M','8.2M','2.0M','126','-','2d 9h']],
        rep(['42.0M','42.0M','8.2M','2.1M','150','-','2d 19h'],4),
        [['42.0M','42.0M','8.2M','2.1M','150','-','2d 19h']],
        rep(['48.0M','48.0M','9.6M','2.4M','90','4','3d'],4),
        [['48.0M','48.0M','9.6M','2.4M','45','9','3d']],
        rep(['54.0M','54.0M','10.0M','2.7M','108','6','3d 14h'],4),
        [['54.0M','54.0M','10.0M','2.7M','54','13','3d 14h']],
        rep(['66.0M','66.0M','13.0M','3.3M','108','9','4d'],4),
        [['66.0M','66.0M','13.0M','3.3M','54','19','4d']],
        rep(['72.0M','72.0M','14.0M','3.6M','126','13','2d 14h'],4),
        [['72.0M','72.0M','14.0M','3.6M','63','27','2d 14h']],
        rep(['84.0M','84.0M','16.0M','7.2M','157','31','4d'],4),
        [['84.0M','84.0M','16.0M','7.2M','78','63','4d']]
      )
    },
    Infirmary: {
      base: [
        ['-','-','-','-','<1m'],['-','100','-','-','<1m'],['-','460','-','-','<1m'],['-','1.0K','205','-','2m'],
        ['-','4.3K','865','-','4m'],['-','10.0K','2.1K','545','8m'],['-','39.0K','7.8K','1.9K','16m'],['-','72.0K','14.0K','3.6K','25m'],
        ['-','140.0K','29.0K','7.4K','27m'],['-','260.0K','52.0K','13.0K','50m'],['320.0K','320.0K','65.0K','16.0K','1h 3m'],
        ['420.0K','420.0K','54.0K','21.0K','1h 15m'],['590.0K','590.0K','110.0K','29.0K','1h 32m'],['780.0K','780.0K','150.0K','39.0K','1h 57m'],
        ['1.1M','1.1M','230.0K','58.0K','2h 31m'],['1.4M','1.4M','290.0K','74.0K','4h 16m'],['2.3M','2.3M','460.0K','110.0K','5h 7m'],
        ['3.1M','3.1M','620.0K','150.0K','6h 8m'],['3.9M','3.9M','780.0K','190.0K','9h 13m'],['5.3M','5.3M','1.0M','260.0K','11h 31m'],
        ['6.8M','6.8M','1.3M','340.0K','14h 58m'],['9.0M','9.0M','1.8M','450.0K','22h 28m'],['11.0M','11.0M','2.2M','560.0K','1d 7h'],
        ['15.0M','15.0M','3.0M','750.0K','1d 20h'],['20.0M','20.0M','4.0M','1.0M','2d 13h'],['26.0M','26.0M','5.2M','1.3M','2d 22h'],
        ['37.0M','37.0M','7.4M','1.8M','3d 13h'],['49.0M','49.0M','9.9M','2.4M','4d 1h'],['61.0M','61.0M','12.0M','3.0M','4d 16h'],
        ['75.0M','75.0M','15.0M','3.7M','5d 15h']
      ],
      fc: [].concat(
        rep(['16.0M','16.0M','3.3M','840.0K','26','-','23h 31m'],5),
        rep(['18.0M','18.0M','3.6M','900.0K','31','-','1d 6h'],5),
        rep(['19.0M','19.0M','3.9M','990.0K','47','-','1d 12h'],5),
        rep(['20.0M','20.0M','4.1M','1.0M','56','-','1d 16h'],5),
        rep(['21.0M','21.0M','4.2M','1.0M','67','-','1d 23h'],5),
        rep(['24.0M','24.0M','4.8M','1.2M','40','2','2d 2h'],4), [['24.0M','24.0M','4.8M','1.2M','20','4','2d 2h']],
        rep(['27.0M','27.0M','5.4M','1.3M','48','3','2d 12h'],4), [['27.0M','27.0M','5.4M','1.3M','24','6','2d 12h']],
        rep(['33.0M','33.0M','6.6M','1.6M','48','4','2d 19h'],4), [['33.0M','33.0M','6.6M','1.6M','24','8','2d 19h']],
        rep(['36.0M','36.0M','7.2M','1.8M','56','6','1d 19h'],4), [['36.0M','36.0M','7.2M','1.8M','28','12','1d 19h']],
        rep(['42.0M','42.0M','8.4M','2.1M','70','14','2d 19h'],4), [['42.0M','42.0M','8.4M','2.1M','35','28','2d 19h']]
      )
    },
    Storehouse: {
      base: [
        ['-','60','-','-','<1m'],['-','90','-','-','<1m'],['-','400','-','-','<1m'],['-','900','180','-','2m'],
        ['-','3.8K','760','-','4m'],['-','9.6K','1.9K','480','9m'],['-','34.0K','6.9K','1.7K','18m'],['-','63.0K','12.0K','3.1K','27m'],
        ['-','130.0K','26.0K','6.5K','40m'],['-','230.0K','46.0K','11.0K','54m'],['280.0K','280.0K','57.0K','14.0K','1h 7m'],
        ['370.0K','370.0K','74.0K','18.0K','1h 21m'],['520.0K','520.0K','100.0K','26.0K','1h 39m'],['690.0K','690.0K','130.0K','34.0K','2h 6m'],
        ['1.0M','1.0M','200.0K','51.0K','2h 42m'],['1.3M','1.3M','260.0K','65.0K','4h 34m'],['2.0M','2.0M','400.0K','100.0K','5h 29m'],
        ['2.7M','2.7M','550.0K','130.0K','6h 35m'],['3.4M','3.4M','690.0K','170.0K','9h 52m'],['4.7M','4.7M','940.0K','230.0K','12h 20m'],
        ['6.0M','6.0M','1.2M','300.0K','16h 2m'],['7.9M','7.9M','1.5M','390.0K','1d'],['9.8M','9.8M','1.9M','490.0K','1d 9h'],
        ['13.0M','13.0M','2.6M','660.0K','1d 23h'],['17.0M','17.0M','3.5M','890.0K','2d 18h'],['23.0M','23.0M','4.6M','1.1M','3d 3h'],
        ['32.0M','32.0M','6.5M','1.6M','3d 19h'],['43.0M','43.0M','8.7M','2.1M','4d 8h'],['54.0M','54.0M','10.0M','2.7M','5d'],
        ['66.0M','66.0M','13.0M','3.3M','6d']
      ],
      fc: null
    },
    Barricade: {
      base: [
        ['-','-','-','-','-'],['5.3K','1.0K','-','-','<1m'],['88.0K','17.0K','4.4K','-','21m'],
        ['420.0K','420.0K','84.0K','21.0K','1h 4m'],['1.4M','1.4M','290.0K','74.0K','3h 39m'],['5.3M','5.3M','1.0M','260.0K','9h 52m'],
        ['15.0M','15.0M','3.0M','750.0K','1d 14h'],['37.0M','37.0M','7.4M','1.8M','3d'],['61.0M','61.0M','12.0M','3.0M','4d'],
        ['75.0M','75.0M','15.0M','3.7M','4d 22h']
      ],
      fc: null,
      maxLevel: 10
    },
    "Hunter's Hut": {
      base: [
        ['-','30','-','-','<1m'],['-','45','-','-','<1m'],['-','200','-','-','<1m'],['-','450','90','-','<1m'],
        ['-','1.9K','380','-','1m'],['-','4.8K','960','240','2m'],['-','17.0K','3.4K','865','4m'],['-','31.0K','6.3K','1.5K','7m'],
        ['-','65.0K','13.0K','3.2K','10m'],['-','110.0K','23.0K','5.7K','14m'],['110.0K','110.0K','23.0K','5.9K','18m'],
        ['150.0K','150.0K','30.0K','7.5K','21m'],['210.0K','210.0K','42.0K','10.0K','26m'],['280.0K','280.0K','56.0K','14.0K','33m'],
        ['410.0K','410.0K','83.0K','20.0K','43m'],['530.0K','530.0K','100.0K','26.0K','1h 13m'],['830.0K','830.0K','160.0K','41.0K','1h 27m'],
        ['1.1M','1.1M','220.0K','56.0K','1h 45m'],['1.4M','1.4M','280.0K','70.0K','2h 38m'],['1.9M','1.9M','300.0K','96.0K','3h 17m'],
        ['2.4M','2.4M','490.0K','120.0K','4h 16m'],['3.2M','3.2M','640.0K','160.0K','6h 25m'],['4.0M','4.0M','800.0K','200.0K','8h 59m'],
        ['5.4M','5.4M','1.0M','270.0K','12h 34m'],['7.3M','7.3M','1.4M','360.0K','17h 36m'],['9.4M','9.4M','1.8M','470.0K','20h 15m'],
        ['13.0M','13.0M','2.6M','670.0K','1d'],['17.0M','17.0M','3.5M','890.0K','1d 3h'],['22.0M','22.0M','4.4M','1.1M','1d 8h'],
        ['27.0M','27.0M','5.4M','1.3M','1d 14h']
      ],
      fc: null
    }
  };
  // Sawmill, Coal Mine and Iron Mine share the Hunter's Hut cost curve
  // (the game uses identical Meat/Wood/Coal/Iron/time tables for all four
  // basic resource producers); Lancer & Marksman Camp mirror Infantry Camp.
  RAW['Sawmill'] = RAW["Hunter's Hut"];
  RAW['Coal Mine'] = RAW["Hunter's Hut"];
  RAW['Iron Mine'] = RAW["Hunter's Hut"];
  RAW['Marksman Camp'] = RAW['Infantry Camp'];
  RAW['Lancer Camp'] = RAW['Infantry Camp'];

  const _stepsCache = {};
  function getSteps(name){
    if (_stepsCache[name]) return _stepsCache[name];
    const def = RAW[name];
    if (!def) return null;
    const baseSteps = def.base.map(baseRow); // 30 (or fewer, e.g. Barricade) entries
    const fcSteps = def.fc ? chunkFc(def.fc) : Array.from({length:10}, () => ({meat:0,wood:0,coal:0,iron:0,fc:0,rfc:0,seconds:0}));
    const steps = baseSteps.concat(fcSteps); // index 0..29 = level1..30 (or fewer), 30..39 = FC1..FC10
    _stepsCache[name] = { steps, maxLevel: def.maxLevel || 30, hasFc: !!def.fc };
    return _stepsCache[name];
  }

  WOS_DB.buildings = {
    names: ['Furnace','Infantry Camp','Lancer Camp','Marksman Camp','Embassy','Command Center',
      'Research Center','War Academy','Infirmary','Storehouse',"Hunter's Hut",'Sawmill','Coal Mine','Iron Mine','Barricade'],
    getSteps: getSteps,
    // Convert a level identifier (number 1..30/10, or 'FC1'..'FC10') to a 0-based step index.
    levelToIndex: function(lvl){
      if (typeof lvl === 'string'){
        const m = lvl.match(/^FC(\d+)$/i);
        if (m) return 29 + parseInt(m[1], 10);
        return NaN;
      }
      return lvl - 1;
    },
    // Sum resource/time cost for a building between two level identifiers.
    costBetween: function(name, from, to){
      const data = getSteps(name);
      const zero = {meat:0,wood:0,coal:0,iron:0,fc:0,rfc:0,seconds:0};
      if (!data) return zero;
      const fi = this.levelToIndex(from), ti = this.levelToIndex(to);
      if (isNaN(fi) || isNaN(ti) || ti <= fi) return zero;
      let out = {meat:0,wood:0,coal:0,iron:0,fc:0,rfc:0,seconds:0};
      // steps[k] holds the cost of the upgrade THAT PRODUCES level/tier (k+1),
      // so reaching every level from (from+1) through (to) means summing
      // indices (fi+1) .. ti inclusive.
      for (let i = Math.max(0, fi+1); i <= ti; i++){
        const s = data.steps[i];
        if (!s) continue;
        out.meat += s.meat; out.wood += s.wood; out.coal += s.coal; out.iron += s.iron;
        out.fc += s.fc; out.rfc += s.rfc; out.seconds += s.seconds;
      }
      return out;
    }
  };
})();


/* ---- Chief Gear level table builder ---- */
(function(){
  const rows=[]; // {name, alloy, solution, plans, amber, svs}
  const add=(name,c)=>rows.push({name,alloy:c[0],solution:c[1],plans:c[2],amber:c[3],svs:c[4]});
  const early=[
    ['Green 0★',1500,15,0,0,1125],['Green 1★',3800,40,0,0,1875],
    ['Blue 0★',7000,70,0,0,3000],['Blue 1★',9700,95,0,0,4500],['Blue 2★',0,0,45,0,5100],['Blue 3★',0,0,50,0,5440],
    ['Purple 0★',0,0,60,0,3230],['Purple 1★',0,0,70,0,3230],['Purple 2★',6500,65,40,0,3225],['Purple 3★',8000,80,50,0,3225],
    ['Purple T1 0★',10000,95,60,0,3440],['Purple T1 1★',11000,110,70,0,3440],['Purple T1 2★',13000,130,85,0,4085],['Purple T1 3★',15000,160,100,0,4085],
    ['Gold 0★',22000,220,40,0,6250],['Gold 1★',23000,230,40,0,6250],['Gold 2★',25000,250,45,0,6250],['Gold 3★',26000,260,45,0,6250],
    ['Gold T1 0★',28000,280,45,0,6250],['Gold T1 1★',30000,300,55,0,6250],['Gold T1 2★',32000,320,55,0,6250],['Gold T1 3★',35000,340,55,0,6250],
    ['Gold T2 0★',38000,390,55,0,6250],['Gold T2 1★',43000,430,75,0,6250],['Gold T2 2★',45000,460,80,0,6250],['Gold T2 3★',48000,500,85,0,6250]
  ];
  early.forEach(x=>add(x[0],x.slice(1)));
  for(let i=1;i<=3;i++) add(`Gold T2 3★ (${i}/4)`,[12500,132,21,2,2390]);
  // Red families 0-3★ (T1..T3 reuse the same shape): [base cost, sub-step cost]
  const red={
    'Red':[[[12500,134,22,4],[13000,140,22,2]],[[13000,140,24,4],[13500,147,23,2]],[[13500,149,26,4],[14000,155,25,2]],[[14000,155,25,4],[14750,167,27,3]]],
    'Red T1':[[[14750,169,29,6],[15250,175,28,3]],[[15250,175,31,6],[15750,182,30,3]],[[15750,184,30,6],[16250,190,31,3]],[[16250,190,32,6],[17000,202,33,5]]],
    'Red T2':[[[17000,204,36,5],[17500,210,35,5]],[[17500,210,35,5],[18000,217,36,5]],[[18000,219,37,5],[18500,225,37,5]],[[18500,225,39,5],[19250,237,40,6]]],
    'Red T3':[[[19250,239,40,7],[20000,247,41,6]],[[20000,249,42,7],[20750,257,42,6]],[[20750,259,44,7],[21500,267,45,6]]]
  };
  Object.entries(red).forEach(([fam,stars])=>stars.forEach(([base,sub],s)=>{
    add(`${fam} ${s}★`,base.concat(2390));
    for(let i=1;i<=3;i++) add(`${fam} ${s}★ (${i}/4)`,sub.concat(2390));
  }));
  add('Red T3 3★',[21500,269,45,7,2390]);
  for(let i=1;i<=4;i++) add(`Red T3 3★ (${i}/5)`,[24000,300,50,8,3112]);
  // Red T4..T6: each star = base row + 4 sub-steps
  const hi=[
    ['Red T4',0,[24000,300,50,8,3112],[28000,330,55,8,3080]],['Red T4',1,[28000,330,55,8,3080],[32000,360,60,8,3080]],
    ['Red T4',2,[32000,360,60,8,3080],[36000,390,65,8,3078]],['Red T4',3,[36000,390,65,8,3078],[40000,420,70,12,3080]],
    ['Red T5',0,[40000,420,70,12,3080],[44000,450,75,12,3078]],['Red T5',1,[44000,450,75,12,3078],[48000,480,80,12,3080]],
    ['Red T5',2,[48000,480,80,12,3080],[52000,510,85,12,3080]],['Red T5',3,[52000,510,85,12,3080],[56000,540,90,16,3078]],
    ['Red T6',0,[56000,540,90,16,3078],[60000,570,95,16,3080]],['Red T6',1,[60000,570,95,16,3080],[64000,600,100,16,3080]],
    ['Red T6',2,[64000,600,100,16,3080],[68000,630,105,16,3078]]
  ];
  hi.forEach(([fam,s,base,sub])=>{add(`${fam} ${s}★`,base);for(let i=1;i<=4;i++) add(`${fam} ${s}★ (${i}/5)`,sub);});
  add('Red T6 3★',[68000,630,105,16,3078]);

  // Power / stat % / deployment capacity (stat % = power / 24,000)
  const threeStarBases=[42,58,74,90,110,130];
  const levels=[{name:'None (Not Started)',alloy:0,solution:0,plans:0,amber:0,svs:0,power:0,stat:0,deploy:0}];
  rows.forEach((r,idx)=>{
    const L=idx+1; let p;
    if(L<=2)p=224400+81600*(L-1); else if(L<=6)p=408000+102000*(L-3);
    else if(L<=10)p=816000+69360*(L-7); else if(L<=14)p=1093440+69360*(L-11);
    else if(L<=18)p=1362720+61200*(L-15); else if(L<=22)p=1607520+61200*(L-19);
    else if(L<=25)p=1852320+61200*(L-23); else if(L===26)p=2040000;
    else if(L<=90)p=2065500+25500*(L-27); else p=3672000+40800*(L-90);
    let d=0; if(L>=27){d=10*(L-26)+90*threeStarBases.filter(b=>b<L).length;}
    levels.push(Object.assign({},r,{power:p,stat:p/24000,deploy:d}));
  });
  WOS_DB.chiefGear={levels,pieces:WOS_DB.chiefGearPieces,
    exchange:[['plans','amber',10,1,500],['plans','solution',1,3,500],['plans','alloy',1,300,500],['solution','plans',10,1,50],['solution','alloy',1,50,1000],['alloy','plans',1000,1,50],['alloy','solution',200,1,500]],
    exchangeUnlockLevel:levels.findIndex(x=>x.name==='Gold T2 3★'),
    svsPerScore:36, /* SvS points = chief gear score x 36 (per wostools wiki) */
    perPieceToRedT3:{alloy:1550500,solution:17460,plans:3390,amber:280,svs:9970560},
    allSixToRedT6:{alloy:25863000,solution:272160,plans:48240,amber:6000}};
})();

/* ---- Chief Charm step table builder ----
   Source: https://wostools.net/wiki/gear/chief-charms ("Upgrade Costs Per Charm").
   Each row group = [labels..., guides, designs, secrets, score]; the score column is the
   charm score (SvS points = score x 70). Column totals per charm (Lv 0 -> 18) must be
   Guides 7,100 / Designs 6,910 / Secrets 575 / Score 249,800. */
(function(){
  const G=[ // [labels], guides, designs, secrets, score(s)
    [['1'],5,5,0,[625]],[['2'],40,15,0,[1250]],[['3'],60,40,0,[3125]],[['4'],80,100,0,[8750]],
    [['4.1','4.2','4.3','5'],25,50,0,[2813,2813,2812,2812]],
    [['5.1','5.2','5.3','6'],30,75,0,[3125]],
    [['6.1','6.2','6.3','7'],35,100,0,[3125]],
    [['7.1','7.2','7.3','8'],50,100,0,[3250]],
    [['8.1','8.2','8.3','9'],75,100,0,[3500]],
    [['9.1','9.2','9.3','10'],105,105,0,[3750]],
    [['10.1','10.2','10.3','11'],140,105,0,[4000]],
    [['11.1','11.2','11.3','11.4','12'],116,90,3,[3400]],
    [['12.1','12.2','12.3','12.4','13'],116,90,6,[3600]],
    [['13.1','13.2','13.3','13.4','14'],120,100,9,[3800]],
    [['14.1','14.2','14.3','14.4','15'],120,100,14,[4000]],
    [['15.1','15.2','15.3','15.4','16'],130,110,20,[4200]],
    [['16.1','16.2','16.3','16.4','16.5','16.6','16.7','16.8','17'],85,70,15,[2500]],
    [['17.1'],100,90,20,[2700]],
    [['17.2','17.3','17.4','17.5','17.6','17.7','17.8','18'],150,130,20,[2700]]
  ];
  const steps=[{label:'0',guides:0,designs:0,secrets:0,score:0}];
  G.forEach(([labels,g,d,s,sc])=>labels.forEach((label,i)=>
    steps.push({label,guides:g,designs:d,secrets:s,score:sc.length>1?sc[i]:sc[0]})));
  WOS_DB.charmSteps=steps;
  // Sum of steps (from, to] where from/to are indices into charmSteps.
  WOS_DB.charmCost=function(from,to){
    const o={guides:0,designs:0,secrets:0,score:0};
    for(let i=Math.max(0,from)+1;i<=to&&i<steps.length;i++){
      const x=steps[i];o.guides+=x.guides;o.designs+=x.designs;o.secrets+=x.secrets;o.score+=x.score;
    }
    return o;
  };
})();
