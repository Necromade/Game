(function(){
'use strict';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)), overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
const counts={idle:4,walk:4,intro:5,punch:5,steam:4,claw:4,blast:3,beam:3,hit:4},sheets={};
for(const key in counts){const im=new Image();im.src='assets/sprites/colossus/'+key+'.png?v=motion-3';sheets[key]=im;}
const attacks={punch:{label:'SOCO GIGANTE // PULE A ONDA',prepare:.95,active:.24,recover:.8,damage:22},steam:{label:'RAJADA DE VAPOR // RECUE',prepare:.9,active:.85,recover:.7,damage:14},claw:{label:'GARRA MECÂNICA // AFASTE-SE',prepare:.75,active:.32,recover:.65,damage:18},blast:{label:'EXPLOSÃO INDUSTRIAL // SAIA DO CÍRCULO',prepare:1.3,active:.4,recover:.95,damage:24},beam:{label:'RAIO DE ENERGIA // PULE',prepare:1.25,active:.85,recover:.85,damage:20}};
function ensure(e){return e.colossus||(e.colossus={state:'dormant',timer:0,clock:0,next:1.3,serial:0,combo:0,hit:0,waves:[],particles:[],history:[],fired:false});}
function enter(e,state){const m=ensure(e);m.state=state;m.timer=0;m.fired=false;m.connected=false;e.state=state;e.vx=0;}
function begin(g,e,key,combo=false){const m=ensure(e);if(e.hp<=0||!attacks[key]||!['idle','walk','recover'].includes(m.state))return false;e.dir=g.p.x+g.p.w/2<e.x+e.w/2?-1:1;enter(e,key);m.aim={x:g.p.x+g.p.w/2,y:g.p.y+g.p.h/2};m.history.push(key);if(m.history.length>30)m.history.shift();m.combo=combo?1:0;g.emit('toast',attacks[key].label.toUpperCase());return true;}
function beamPath(e){const m=ensure(e),a={x:e.x+e.w/2-e.dir*13,y:e.y+e.h-120},dx=(m.aim?.x??a.x+e.dir*300)-a.x,dy=(m.aim?.y??490)-a.y,len=Math.hypot(dx,dy)||1;return{a,b:{x:a.x+dx/len*680,y:a.y+dy/len*680}};}
attacks.charge={label:'INVESTIDA // PULE OU ESQUIVE',prepare:.85,active:.8,recover:.85,damage:23};
attacks.overload={label:'SOBRECARGA // AFASTE-SE DA EXPLOSÃO',prepare:1.5,active:.65,recover:1,damage:28};
function timing(e){const s=ensure(e).state;if(s==='transition')return{prepare:1.05,active:.65,recover:.1};const a=attacks[s];if(!a)return null;const k=e.phase?.74:1;return{prepare:a.prepare*k,active:a.active,recover:a.recover*k};}
function radius(e){return ensure(e).state==='transition'?340:ensure(e).state==='overload'?320:e.phase?270:195;}
function explosive(e){return ['blast','overload','transition'].includes(ensure(e).state);}
function move(g,e,step){let nx=clamp(e.x+step,1600,2380-e.w);for(const s of g.room.solids){if(e.y>=s.y+s.h||e.y+e.h<=s.y)continue;if(step>0&&e.x+e.w<=s.x&&nx+e.w>s.x)nx=s.x-e.w;else if(step<0&&e.x>=s.x+s.w&&nx<s.x+s.w)nx=s.x+s.w;else if(overlap({x:nx,y:e.y,w:e.w,h:e.h},s))nx=e.x;}e.x=nx;}
function explode(g,e){const m=ensure(e),cx=e.x+e.w/2,cy=e.y+e.h-60,r=radius(e);if(!m.fired){m.fired=true;g.shake=Math.max(g.shake,18);g.fxBurst(cx,cy,'#ffad52',48);}if(!m.connected&&Math.hypot(clamp(cx,g.p.x,g.p.x+g.p.w)-cx,clamp(cy,g.p.y,g.p.y+g.p.h)-cy)<r&&g.damagePlayer(attacks[m.state]?.damage||28,'colossus'))m.connected=true;}
function bounds(e){const m=ensure(e),cx=e.x+e.w/2,front=cx+e.dir*45;
 if(m.state==='charge'){const reach=(e.phase?650:520)*attacks.charge.active;return{x:e.dir>0?cx:cx-reach,y:e.y+e.h-35,w:reach,h:35};}
 if(m.state==='blast')return{x:cx-195,y:330,w:390,h:190};
 const w=m.state==='beam'?680:m.state==='steam'?260:m.state==='claw'?180:130;
 return{x:e.dir>0?front:front-w,y:m.state==='beam'?472:m.state==='punch'?461:411,w,h:m.state==='beam'?24:m.state==='punch'?59:109};}
