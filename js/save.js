(function(){
window.DP=window.DP||{};const KEY='deadProtocolSave_v1';
const blank=()=>({chapter:1,room:0,xp:0,level:1,cells:0,upgrades:0,logs:[],cleared:[],choices:{},checkpoint:null,unlockedWeapons:[0,1],equippedWeapon:0,challenge:0,runs:0,settings:{volume:0.35}});
function load(){try{return {...blank(),...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return blank()}}
function persist(data){try{localStorage.setItem(KEY,JSON.stringify(data))}catch{}}
function fresh(){let d=blank();d.runs=load().runs;persist(d);return d}

Object.assign(DP,{load,persist,fresh});


})();

