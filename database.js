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
    T12:{meat:9143,wood:8451,coal:1755,iron:418,seconds:480,power:178,hoc:2957,svs:94,koi:57,as:35, promotion:{meat:2173,wood:3223,coal:535,iron:165,seconds:8}}
  },
  troopTypes:['Infantry','Lancer','Marksman'],
  chiefGearPieces:[
    {id:'helmet',name:'Helmet',type:'Lancer'}, {id:'watch',name:'Watch',type:'Lancer'},
    {id:'jacket',name:'Jacket',type:'Infantry'}, {id:'pants',name:'Pants',type:'Infantry'},
    {id:'ring',name:'Ring',type:'Marksman'}, {id:'cane',name:'Cane',type:'Marksman'}
  ],
  /* Verified per-step costs exposed by the current public gear guide.
     Later Red families are represented by their published aggregate totals as a consistency check. */
  chiefGearSteps:[
    ['Green 0★',1500,15,0,0,1125],['Green 1★',3800,40,0,0,1875],
    ['Blue 0★',7000,70,0,0,3000],['Blue 1★',9700,95,0,0,4500],
    ['Blue 2★',0,0,45,0,5100],['Blue 3★',0,0,50,0,5440],
    ['Purple 0★',0,0,60,0,3230],['Purple 1★',0,0,70,0,3230],
    ['Purple 2★',6500,65,40,0,3225],['Purple 3★',8000,80,50,0,3225],
    ['Purple T1 0★',10000,95,60,0,3440],['Purple T1 1★',11000,110,70,0,3440],
    ['Purple T1 2★',13000,130,85,0,4085],['Purple T1 3★',15000,160,100,0,4085],
    ['Gold 0★',22000,220,40,0,6250],['Gold 1★',23000,230,40,0,6250],
    ['Gold 2★',25000,250,45,0,6250],['Gold 3★',26000,260,45,0,6250],
    ['Gold T1 0★',28000,280,45,0,6250],['Gold T1 1★',30000,300,55,0,6250],
    ['Gold T1 2★',32000,320,55,0,6250]
  ].map(x=>({stage:x[0],alloy:x[1],solution:x[2],plans:x[3],amber:x[4],svs:x[5]})),
  chiefGearTotals:{all6ToRedT6:{alloy:25863000,solution:272160,plans:48240,amber:6000}},
  chiefCharmsPieces:[
    {id:'helmet',name:'Helmet',type:'Lancer'},{id:'watch',name:'Watch',type:'Lancer'},
    {id:'jacket',name:'Jacket',type:'Infantry'},{id:'pants',name:'Pants',type:'Infantry'},
    {id:'ring',name:'Ring',type:'Marksman'},{id:'cane',name:'Cane',type:'Marksman'}
  ],
  /* Charm milestone costs published by current references. Sub-levels split the major-level payment. */
  charmLevels:{
    1:{guides:5,designs:5,secrets:0},2:{guides:10,designs:10,secrets:0},3:{guides:25,designs:25,secrets:0},
    4:{guides:80,designs:100,secrets:0},5:{guides:100,designs:120,secrets:0},6:{guides:140,designs:160,secrets:0},
    7:{guides:190,designs:220,secrets:0},8:{guides:240,designs:280,secrets:0},9:{guides:300,designs:400,secrets:0},
    10:{guides:400,designs:410,secrets:0},11:{guides:560,designs:420,secrets:0},
    12:{guides:580,designs:450,secrets:15},13:{guides:600,designs:480,secrets:30},
    14:{guides:620,designs:510,secrets:45},15:{guides:635,designs:530,secrets:70},
    16:{guides:650,designs:550,secrets:100},17:{guides:765,designs:630,secrets:135},18:{guides:1300,designs:1130,secrets:180}
  },
  charmRules:{pointsPerLevel:70000,exchange:{guideToDesign:2,designToGuide:2,guideToSecret:40,designToSecret:40}},
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
