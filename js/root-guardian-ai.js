(function(){
'use strict';
const M=DP.RootGuardianModel,P=DP.RootGuardianPhysics;
function begin(g,e,state){const m=M.ensure(e),a=M.abilities[state];if(!a||e.hp<=0||!m.grounded)return false;M.enter(e,state);m.fired=false;m.shots=0;m.slammed=false;m.next=0;m.last=state;m.history=m.history.concat(state).slice(-5);m.cooldowns[state]=a.cooldown*(m.phase===2?.78:1);m.aim={x:g.p.x+g.p.w/2,y:g.p.y+g.p.h/2};m.tongue.hit=false;m.jumpTarget=M.clamp(g.p.x+g.p.w/2-e.w/2,1600,g.worldWidth-e.w-40);if(state==='ULTIMATE')m.jumpTarget=e.x+M.clamp(m.jumpTarget-e.x,-270*1140/980,270*1140/980);return true;}
function summon(g,e){const m=M.ensure(e),limit=m.phase===2?3:2,existing=g.room.enemies.filter(q=>q.kind==='rootMushroom'&&q.ownerId===e.id&&q.hp>0).length,center=m.aim?.x??g.p.x+g.p.w/2;for(let i=existing;i<limit;i++){let x=M.clamp(center+(i-(limit-1)/2)*135,1650,g.worldWidth-85);if(Math.abs(x-g.p.x)<65)x=M.clamp(x+90,1650,g.worldWidth-85);const d=DP.createEnemy('rootMushroom',g.index,x,520-DP.enemySpecs.rootMushroom.size[1],g.room.seed+(++m.serial));d.id=e.id+'-colony-'+m.serial;d.ownerId=e.id;d.tempLife=14;d.growth=0;d.cooldown=2.8;g.room.enemies.push(d);}}
function update(g,e,dt){const m=M.ensure(e);m.timer+=dt;m.next=Math.max(0,m.next-dt);for(const k in m.cooldowns)m.cooldowns[k]=Math.max(0,m.cooldowns[k]-dt);const dx=g.p.x+g.p.w/2-e.x-e.w/2,distance=Math.abs(dx),dir=Math.sign(dx)||e.dir,phase=e.hp<=e.max*.35?2:e.hp<=e.max*.7?1:0;
 if(phase>m.phase){m.phase=e.phase=phase;m.phaseFlash=1.5;m.cooldowns.ULTIMATE=0;m.next=Math.min(m.next,.25);g.emit('toast','GUARDIÃO DAS RAÍZES // '+['DESPERTAR','COLONIZAÇÃO','ECOSSISTEMA FINAL'][phase]);g.fxBurst(e.x+e.w/2,e.y+45,'#b8e96a',22);}
 if(!e.introduced){if(distance>700){M.enter(e,'IDLE');return;}e.introduced=true;e.aggro=true;m.next=.9;g.emit('toast','GUARDIÃO DAS RAÍZES // O ÚLTIMO ECOSSISTEMA');}
 if(['MOVE','JUMP'].includes(m.state))return;
 if(m.state==='LAND'){if(m.landTimer>=.48){m.next=Math.max(m.next,.15);M.enter(e,'FLOAT');}return;}
 if(!m.grounded&&!M.abilities[m.state]){M.clip(e,'jump');return;}
 const a=M.abilities[m.state];if(a){
  if(m.state==='SPORE_ATTACK'&&m.timer>=a.prepare&&!m.fired){m.fired=true;P.spores(g,e,'root-spore',m.phase===2?11:m.phase===1?9:7);g.fxBurst(e.x+e.w/2,e.y+10,'#b9e47a',12);}
  if(!m.fired&&m.timer>=a.prepare){m.fired=true;if(m.state==='ROOT_ATTACK')P.spreadRoots(g,e);if(m.state==='MUSHROOM_SUMMON')summon(g,e);}
  if(m.state==='ULTIMATE'){if(m.slammed&&m.landTimer>=1&&m.timer>=3.1){m.next=.65;M.enter(e,'FLOAT');}return;}
  if(m.timer>=a.duration){m.next=m.phase===2?.35:.7;M.enter(e,'FLOAT');}return;
 }
 if(m.state==='HIT'){if(m.timer>=.28)M.enter(e,'FLOAT');return;}
 if(m.settle>0)return;
 if(distance>650&&(e.x<=1601&&dir<0||e.x>=g.worldWidth-e.w-41&&dir>0)){M.enter(e,'IDLE');return;}
 if(distance>50&&dir!==e.dir&&m.turnLock<=0){e.dir=dir;m.turnLock=.4;m.settle=.16;return;}
 let choice=null;const c=m.cooldowns,last=m.last;if(m.next<=0){if(m.phase===2&&distance<520&&c.ULTIMATE<=0&&last!=='ULTIMATE')choice='ULTIMATE';else if(m.phase>=1&&distance<630&&c.MUSHROOM_SUMMON<=0&&last!=='MUSHROOM_SUMMON'&&g.room.enemies.filter(q=>q.kind==='rootMushroom'&&q.ownerId===e.id&&q.hp>0).length<(m.phase===2?3:2))choice='MUSHROOM_SUMMON';else if(m.phase>=1&&distance<650&&c.ROOT_ATTACK<=0&&last!=='ROOT_ATTACK')choice='ROOT_ATTACK';else if(distance<290&&c.TONGUE_ATTACK<=0&&last!=='TONGUE_ATTACK')choice='TONGUE_ATTACK';else if(distance<600&&c.SPORE_ATTACK<=0&&last!=='SPORE_ATTACK')choice='SPORE_ATTACK';}
 if(choice){begin(g,e,choice);return;}
 if(c.JUMP<=0&&(distance>325||g.p.y+g.p.h<e.y+15)&&distance<850){m.jumpTarget=M.clamp(g.p.x-e.w/2,1600,g.worldWidth-e.w-40);m.cooldowns.JUMP=4.5;M.enter(e,'JUMP');return;}
 if(distance>260||distance<110&&m.next>0){m.hopDirection=distance>260?dir:-dir;M.enter(e,'MOVE');return;}M.enter(e,'FLOAT');
}
DP.RootGuardianAI={update,begin,summon};
})();
