(function(){
'use strict';
const M=DP.MatrixModel,P=DP.MatrixPhysics;
function begin(g,e,state){const m=M.ensure(e),a=M.abilities[state];if(!a||e.hp<=0)return false;M.enter(e,state);m.next=0;m.last=state;m.history.push(state);m.history=m.history.slice(-5);m.cooldowns[state]=a.cooldown*(m.phase===2?.78:1);m.aim={x:g.p.x+g.p.w/2,y:g.p.y+g.p.h/2};m.start={x:e.x+e.w/2,y:e.y+e.h/2};for(const t of m.tentacles)t.hit=false;if(state==='ULTIMATE')m.blast={x:m.start.x,y:m.start.y,radius:265,delay:a.prepare,timer:0,active:false,hit:false};return true;}
function roots(g,e){const m=M.ensure(e),count=m.phase===2?5:3,px=m.aim.x;for(let i=0;i<count;i++){const x=M.clamp(px+(i-Math.floor(count/2))*122,80,g.worldWidth-80);const platform=g.room.platforms.filter(q=>q.active!==false&&x>q.x&&x<q.x+q.w&&q.y>=g.p.y+g.p.h-8).sort((a,b)=>a.y-b.y)[0],y=platform?platform.y:520;m.roots.push({id:e.id+'-root-'+(++m.serial),x,y,w:26,h:105+(i%2)*16,timer:0,delay:.85+i*.14,life:2.4+i*.14,hit:false,active:false,structure:platform,offset:platform?x-platform.x:0});}}
function summon(g,e){const m=M.ensure(e),limit=m.phase===2?3:2,alive=g.room.enemies.filter(q=>q.kind==='matrixDrone'&&q.ownerId===e.id&&q.hp>0).length;for(let i=alive;i<limit;i++){const d=DP.createEnemy('matrixDrone',g.index,M.clamp(e.x+(i-1)*64,70,g.worldWidth-80),330-i%2*44,g.room.seed+(++m.serial));d.id=e.id+'-drone-'+m.serial;d.ownerId=e.id;d.tempLife=20;d.cooldown=1+i*.3;d.aggro=true;g.room.enemies.push(d);g.fxBurst(d.x,d.y,'#c853ed',8);}}
function update(g,e,dt){const m=M.ensure(e);m.timer+=dt;m.next=Math.max(0,m.next-dt);for(const k in m.cooldowns)m.cooldowns[k]=Math.max(0,m.cooldowns[k]-dt);m.target=0;const dx=g.p.x+g.p.w/2-(e.x+e.w/2),distance=Math.abs(dx),dir=Math.sign(dx)||e.dir,phase=e.hp<=e.max*.4?2:e.hp<=e.max*.7?1:0;
 if(phase>m.phase){m.phase=phase;e.phase=phase;m.phaseFlash=1.6;m.cooldowns.ULTIMATE=0;m.next=Math.min(m.next,.3);g.emit('toast','MATRIZ ORGÂNICA // '+['ORGANISMO HÍBRIDO','INTEGRAÇÃO','FUSÃO ABSOLUTA'][phase]);g.fxBurst(e.x+e.w/2,e.y+e.h/2,'#e639b8',24);}m.phaseFlash=Math.max(0,(m.phaseFlash||0)-dt);
 if(!e.introduced){if(distance>720){M.enter(e,'IDLE');return;}e.introduced=true;e.aggro=true;m.next=1;g.emit('toast','MATRIZ ORGÂNICA // ORGANISMO TECNOLÓGICO');}
 const a=M.abilities[m.state];if(a){
  if(m.state==='SHOT'){const count=m.phase===2?4:3;for(let i=0;i<count;i++)if(m.timer>=a.prepare+i*.17&&m.shots<=i){const cx=e.x+e.w/2,cy=e.y+e.h*.55,angle=Math.atan2(m.aim.y-cy,m.aim.x-cx)+(i-(count-1)/2)*.26;P.shoot(g,e,angle);m.shots=i+1;}}
  else if(!m.fired&&m.timer>=a.prepare){m.fired=true;if(m.state==='SUMMON')summon(g,e);if(m.state==='ROOT')roots(g,e);}
  if(m.timer>=a.duration){m.next=m.phase===2?.35:.7;m.settle=m.state==='ULTIMATE'?.65:.18;M.enter(e,'FLOAT');}return;
 }
 if(m.state==='HIT'){if(m.timer>=.3)M.enter(e,'FLOAT');return;}
 if(m.settle>0)return;
 // Facing follows a dead zone, preventing eye/cable jitter at the player's x.
 if(distance>45)e.dir=dir;
 let choice=null;const c=m.cooldowns,last=m.last;
 if(m.next<=0){if(m.phase===2&&c.ULTIMATE<=0&&distance<430&&last!=='ULTIMATE')choice='ULTIMATE';else if(m.phase>=1&&c.SUMMON<=0&&distance<620&&last!=='SUMMON'&&g.room.enemies.filter(q=>q.kind==='matrixDrone'&&q.ownerId===e.id&&q.hp>0).length<(m.phase===2?3:2))choice='SUMMON';else if(m.phase>=1&&c.ROOT<=0&&distance<650&&last!=='ROOT')choice='ROOT';else if(distance<235&&c.TENTACLE<=0&&last!=='TENTACLE')choice='TENTACLE';else if(distance<620&&c.SHOT<=0&&last!=='SHOT')choice='SHOT';}
 if(choice){if(Math.abs(m.velocity)<26){begin(g,e,choice);return;}M.enter(e,'FLOAT');return;}
 const moving=m.state==='MOVE';if(distance>(moving?195:235)){m.target=dir*(m.phase===2?74:55);M.enter(e,'MOVE');}else if(distance<125&&m.next>0){m.target=-dir*30;M.enter(e,'MOVE');}else M.enter(e,'FLOAT');
}
DP.MatrixAI={update,begin,roots,summon};
})();