function active(e){const t=timing(e),m=ensure(e);return !!t&&m.timer>=t.prepare&&m.timer<t.prepare+t.active;}
function particle(m,x,y,smoke=false){if(m.particles.length>=64)return;m.particles.push({x,y,vx:smoke?Math.sin(m.clock*13)*13:(Math.sin(m.clock*51)*95),vy:smoke?-30:-90,life:smoke?1.2:.65,max:smoke?1.2:.65,smoke});}
function update(g,e,dt){const m=ensure(e);m.clock+=dt;m.timer+=dt;m.hit=Math.max(0,m.hit-dt);e.flash=Math.max(0,e.flash-dt);
 for(const p of m.particles){p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(!p.smoke)p.vy+=180*dt;}m.particles=m.particles.filter(p=>p.life>0);
 if(e.hp<=0){if(m.state!=='death')enter(e,'death');if(m.timer<2.7&&Math.floor((m.timer-dt)*10)!==Math.floor(m.timer*10)){g.fxBurst(e.x+30+(m.timer*151)%130,e.y+40+(m.timer*83)%160,'#ff784a',7);g.shake=Math.max(g.shake,4);}m.waves=[];return;}
 if(m.state==='dormant'){if(Math.abs(g.p.x-e.x)<540){e.introduced=true;enter(e,'intro');g.emit('toast','COLOSSO DA FÁBRICA // UMA MÁQUINA QUE NUNCA PARA');}return;}
 if(e.hp<=e.max*.5&&!e.phase){e.phase=1;m.waves=[];m.combo=0;enter(e,'transition');g.emit('toast','COLOSSO // FASE 2: SOBRECARGA INDUSTRIAL');}
 if(Math.floor(m.clock*(e.phase?18:8))!==Math.floor((m.clock-dt)*(e.phase?18:8)))particle(m,e.x+e.w*.45,e.y+8,true);
 if(m.state==='intro'||m.state==='transition'){if(m.state==='transition'&&active(e))explode(g,e);if(m.timer> (m.state==='intro'?2.2:1.8)){enter(e,'idle');m.next=1;}return;}
 for(const w of m.waves){const old=w.x;w.x+=w.vx*dt;w.life-=dt;const swept={x:Math.min(old,w.x),y:w.y,w:Math.abs(w.x-old)+w.w,h:w.h};if(!w.hit&&overlap(swept,g.p)&&g.damagePlayer(16,'colossus'))w.hit=true;}m.waves=m.waves.filter(w=>w.life>0&&w.x>1550&&w.x<2400);
 const t=timing(e);
 if(t){if(m.timer>=t.prepare&&!m.fired){if(!explosive(e))m.fired=true;if(m.state==='punch'){g.shake=Math.max(g.shake,10);g.fxBurst(e.x+e.w/2+e.dir*90,510,'#ffbc82',22);for(const d of (e.phase?[-1,1]:[e.dir]))m.waves.push({x:e.x+e.w/2+e.dir*90,y:498,w:44,h:22,vx:d*(e.phase?340:250),life:3,hit:false});}}
  if(active(e)&&explosive(e)){explode(g,e);}
  else if(active(e)){const old=e.x;if(m.state==='charge')move(g,e,e.dir*(e.phase?650:520)*dt);const b=m.state==='charge'?{x:Math.min(old,e.x)+20,y:e.y+30,w:Math.abs(e.x-old)+e.w-40,h:e.h-30}:bounds(e);let hit=overlap(b,g.p);if(m.state==='beam'){const ray=beamPath(e);hit=DP.RootGuardianPhysics.segment(ray.a,ray.b,12,g.p);}if(!m.connected&&hit&&g.damagePlayer(attacks[m.state].damage,'colossus'))m.connected=true;}
  if(m.timer>=t.prepare+t.active+t.recover){const previous=m.state,chain=e.phase&&m.combo===0;enter(e,'recover');m.next=chain?.3:e.phase?.65:1.6;m.pending=chain?({punch:'claw',steam:'beam',claw:'punch',blast:'steam',beam:'claw',charge:'punch',overload:'charge'}[previous]):null;}return;}
 if(m.state==='hit'){if(m.timer>.24){enter(e,'idle');m.next=.6;}return;}
 m.next-=dt;if(m.state==='recover'&&m.next>0)return;
 if(m.pending){const key=m.pending;m.pending=null;begin(g,e,key,true);return;}
 const dx=g.p.x+g.p.w/2-e.x-e.w/2,distance=Math.abs(dx);e.dir=dx<0?-1:1;
 if(distance>180){if(m.state!=='walk')enter(e,'walk');move(g,e,e.dir*(e.phase?115:78)*dt);}
 else if(m.state==='walk')enter(e,'idle');
 if(m.next<=0){const keys=Object.keys(attacks).filter(k=>e.phase||k!=='overload');begin(g,e,keys[m.serial++%keys.length]);}
}
const proto=DP.Game.prototype;
proto.updateColossus=function(e,dt){update(this,e,clamp(Number.isFinite(dt)?dt:0,0,.05));};
const oldUpdate=proto.updateEnemies;proto.updateEnemies=function(dt){oldUpdate.call(this,dt);for(const e of this.room.enemies)if(e.kind==='colossus'&&e.hp<=0&&e.deathAnim>0)update(this,e,clamp(dt,0,.05));};
const oldDamage=proto.damage;proto.damage=function(e,n,pulse=false){if(e?.kind!=='colossus')return oldDamage.call(this,e,n,pulse);const m=ensure(e);if(['dormant','intro','transition'].includes(m.state))return false;const result=oldDamage.call(this,e,n,pulse);if(result){m.hit=.2;if(e.hp<=0){enter(e,'death');e.deathAnim=3.2;m.waves=[];m.pending=null;}else if(['idle','walk','recover'].includes(m.state))m.next=Math.min(m.next,.25);else e.state=m.state;}return result;};
const oldBox=DP.Art.hitbox;DP.Art.hitbox=function(e,index){return e.kind==='colossus'?{x:e.x+25,y:e.y+30,w:e.w-50,h:e.h-30}:oldBox(e,index);};
function sprite(c,key,frame,x,y,w,h){const im=sheets[key];if(im?.complete&&im.naturalWidth)c.drawImage(im,frame*256,0,256,256,x,y,w,h);}
// A single continuous playhead: attack stage boundaries must not restart the clip.
function animation(e){const m=ensure(e),s=m.state,t=timing(e);
 const key=counts[s]?s:s==='charge'?'walk':explosive(e)?'blast':'idle',n=counts[key];
 const moving=s==='walk'||s==='charge',fps=moving?(s==='charge'?14:e.phase?11:8):t?10:6;
 const time=['intro','hit'].includes(s)?m.timer:m.clock;
 const frame=['intro','hit'].includes(s)?Math.min(n-1,Math.floor(time/(s==='intro'?2.2:.24)*n)):Math.floor(time*fps)%n;
 const cycle=time*fps*Math.PI/2;
 let lift=moving?Math.abs(Math.sin(cycle))*5:Math.sin(time*4)*1.5,lean=moving?Math.sin(cycle)*.025:0,reach=0;
 if(t){const wind=clamp(m.timer/t.prepare,0,1),impact=clamp((m.timer-t.prepare)/t.active,0,1),rest=clamp((m.timer-t.prepare-t.active)/t.recover,0,1);
  const force=m.timer<t.prepare?-wind*.035:m.timer<t.prepare+t.active?Math.sin(impact*Math.PI)*.09:(1-rest)*.025;
  lean+=force;reach=force*90;if(explosive(e))lift+=Math.sin(time*30)*(m.timer<t.prepare?wind*3:1);}
 return{key,frame,lift,lean,reach};}
