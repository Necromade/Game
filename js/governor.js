(function(){
'use strict';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const counts={idle:8,walk:8,run:8,turn:4,jump:6,fall:4,land:4,attack:8,cannon:8,shield:8,summon_drones:8,ultimate:16,hit:4,death:12};
const sheets={};
for(const name of [...Object.keys(counts),'drone','projectile','cannon_part','shield_fx','beam','explosion','particle','core','charge']){const im=new Image();im.src='assets/sprites/governor/'+name+'.png?v=3';sheets[name]=im;}
function sprite(c,name,frame,x,y,w,h,face=1){const im=sheets[name],effect=!(name in counts),sw=effect?128:160,sh=effect?192:160;if(!im?.complete||!im.naturalWidth)return false;c.save();c.imageSmoothingEnabled=false;c.translate(x+w/2,y+h/2);c.scale(face,1);c.drawImage(im,Math.floor(frame)*(sw),0,sw,sh,-w/2,-h/2,w,h);c.restore();return true;}
const Motion=DP.GovernorMotion;

function animation(e,name,duration=0){Motion.changeAnimation(e,name,duration);}
function enter(e,state,duration=0){if(e.governorState===state&&e.govAnim)return;e.governorState=state;e.govTimer=0;e.govDuration=duration;e.govFired=false;e.state=state.toLowerCase();animation(e,{IDLE:'idle',PATROL:'walk',CHASE:'run',ATTACK:'attack',CANNON:'cannon',SHIELD:'shield',SUMMON:'summon_drones',ULTIMATE:'ultimate',HIT:'hit',DEATH:'death',ORDER:'cannon',TURN:'turn',JUMP_PREP:'land',JUMP:'jump',FALL:'fall',LAND:'land'}[state]||'idle',duration);}
function shoot(g,e,x,y,targetX,targetY,speed,damage,kind='governor'){const angle=Math.atan2(targetY-y,targetX-x);g.projectiles.push({owner:'enemy',kind,x,y,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:3,damage,radius:kind==='governorDrone'?4:6,color:'#ff344c'});}
const proto=DP.Game.prototype;
proto.beginGovernorAttack=function(e,state){
 const durations=Object.fromEntries(Object.entries(Motion.attacks).map(([k,v])=>[k,v.duration]));
 const cd={CANNON:['cannon',e.phase===2?2.1:3.1],SHIELD:['shield',11],SUMMON:['summon',12],ORDER:['order',e.phase===2?5.5:7.5],ULTIMATE:['ultimate',15]};
 enter(e,state,durations[state]);e.govLast=state;e.govHistory=(e.govHistory||[]).concat(state).slice(-3);e.govAim={x:this.p.x+this.p.w/2,y:this.p.y+this.p.h/2};
 if(cd[state])e.governorCooldowns[cd[state][0]]=cd[state][1];
 if(state==='ORDER'){e.govPendingMarks=this.p.x+this.p.w/2;e.govMarks=[];}
 if(state==='ULTIMATE'){e.govBlast={x:e.x+e.w/2,y:e.y+e.h/2,radius:245,delay:2.15,life:.5,hit:false};this.emit('toast','PROTOCOLO DE SUPREMACIA // AFASTE-SE DO NÚCLEO');}
};
function decideGovernor(e,dt){
 const motion=Motion.ensure(e);
 const p=this.p,dx=p.x+p.w/2-e.x-e.w/2,distance=Math.abs(dx),face=Math.sign(dx)||e.dir;
 e.govAnimTime=(e.govAnimTime||0)+dt;e.govTimer=(e.govTimer||0)+dt;e.govHit=Math.max(0,(e.govHit||0)-dt);e.govTransition=Math.max(0,(e.govTransition||0)-dt);
 e.govShield=Math.max(0,(e.govShield||0)-dt);e.shielded=e.govShield>0;
 for(const k in e.governorCooldowns)e.governorCooldowns[k]=Math.max(0,e.governorCooldowns[k]-dt);
 const phase=e.hp<=e.max*.4?2:e.hp<=e.max*.7?1:0;
 if(phase>e.phase){e.phase=phase;e.govTransition=1.4;e.govNext=0;e.governorCooldowns.ultimate=0;this.fxBurst(e.x+e.w/2,e.y+35,'#ff344c',28);this.emit('toast','REGENTE DE FERRO // FASE '+(phase+1));}
 if(!e.introduced){if(distance>640){if((e.x<1980&&e.dir<0)||(e.x>2200&&e.dir>0)){if(Motion.turn(e,-e.dir))enter(e,'TURN',.34);}if(e.governorState==='TURN'){if(e.govTimer>=.34){motion.turnLock=.45;enter(e,'PATROL');}return;}enterMove(e,'PATROL','walk');motion.target=e.dir*24;return;}e.introduced=true;e.aggro=true;e.govNext=.7;enter(e,'IDLE');this.emit('toast','GOVERNADOR MECÂNICO // O REGENTE DE FERRO');}
 if(!e.govAnim)enter(e,'IDLE');
 if(['JUMP_PREP','JUMP','FALL'].includes(e.governorState)){if(e.governorState!=='JUMP_PREP')motion.target=e.dir*75;Motion.air(this,e,dt,enter);return;}
 if(['TURN','LAND','HIT'].includes(e.governorState)){if(e.govTimer>=e.govDuration){if(e.governorState==='TURN'){e.dir=motion.turnTo??e.dir;motion.turnLock=.4;}enter(e,'IDLE');}return;}
 const active=['ATTACK','CANNON','SHIELD','SUMMON','ORDER','ULTIMATE'].includes(e.governorState);
 if(active){
  const state=e.governorState;
  if(state==='ORDER'&&e.govPendingMarks!==undefined&&e.govTimer>=Motion.attacks.ORDER.prepare){const px=e.govPendingMarks;e.govMarks=Array.from({length:e.phase===2?4:3},(_,n)=>({x:clamp(px+(n-1)*136,70,this.worldWidth-70),width:54,delay:1.05+n*.18,life:.34,hit:false}));delete e.govPendingMarks;}
  if(state==='CANNON'){
   const count=e.phase===2?5:3,interval=.12,first=.7;
   for(let n=0;n<count;n++){if(e.govTimer>=first+n*interval&&(e.govShots||0)<=n){const x=e.x+e.w/2+e.dir*33,y=e.y+35,spread=(n-(count-1)/2)*16;shoot(this,e,x,y,e.govAim.x,e.govAim.y+spread,300+e.phase*35,14);e.govShots=n+1;motion.recoil=1;motion.velocity-=e.dir*9;this.fxBurst(x,y,'#ff344c',5);}}
  }else if(!e.govFired&&e.govTimer>=(state==='ULTIMATE'?2.15:state==='ORDER'?1.05:.58)){
   e.govFired=true;
   if(state==='SHIELD'){e.govShield=4.5;e.shielded=true;}
   if(state==='SUMMON'){
    const existing=this.room.enemies.filter(a=>a.kind==='governorDrone'&&a.hp>0).length,limit=e.phase===2?3:2;
    for(let n=existing;n<limit;n++){const d=DP.createEnemy('governorDrone',this.index,clamp(e.x+(n-1)*75,50,this.worldWidth-60),295-n%2*42,(e.govSerial=(e.govSerial||0)+1)+this.room.seed);d.id=e.id+'-drone-'+e.govSerial;d.ownerId=e.id;d.aggro=true;d.cooldown=.8+n*.3;d.tempLife=22;this.room.enemies.push(d);}
   }
   if(state==='ATTACK'&&distance<132&&p.y+p.h>e.y+22&&p.y<e.y+e.h)this.damagePlayer(19+e.phase*2,'governor');
   if(state==='ULTIMATE'){this.shake=16;this.fxBurst(e.x+e.w/2,e.y+45,'#ff334c',48);}
  }
  if(e.govTimer>=e.govDuration){e.govShots=0;e.govNext=e.phase===2?.28:.65;motion.pause=state==='ULTIMATE'?.55:state==='CANNON'?.18:.1;enter(e,'IDLE');}
  return;
 }
 e.govNext=Math.max(0,(e.govNext||0)-dt);
 if(face!==e.dir&&distance>55){if(Motion.turn(e,face))enter(e,'TURN',.34);return;}
 if(motion.pause>0)return;
 if(e.govNext<=0){
  const c=e.governorCooldowns,last=e.govLast;let attack=null;
  if(e.phase===2&&c.ultimate<=0&&distance<480&&last!=='ULTIMATE')attack='ULTIMATE';
  else if(e.phase>=1&&distance<600&&c.summon<=0&&last!=='SUMMON'&&this.room.enemies.filter(a=>a.kind==='governorDrone'&&a.hp>0).length<(e.phase===2?3:2))attack='SUMMON';
  else if(e.phase>=1&&distance<420&&c.shield<=0&&last!=='SHIELD'&&e.govShield<=0)attack='SHIELD';
  else if(e.phase>=1&&distance<680&&c.order<=0&&last!=='ORDER')attack='ORDER';
  else if(distance<126&&last!=='ATTACK')attack='ATTACK';
  else if(distance<680&&c.cannon<=0)attack='CANNON';
  if(attack&&Math.abs(motion.velocity)<30){e.govShots=0;this.beginGovernorAttack(e,attack);return;}
  if(attack){enterMove(e,'IDLE','idle');return;}
 }
 if(p.y+p.h<e.y+15&&distance<230&&e.govJumpCooldown<=0){e.govJumpCooldown=5;enter(e,'JUMP_PREP',.2);return;}
 e.govJumpCooldown=Math.max(0,(e.govJumpCooldown??2)-dt);
 const approach=e.govLast==='CANNON'?112:210;
 const moving=e.governorState==='CHASE';
 if(distance>approach+(moving?-14:18)){enterMove(e,'CHASE',e.phase===0?'walk':'run');motion.target=e.dir*(e.moveSpeed||78)*(1+e.phase*.25)*clamp((distance-75)/120,.25,1);}
 else if(distance<92&&e.govNext>0){enterMove(e,'PATROL','walk');motion.target=-e.dir*35;}
 else enterMove(e,'IDLE','idle');
 e.x=clamp(e.x,1700,this.worldWidth-e.w-35);
}
proto.updateGovernor=function(e,dt){const motion=Motion.ensure(e);motion.target=0;decideGovernor.call(this,e,dt);Motion.update(this,e,dt);
 if(!motion.air&&!['JUMP_PREP','JUMP','FALL','DEATH'].includes(e.governorState)&&e.y+e.h<519){const supported=[...(this.room.solids||[]),...(this.room.platforms||[])].some(q=>q.active!==false&&e.x+e.w>q.x&&e.x<q.x+q.w&&Math.abs(e.y+e.h-q.y)<2);if(!supported){e.vy=0;motion.air=true;enter(e,'FALL');}}
 if(['IDLE','PATROL','CHASE'].includes(e.governorState)&&Math.abs(motion.velocity)>5){const running=e.govAnim==='run'?Math.abs(motion.velocity)>77:Math.abs(motion.velocity)>92;animation(e,running?'run':'walk');}else if(e.governorState==='IDLE'&&Math.abs(motion.velocity)<=5)animation(e,'idle');};
function enterMove(e,state){if(e.governorState!==state){e.governorState=state;e.govTimer=0;e.state=state.toLowerCase();}}
proto.updateGovernorDrone=function(e,dt){const p=this.p;e.tempLife-=dt;e.dir=p.x<e.x?-1:1;e.state='chase';const targetX=p.x+Math.sin(this.time*1.6+e.baseY)*95, targetY=clamp(p.y-95+Math.sin(this.time*3+e.baseY)*30,130,415);e.x=clamp(e.x+clamp(targetX-e.x,-e.moveSpeed,e.moveSpeed)*dt,40,this.worldWidth-40);e.y+=clamp(targetY-e.y,-80,80)*dt;if(e.tempLife<=0){e.hp=0;e.deathAnim=.4;return;}if(e.cooldown<=0&&Math.abs(p.x-e.x)<560){shoot(this,e,e.x+e.w/2,e.y+e.h/2,p.x+p.w/2,p.y+p.h/2,220,9,'governorDrone');e.cooldown=2.3;e.state='attack';}};
const oldHazards=proto.updateMortisHazards;
proto.updateMortisHazards=function(dt){oldHazards.call(this,dt);const p=this.p;for(const e of this.room.enemies){if(e.kind!=='governor'||e.hp<=0)continue;for(const m of e.govMarks||[]){m.delay-=dt;if(m.delay<=0){m.life-=dt;if(!m.hit&&Math.abs(p.x+p.w/2-m.x)<m.width/2+p.w/2){m.hit=true;this.damagePlayer(20,'governor');this.fxBurst(m.x,505,'#ff344c',14);}}}e.govMarks=(e.govMarks||[]).filter(m=>m.delay>0||m.life>0);const a=e.govBlast;if(a){a.delay-=dt;if(a.delay<=0){a.life-=dt;const cx=clamp(a.x,p.x,p.x+p.w),cy=clamp(a.y,p.y,p.y+p.h);if(!a.hit&&Math.hypot(cx-a.x,cy-a.y)<a.radius){a.hit=true;this.damagePlayer(31,'governor');}}if(a.life<=0)e.govBlast=null;}}};
const oldDamage=proto.damage;
proto.damage=function(e,n,pulse=false){const result=oldDamage.call(this,e,n,pulse);if(!result||e.kind!=='governor')return result;e.govHit=.22;if(e.hp<=0){const m=Motion.ensure(e);m.velocity=0;m.target=0;m.air=false;e.vx=0;delete e.govPendingMarks;enter(e,'DEATH',1.5);e.deathAnim=1.5;e.shielded=false;e.govShield=0;e.govMarks=[];e.govBlast=null;for(const d of this.room.enemies)if(d.ownerId===e.id){d.hp=0;d.deathAnim=.4;d.state='dead';}this.projectiles=this.projectiles.filter(s=>!['governor','governorDrone'].includes(s.kind));this.emit('toast','O REGENTE DE FERRO CAIU // AUTORIDADE REVOGADA');}else if(['IDLE','PATROL','CHASE'].includes(e.governorState))enter(e,'HIT',.25);return result;};
const oldDrawEnemy=DP.Art.drawEnemy,oldHitbox=DP.Art.hitbox;
DP.Art.hitbox=function(e,index){if(e.kind==='governor')return{x:e.x+20,y:e.y+5,w:e.w-40,h:e.h-5};return oldHitbox(e,index);};
DP.Art.drawEnemy=function(c,e,index,x,t){if(e.kind!=='governor'&&e.kind!=='governorDrone')return oldDrawEnemy(c,e,index,x,t);
 if(e.kind==='governorDrone'){if(e.hp<=0){sprite(c,'explosion',Math.min(7,Math.floor((.4-e.deathAnim)*20)),x-10,e.y-10,45,45);return;}sprite(c,'drone',Math.floor(e.anim*12)%8,x-5,e.y-4,e.w+10,e.h+8,e.dir);return;}
 const name=e.hp<=0?'death':e.govAnim||'idle',frame=Motion.frame(e,name,counts[name]);e.govRenderedFrame=frame;
 c.save();if(e.govHit>0){c.shadowColor='#ff8994';c.shadowBlur=8;}Motion.draw(c,sheets[name],frame,x,e.y,e,(local,m)=>{
  if(e.hp<=0)return;
  const pulse=.55+.25*Math.sin(m.clock*(e.phase===2?8:2.8)),open=m.plates;
  if(open>.025){local.fillStyle='#14171e';local.strokeStyle='#ad8050';local.lineWidth=.8;for(const side of [-1,1]){local.save();local.translate(83+side*(5+open*7),66);local.rotate(side*open*.35);local.fillRect(-3,-9,6,17);local.strokeRect(-3,-9,6,17);local.restore();}}
  local.save();local.globalAlpha=(e.phase===2?.6:.22)+pulse*.2+m.core*.2;sprite(local,'core',Math.floor(m.clock*10)%8,76,55,16+open*5,23+open*4);local.restore();
  if(e.governorState==='CANNON'&&e.govTimer<.7){const power=Motion.ease(e.govTimer/.7);sprite(local,'charge',Math.floor(m.clock*15)%8,116-power*6,59+m.arm*.6-power*5,14+power*12,20+power*12);}
 });c.restore();
 if(e.shielded){sprite(c,'shield_fx',Math.floor(t*12)%8,x-12,e.y-12,e.w+24,e.h+24);c.fillStyle='#ffbc71';c.fillRect(x,e.y-8,e.w*e.govShield/4.5,3);}
};
const oldDraw=proto.draw;
proto.draw=function(){oldDraw.call(this);const c=this.x,cam=this.camera;for(const e of this.room.enemies){if(e.kind!=='governor'||e.hp<=0)continue;if(e.phase===2&&e.introduced){c.fillStyle='rgba(175,12,30,.075)';c.fillRect(0,0,this.w,this.h);}
 for(const m of e.govMarks||[]){if(m.delay>0){c.fillStyle='rgba(255,40,65,'+(.18+.12*Math.sin(this.time*20))+')';c.fillRect(m.x-cam-m.width/2,110,m.width,410);c.strokeStyle='#ff5b6d';c.strokeRect(m.x-cam-m.width/2,506,m.width,10);c.fillStyle='#ffb2a8';c.font='10px monospace';c.fillText('!',m.x-cam-3,495);}else sprite(c,'beam',Math.floor(this.time*18)%8,m.x-cam-40,0,80,540);}
 const a=e.govBlast;if(a){c.save();c.strokeStyle='#ff435b';c.fillStyle=a.delay>0?'rgba(230,20,50,.12)':'rgba(255,35,60,.48)';c.lineWidth=3;c.beginPath();c.arc(a.x-cam,a.y,a.radius,0,Math.PI*2);c.fill();c.stroke();if(a.delay>0){c.beginPath();c.arc(a.x-cam,a.y,22+(1-a.delay/2.15)*80,0,Math.PI*2);c.stroke();sprite(c,'charge',Math.floor(this.time*16)%8,a.x-cam-30,a.y-40,60,80);}else sprite(c,'explosion',Math.floor(this.time*16)%8,a.x-cam-a.radius,a.y-a.radius,a.radius*2,a.radius*2);c.restore();}
 if(e.govTransition>0){c.fillStyle='rgba(14,7,12,.86)';c.fillRect(290,132,380,46);c.font='bold 15px monospace';c.fillStyle='#ff8c91';c.textAlign='center';c.fillText('REGENTE DE FERRO // FASE '+(e.phase+1),480,160);c.textAlign='start';}
 }for(const s of this.projectiles)if(s.kind==='governor'||s.kind==='governorDrone')sprite(c,'projectile',Math.floor(this.time*16)%8,s.x-cam-13,s.y-9,26,18,s.vx<0?-1:1);
};
const oldHud=proto.updateHud;
proto.updateHud=function(){oldHud.call(this);const hud=document.querySelector('#bossHud');if(!hud)return;const e=this.room.enemies.find(e=>e.kind==='governor'&&e.hp>0&&e.introduced);hud.classList.toggle('governor',!!e);if(e){document.querySelector('#bossName').textContent='GOVERNADOR MECÂNICO';hud.dataset.phase='FASE '+(e.phase+1);hud.dataset.subtitle='O REGENTE DE FERRO';hud.classList.toggle('gov-hit',e.govHit>0);hud.classList.toggle('gov-transition',e.govTransition>0);}else{hud.classList.remove('gov-hit','gov-transition');hud.dataset.subtitle='';}};
DP.Governor={counts,sheets,sprite,enter};
const oldParticles=DP.Art.drawParticles;
DP.Art.drawParticles=function(c,fx,cam){oldParticles(c,fx.filter(f=>!['#ff344c','#ff334c'].includes(f.color)),cam);for(const f of fx){if(!['#ff344c','#ff334c'].includes(f.color))continue;c.save();c.globalAlpha=Math.min(1,f.life*4);sprite(c,'particle',Math.floor((.5-f.life)*16+8)%8,f.x-cam-5,f.y-5,10,10);c.restore();}};
})();
