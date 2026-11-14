(function(){
'use strict';
const lines=[];let failed=0;
function assert(v,msg){if(!v)throw Error(msg);}
function test(name,fn){try{fn();lines.push('PASS '+name);}catch(e){failed++;lines.push('FAIL '+name+': '+e.message);}}
const g=new DP.Game(document.querySelector('canvas'),{room:0,unlockedWeapons:[0,1]}, {hit(){},hurt(){},jump(){},terminal(){}},()=>{});
function reset(room,kind){g.transitionTo(room,null,true);g.room.spawn.remaining=0;g.room.spawn.scheduled=null;g.room.platforms=[];g.room.solids=[];g.room.hazards=[];
 let e=g.room.enemies.find(e=>e.kind===kind);
 if(kind==='mortis'){g.room.enemies=[];g.activateMortisWhenWavesEnd();e=g.room.enemies.find(e=>e.kind===kind);}
 g.room.enemies=[e];e.hp=e.max=10000;e.x=2050;e.y=520-e.h;e.introduced=true;e.aggro=true;e.dir=-1;g.p.x=e.x-65;g.p.y=478;g.p.hp=100;g.p.invuln=0;return e;}
for(const [room,kind] of [[0,'mortis'],[1,'governor'],[2,'rootGuardian'],[3,'colossus'],[4,'matrix'],[5,'boss']]){
 test(kind+' preserves attack data on damage',()=>{const e=reset(room,kind);if(kind==='colossus')DP.Colossus.enter(e,'idle');e.state='attack';e.attack='test';e.attackPhase='windup';e.attackTimer=.5;g.damage(e,1);assert(e.state==='attack'&&e.attack==='test'&&e.attackPhase==='windup'&&e.attackTimer===.5,'attack cancelled');assert(e.flash>0&&e.hp===9999,'missing damage feedback');});
 test(kind+' releases attacks under continuous hits',()=>{const e=reset(room,kind);if(kind==='colossus')DP.Colossus.enter(e,'idle');let releases=0,hits=0;const damagePlayer=g.damagePlayer;g.damagePlayer=function(...args){releases++;return damagePlayer.apply(this,args);};try{for(let i=0;i<720;i++){g.p.x=e.x-(kind==='boss'?45:65);g.p.y=478;g.p.hp=100;g.p.invuln=0;if(i%3===0){g.damage(e,1);hits++;}g.updateEnemies(1/60);g.updateMortisHazards(1/60);if(g.projectiles.some(s=>s.owner==='enemy')){releases++;g.projectiles=[];}}}finally{g.damagePlayer=damagePlayer;}assert(hits===240&&e.hp===10000-hits,'damage stopped applying');assert(releases>=2,'did not retaliate, releases='+releases);});
}
test('ordinary enemies still stagger',()=>{reset(5,'boss');const e=DP.createEnemy('ash',5,1800,478,7);g.room.enemies.push(e);g.damage(e,1);assert(e.state==='hurt','normal enemy lost stagger');});
document.querySelector('#results').textContent=lines.join('\n')+'\nRESULT '+(failed?'FAIL':'PASS')+' '+(lines.length-failed)+' passed, '+failed+' failed';
})();