function render(c,e,x){const m=ensure(e);c.save();c.imageSmoothingEnabled=false;
 const dying=m.state==='death',s=m.state,a=animation(e),key=a.key,f=a.frame;
 c.translate(x+e.w/2,e.y+e.h);c.scale(e.dir>0?1:-1,1);c.globalAlpha=dying?clamp(e.deathAnim/.65,0,1):1;
 if(!dying){c.translate(a.reach,-a.lift);c.rotate(a.lean);}
 if(dying){const im=sheets.idle;if(im.complete&&im.naturalWidth){for(let i=0;i<8;i++){const fall=Math.max(0,m.timer-i*.13);c.save();c.translate((i%2?1:-1)*fall*12,Math.min(140,fall*fall*55));c.rotate((i%2?1:-1)*fall*.1);c.drawImage(im,0,i*32,256,32,-144,-258+i*36,288,36);c.restore();}}}
 else sprite(c,key,f,-144,-258,288,288);
 if(!dying){const pulse=.5+.5*Math.sin(m.clock*(e.phase?8:3));c.globalAlpha=(e.phase?.55:.2)+pulse*.2;c.fillStyle='#ff303f';c.beginPath();c.ellipse(-13,-120,8+pulse*2,13,0,0,Math.PI*2);c.fill();if(m.hit>0){c.globalAlpha=.5;c.strokeStyle='#fff0c8';c.lineWidth=3;c.strokeRect(-57,-194,114,185);}}
 c.restore();c.save();
 for(const p of m.particles){c.globalAlpha=p.life/p.max*.45;c.fillStyle=p.smoke?'#af929c':'#ff9859';c.fillRect(p.x-e.x+x,p.y,p.smoke?10+(p.max-p.life)*15:4,p.smoke?9:4);}
 const b=bounds(e),t=timing(e);if(t&&m.timer<t.prepare+t.active){const on=active(e);c.globalAlpha=on?.7:.18+.15*Math.sin(m.clock*14);c.fillStyle=s==='steam'?'#dac5c9':'#ff4256';c.strokeStyle='#ffb77e';c.lineWidth=2;
 if(s==='beam'){const ray=beamPath(e);c.strokeStyle=on?'#ff4256':'#ffb77e';c.lineWidth=on?24:2;c.beginPath();c.moveTo(ray.a.x-e.x+x,ray.a.y);c.lineTo(ray.b.x-e.x+x,ray.b.y);c.stroke();if(on){c.strokeStyle='#fff4ca';c.lineWidth=6;c.stroke();}}
 else if(explosive(e)){const r=radius(e),cy=e.y+e.h-60,progress=on?clamp((m.timer-t.prepare)/t.active,0,1):0;c.beginPath();c.ellipse(x+e.w/2,cy,r,on?r:30,0,0,Math.PI*2);if(on){c.globalAlpha=.55*(1-progress);c.fill();c.strokeStyle='#fff2be';c.lineWidth=10*(1-progress)+2;c.beginPath();c.arc(x+e.w/2,cy,r*(.2+.8*progress),0,Math.PI*2);c.stroke();}else c.stroke();}
 else{if(on){c.fillRect(b.x-e.x+x,b.y,b.w,b.h);if(s==='beam'){c.fillStyle='#fff4ca';c.fillRect(b.x-e.x+x,b.y+9,b.w,6);}if(s==='steam'){for(let i=0;i<9;i++){c.globalAlpha=.35;c.beginPath();c.arc(b.x-e.x+x+(i+.5)*b.w/9,b.y+45+Math.sin(m.clock*12+i)*20,25,0,Math.PI*2);c.fill();}}}else c.strokeRect(b.x-e.x+x,b.y,b.w,b.h);}
 if(m.timer<t.prepare){c.globalAlpha=1;c.fillStyle='#ffe2bf';c.font='11px monospace';c.fillText((attacks[s]?.label||'SOBRECARGA // AFASTE-SE DA EXPLOSÃO').toUpperCase(),x-60,e.y-40);}}
 for(const w of m.waves){c.globalAlpha=.8;c.strokeStyle='#ffb875';c.lineWidth=5;c.beginPath();c.ellipse(w.x-e.x+x+w.w/2,w.y+w.h,w.w/2,w.h,0,Math.PI,Math.PI*2);c.stroke();}
 if(['intro','transition'].includes(s)){c.globalAlpha=.8;c.fillStyle='#ff9b87';c.font='bold 17px monospace';c.fillText(s==='intro'?'COLOSSO DA FÁBRICA':'FASE 2 // SOBRECARGA',x-90,e.y-55);}
 c.restore();}
