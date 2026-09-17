export type Coin = { id: string; name: string; symbol: string; mark: string; color: string; cap: number; change: number; volume: number; reward: string; paid: number; progress: number; holders: number; age: string; tag?: string; creator?: string; txs?: number; image?: string };
export const coins: Coin[] = [
 {id:'cult',image:'/demo/cult.svg',name:'the collective',symbol:'CULT',mark:'◎',color:'lime',cap:842000,change:18.42,volume:184200,reward:'ETH',paid:12480,progress:100,holders:2841,age:'5d',tag:'platform token',creator:'@cultfun',txs:14210},
 {id:'orbit',image:'/demo/orbit.svg',name:'orbit',symbol:'ORBIT',mark:'◉',color:'purple',cap:128400,change:32.71,volume:48200,reward:'ETH',paid:2840,progress:100,holders:621,age:'2d',creator:'@orbitlabs',txs:3260},
 {id:'evergreen',image:'/demo/evergreen.svg',name:'evergreen',symbol:'EVER',mark:'✳',color:'green',cap:76300,change:12.36,volume:26700,reward:'USDG',paid:1260,progress:84,holders:418,age:'1d',creator:'@evergreenhq',txs:1410},
 {id:'afterhours',image:'/demo/afterhours.svg',name:'after hours',symbol:'AFTER',mark:'☾',color:'orange',cap:42100,change:-4.82,volume:19800,reward:'ETH',paid:684,progress:62,holders:296,age:'18h',creator:'@afterhrs',txs:880},
 {id:'signal',image:'/demo/signal.svg',name:'signal',symbol:'SIGNAL',mark:'⌁',color:'blue',cap:28600,change:8.93,volume:12400,reward:'USDG',paid:428,progress:41,holders:184,age:'8h',creator:'@signalcast',txs:520},
 {id:'common',image:'/demo/common.svg',name:'common ground',symbol:'COMMON',mark:'✺',color:'pink',cap:18400,change:24.17,volume:8600,reward:'ETH',paid:192,progress:26,holders:132,age:'3h',creator:'@commonfolk',txs:412},
 {id:'nightshift',image:'/demo/nightshift.svg',name:'night shift',symbol:'NIGHT',mark:'☽',color:'purple',cap:9200,change:41.8,volume:5100,reward:'ETH',paid:48,progress:12,holders:61,age:'42m',creator:'@latecrew',txs:96},
 {id:'lemonade',image:'/demo/lemonade.svg',name:'lemonade stand',symbol:'LEMON',mark:'✦',color:'orange',cap:6400,change:-2.1,volume:2900,reward:'ETH',paid:22,progress:8,holders:38,age:'19m',creator:'@sourpatch',txs:54},
 {id:'tidepool',image:'/demo/tidepool.svg',name:'tidepool',symbol:'TIDE',mark:'≈',color:'blue',cap:61800,change:6.4,volume:21400,reward:'ETH',paid:980,progress:91,holders:352,age:'2d',creator:'@lowtide',txs:1840},
 {id:'goodmorning',image:'/demo/goodmorning.svg',name:'good morning',symbol:'GM',mark:'☼',color:'orange',cap:214000,change:3.2,volume:64200,reward:'ETH',paid:4120,progress:100,holders:1204,age:'6d',creator:'@gmposter',txs:9120},
];
export const money=(n:number)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
export const compact=(n:number)=>'$'+new Intl.NumberFormat('en-US',{notation:'compact',maximumFractionDigits:1}).format(n);
export const rounds=[{id:'0048',coin:'ORBIT',asset:'ETH',amount:'0.0248',wallets:621,time:'12 min ago',state:'Delivered'},{id:'0047',coin:'EVER',asset:'USDG',amount:'84.20',wallets:418,time:'28 min ago',state:'Delivered'},{id:'0046',coin:'AFTER',asset:'ETH',amount:'0.0084',wallets:296,time:'46 min ago',state:'Delivered'},{id:'0045',coin:'SIGNAL',asset:'USDG',amount:'32.80',wallets:184,time:'1 hour ago',state:'Claimable'},{id:'0044',coin:'COMMON',asset:'ETH',amount:'0.0032',wallets:132,time:'2 hours ago',state:'Accruing'}];
export const sampleWallet='0x1111111111111111111111111111111111111111';
export const totalRewards=coins.reduce((s,c)=>s+c.paid,0);
