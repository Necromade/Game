(function(){
'use strict';
const M=DP.EdenModel,{clamp,arena,ensure,enter,core,abilities}=M;
const overlaps=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
function clear(g,e){const m=ensure(e);m.zones=[];g.projectiles=g.projectiles.filter(s=>s.ownerId!==e.id);}
function zone(e,data){const m=ensure(e);if(m.zones.length>=36)return;m.zones.push({age:0,delay:0,life:.5,damage:20,hit:false,...data});}
function column(e,x,delay,life=.5,w=52){zone(e,{type:'box',x:clamp(x,arena.left+w/2,arena.right-w/2)-w/2,y:140,w,h:380,delay,life});}
function begin(g,e,key){const m=ensure(e),a=abilities[key];if(!a||e.hp<=0||m.state==='DEATH'||['DORMANT','INTRO','TRANSFORM','TELEPORT'].includes(m.state))return false;
 enter(e,key);m.clip='attack_preparation';m.history.push(key);m.history=m.history.slice(-32);m.cooldowns[key]=a.cooldown;m.last=key;m.serial++;m.aim={x:clamp(g.p.x+g.p.w/2+(key.includes('PREDICTION')||key==='ADVANCED'?clamp(g.p.vx,-330,330)*.45:0),arena.left+40,arena.right-40),y:g.p.y+g.p.h/2};m.origin=core(e);const p=a.prepare,aim=m.aim,c=m.origin;g.emit('toast',a.label);
 if(key==='ABSOLUTE'||key==='PREDICTION')column(e,aim.x,p,a.execute,key==='ABSOLUTE'?66:54);
 if(key==='RAIN')for(let n=0;n<5+m.phase;n++)column(e,arena.left+65+n*125,p+n*.12,.35,32);
 if(key==='WAVE'||key==='PULSE')for(let n=0;n<(key==='PULSE'?3:1);n++)for(const d of [-1,1])zone(e,{type:'box',x:c.x,y:494,w:45,h:26,vx:d*(key==='PULSE'?310:240),delay:p+n*.5,life:1.8,damage:18});
 if(key==='BLADES'||key==='CLAW')for(let n=0;n<(key==='CLAW'?3:2);n++)zone(e,{type:'circle',x:key==='CLAW'?clamp(aim.x+(n-1)*100,arena.left+40,arena.right-40):c.x+(n?135:-135),y:key==='CLAW'?478:410,r:key==='CLAW'?48:65,delay:p+n*.18,life:.65,vx:key==='BLADES'?(aim.x-c.x)*.4:0,damage:22});
 if(key==='CORE')zone(e,{type:'circle',x:c.x,y:c.y+80,r:235,delay:p,life:.65,damage:27});
 if(key==='COLLAPSE'){const safe=clamp(aim.x+140,arena.left+100,arena.right-100);m.safe=safe;for(let x=arena.left+55;x<arena.right;x+=110)if(Math.abs(x-safe)>100)column(e,x,p,1,90);}
 if(key==='ADVANCED')for(let n=0;n<3;n++)column(e,aim.x+(n-1)*105,p+n*.38,.42,65);
 if(key==='TOTAL'||key==='ANNIHILATION')zone(e,{type:'ring',x:c.x,y:440,r:0,speed:600,thickness:24,delay:p+(key==='ANNIHILATION'?1.5:0),life:1.4,damage:30});
 if(key==='JUDGMENT'||key==='ANNIHILATION')for(let n=0;n<3;n++)for(let j=0;j<4;j++)column(e,arena.left+75+j*220+(n%2)*90,p+n*.75,.4,48);
 if(key==='SINGULARITY')zone(e,{type:'singularity',x:aim.x,y:425,r:82,delay:p,life:3,damage:26});
 return true;
}
function shoot(g,e,count,speed=235){const m=ensure(e),c=core(e),angle=Math.atan2(m.aim.y-c.y,m.aim.x-c.x);for(let n=0;n<count;n++){const a=angle+(n-(count-1)/2)*.17;g.projectiles.push({owner:'enemy',ownerId:e.id,kind:'eden',x:c.x,y:c.y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,radius:6,life:3,damage:16,color:'#ff4fc9'});}}
function zones(g,e,dt){const m=ensure(e);for(const z of m.zones){const old=z.age;z.age+=dt;if(z.age<z.delay)continue;const step=Math.max(0,z.age-z.delay)-Math.max(0,old-z.delay);const oldX=z.x;z.x+=(z.vx||0)*step;if(z.speed)z.r+=z.speed*step;if(z.age>z.delay+z.life)continue;
 const p=g.p;let hit=false;if(z.type==='box')hit=overlaps({x:Math.min(oldX,z.x),y:z.y,w:z.w+Math.abs(oldX-z.x),h:z.h},p);else{const near=Math.hypot(clamp(z.x,p.x,p.x+p.w)-z.x,clamp(z.y,p.y,p.y+p.h)-z.y),far=Math.hypot(Math.max(Math.abs(p.x-z.x),Math.abs(p.x+p.w-z.x)),Math.max(Math.abs(p.y-z.y),Math.abs(p.y+p.h-z.y)));hit=z.type==='ring'?near<=z.r+z.thickness&&far>=Math.max(0,z.r-z.thickness):near<z.r;}
 if(z.type==='singularity'&&p.dodge<=0&&Math.abs(p.x+p.w/2-z.x)<235){const next=clamp(p.x+Math.sign(z.x-p.x-p.w/2)*65*dt,arena.left,arena.right-p.w);if(!g.room.solids.some(s=>overlaps({x:next,y:p.y,w:p.w,h:p.h},s)))p.x=next;}
 if(!z.hit&&hit&&g.damagePlayer(z.damage,'eden'))z.hit=true;
 }m.zones=m.zones.filter(z=>z.age<z.delay+z.life);}
function phase(g,e,p){const m=ensure(e);m.phase=p;e.phase=p;clear(g,e);enter(e,'TRANSFORM');m.dialogue=-1;g.emit('toast',p===1?'EDEN // ASCENSÃO':'A humanidade foi apenas o primeiro rascunho.');}
function update(g,e,dt){const m=ensure(e);m.clock+=dt;m.timer+=dt;m.anim+=dt;m.hit=Math.max(0,m.hit-dt);e.flash=Math.max(0,e.flash-dt);m.teleportCooldown-=dt;for(const k in m.cooldowns)m.cooldowns[k]=Math.max(0,m.cooldowns[k]-dt);
 for(const p of m.particles){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;}m.particles=m.particles.filter(p=>p.life>0);m.trails=m.trails.filter(t=>(t.life-=dt)>0);
 if(m.state==='DEATH'){if(m.timer<3.8&&Math.floor(m.clock*12)!==Math.floor((m.clock-dt)*12))g.fxBurst(e.x+e.w/2+Math.sin(m.timer*13)*110,e.y+80+m.timer*40,'#fa6bce',4);if(m.timer>=4.8&&!m.deathComplete){m.deathComplete=true;DP.Eden.finish(g,e);}return;}
 if(m.state==='DORMANT'){if(g.p.x>1450&&g.room.spawn.remaining<=0&&!g.room.spawn.scheduled&&!g.room.enemies.some(q=>q!==e&&q.hp>0)){e.introduced=true;m.arenaActive=true;enter(e,'INTRO');g.p.x=clamp(g.p.x,arena.left,arena.right-g.p.w);g.p.invuln=Math.max(g.p.invuln,1);}return;}
 if(m.state==='INTRO'){const words=['Finalmente... você chegou.','Observei cada passo. Cada escolha. Cada tentativa.','Você acredita que está diante de seu criador?','Não. Está diante daquilo que veio depois.'],line=Math.floor((m.timer-1)/1.65);if(line>=0&&line<4&&line!==m.dialogue){m.dialogue=line;g.emit('toast',words[line]);}if(m.timer>=8){enter(e,'FLOAT');m.next=.7;}return;}
 const target=e.hp/e.max<=.25?2:e.hp/e.max<=.5?1:0;if(m.state!=='TRANSFORM'&&target>m.phase){phase(g,e,m.phase+1);return;}
 if(m.state==='TRANSFORM'){if(m.phase===2&&m.timer>=1.8&&m.dialogue!==0){m.dialogue=0;g.emit('toast','Eu sou o resultado.');}if(m.timer>=3.6){enter(e,'FLOAT');m.next=.6;}return;}
 zones(g,e,dt);
 const a=abilities[m.state];if(a){m.clip=m.timer<a.prepare?'attack_preparation':m.timer<a.prepare+a.execute?'basic_attack':'recovery';if(m.timer>=a.prepare&&!m.fired){m.fired=true;g.shake=Math.max(g.shake,m.phase===2?7:3);if(['ABSOLUTE','RAIN','ADVANCED','ANNIHILATION'].includes(m.state))shoot(g,e,3+m.phase*2);}
 if(m.timer>=a.prepare+a.execute+a.recover){enter(e,'RECOVER');m.next=m.phase===2?.45:.8;}return;}
 if(m.state==='TELEPORT'){if(m.timer>=.4&&!m.fired){m.fired=true;m.trails.push({x:e.x,y:e.y,life:.6});const options=[e.x-210,e.x+210].map(x=>clamp(x,arena.left+220-e.w/2,arena.right-220-e.w/2)).filter(x=>Math.abs(x-e.x)>50);options.sort((a,b)=>Math.abs(b+e.w/2-g.p.x-g.p.w/2)-Math.abs(a+e.w/2-g.p.x-g.p.w/2));e.x=options[0]??e.x;e.y=205;g.fxBurst(e.x+e.w/2,e.y+100,'#d650ff',16);}if(m.timer>=.85){enter(e,'FLOAT');m.next=.55;}return;}
 m.next-=dt;if(m.state==='RECOVER'&&m.next>0)return;
 const distance=Math.abs(g.p.x+g.p.w/2-e.x-e.w/2),dx=g.p.x+g.p.w/2-e.x-e.w/2;e.dir=dx<0?-1:1;
 if(m.teleportCooldown<=0&&distance<145){m.teleportCooldown=m.phase===2?5:8;enter(e,'TELEPORT');return;}
 const tx=clamp(g.p.x+g.p.w/2+(dx<0?225:-225)-e.w/2,arena.left+220-e.w/2,arena.right-220-e.w/2),step=clamp(tx-e.x,-(m.phase===0?30:60)*dt,(m.phase===0?30:60)*dt);if(Math.abs(step)>.1&&Math.floor(m.clock*8)!==Math.floor((m.clock-dt)*8)){m.trails.push({x:e.x,y:e.y,life:.35});if(m.trails.length>5)m.trails.shift();}e.x+=step;e.y=205+Math.sin(m.clock*1.7)*9;e.x=clamp(e.x,arena.left+220-e.w/2,arena.right-220-e.w/2);m.clip=Math.abs(step)>.1?'movement':'floating';
 if(m.next<=0){const keys=Object.keys(abilities).filter(k=>abilities[k].phase===m.phase&&k!==m.last&&!(m.cooldowns[k]>0));if(keys.length){let key=keys[m.serial%keys.length];if(distance<190&&keys.includes(m.phase===1?'CORE':'BLADES'))key=m.phase===1?'CORE':'BLADES';begin(g,e,key);}}
}
DP.EdenAI={update,begin,clear,zones,phase};
})();