const oldDraw=DP.Art.drawEnemy;DP.Art.drawEnemy=function(c,e,index,x,t){if(e.kind==='colossus')return render(c,e,x);return oldDraw(c,e,index,x,t);};
const oldBackdrop=DP.Art.drawBackdrop;DP.Art.drawBackdrop=function(c,index,cam,t,w,h){oldBackdrop(c,index,cam,t,w,h);if(index!==3)return;c.save();c.fillStyle='#281d29';c.fillRect(1580-cam,520,820,30);c.strokeStyle='#ba6655';c.lineWidth=3;for(let i=0;i<8;i++){c.strokeRect(1600+i*100-cam,525,70,8);}c.fillStyle='#b7837d';c.font='12px monospace';c.fillText('CÂMARA DE FUNDIÇÃO // COLOSSO',1740-cam,180);c.restore();};
const oldHud=proto.updateHud;proto.updateHud=function(){oldHud.call(this);const hud=document.querySelector('#bossHud');if(!hud)return;const e=this.room.enemies.find(q=>q.kind==='colossus'&&q.hp>0&&q.introduced);hud.classList.toggle('colossus',!!e);if(e){hud.dataset.phase='FASE '+(e.phase+1)+' // '+(e.phase?'SOBRECARGA':'DESPERTAR');document.querySelector('#bossName').textContent='COLOSSO DA FÁBRICA';}};
DP.Colossus={ensure,enter,begin,attacks,timing,bounds,active,counts,sheets,update,render,animation};
})();
