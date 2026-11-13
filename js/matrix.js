(function(){
'use strict';
const M=DP.MatrixModel,P=DP.MatrixPhysics,A=DP.MatrixAI,R=DP.MatrixRender,proto=DP.Game.prototype;
proto.updateMatrix=function(e,dt){dt=M.clamp(Number.isFinite(dt)?dt:0,0,.05);A.update(this,e,dt);M.animate(e,dt);P.move(this,e,dt);P.limbs(this,e,dt);};
proto.updateMatrixDrone=function(e,dt){P.drone(this,e,dt);};
const oldHazards=proto.updateMortisHazards;proto.updateMortisHazards=function(dt){oldHazards.call(this,dt);P.hazards(this,dt);};
const oldProjectiles=proto.updateProjectiles;proto.updateProjectiles=function(dt){P.projectileFloor(this,dt);oldProjectiles.call(this,dt);};
const oldDamage=proto.damage;proto.damage=function(e,n,pulse=false){const result=oldDamage.call(this,e,n,pulse);if(result&&e.kind==='matrixDrone'&&e.hp<=0)e.deathAnim=.5;if(!result||e.kind!=='matrix')return result;const m=M.ensure(e);m.hit=.2;if(e.hp<=0){M.enter(e,'DEATH');e.deathAnim=1.8;e.vx=0;m.velocity=0;m.target=0;m.roots=[];m.nodes=[];m.links=[];m.blast=null;for(const t of m.tentacles)t.active=false;for(const d of this.room.enemies)if(d.ownerId===e.id){d.hp=0;d.deathAnim=.5;d.state='dead';}this.projectiles=this.projectiles.filter(s=>s.ownerId!==e.id);this.emit('toast','MATRIZ ORGÂNICA DESFEITA // FUSÃO INTERROMPIDA');}else if(!M.abilities[m.state]&&m.stagger<=0){M.enter(e,'HIT');m.stagger=1;}return result;};
const oldDrawEnemy=DP.Art.drawEnemy;DP.Art.drawEnemy=function(c,e,index,x,t){if(e.kind==='matrix'){R.body(c,e,x);return;}if(e.kind==='matrixDrone'){const clock=e.matrixClock||0,frame=e.hp>0?Math.floor(clock*12)%8:M.clamp(Math.floor((.5-e.deathAnim)*16),0,7);M.sprite(c,e.hp>0?'drone':'burst',frame,x+e.w/2,e.y+e.h/2,e.hp>0?39:48,e.hp>0?39:48,Math.sin(clock*2)*.09,e.hp>0?1:Math.min(1,e.deathAnim/.5));return;}return oldDrawEnemy(c,e,index,x,t);};
const oldHitbox=DP.Art.hitbox;DP.Art.hitbox=function(e,index){if(e.kind==='matrix')return{x:e.x+22,y:e.y+8,w:e.w-44,h:e.h-10};return oldHitbox(e,index);};
const oldDraw=proto.draw;proto.draw=function(){oldDraw.call(this);R.hazards(this.x,this);};
const oldHud=proto.updateHud;proto.updateHud=function(){oldHud.call(this);const hud=document.querySelector('#bossHud');if(!hud)return;const e=this.room.enemies.find(q=>q.kind==='matrix'&&q.hp>0&&q.introduced);hud.classList.toggle('matrix',!!e);if(e){const m=M.ensure(e);document.querySelector('#bossName').textContent='MATRIZ ORGÂNICA';hud.dataset.subtitle='ORGANISMO TECNOLÓGICO';hud.dataset.phase='FASE '+(m.phase+1)+' // '+['ORGANISMO HÍBRIDO','INTEGRAÇÃO','FUSÃO ABSOLUTA'][m.phase];hud.classList.toggle('matrix-hit',m.hit>0);}else hud.classList.remove('matrix-hit');};
DP.Matrix={model:M,physics:P,ai:A,render:R};
})();
