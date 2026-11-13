(function(){
'use strict';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const smooth=(a,b,k,dt)=>b+(a-b)*Math.exp(-k*dt);
const ease=t=>{t=clamp(t,0,1);return t*t*(3-2*t);};
const attacks={ATTACK:{prepare:.58,execute:.72,duration:.95},CANNON:{prepare:.7,execute:1.2,duration:1.65},SHIELD:{prepare:.58,execute:.8,duration:1.1},SUMMON:{prepare:.58,execute:1.05,duration:1.7},ORDER:{prepare:.4,execute:2.05,duration:2.65},ULTIMATE:{prepare:2.15,execute:2.65,duration:3.4}};
function ensure(e){if(!e.govMotion)e.govMotion={target:0,velocity:0,acceleration:0,clock:0,gait:0,travel:0,lean:0,cape:0,capeVelocity:0,head:0,shoulder:0,arm:0,plates:0,core:0,recoil:0,impact:0,squash:0,body:0,turn:0,turnLock:0,pause:0,steps:0,air:false,frame:0};return e.govMotion;}
function changeAnimation(e,name,duration){const m=ensure(e);if(e.govAnim!==name){const locomotion=['walk','run'];const keepPhase=locomotion.includes(e.govAnim)&&locomotion.includes(name);e.govAnim=name;e.govAnimTime=keepPhase?(m.gait%1)*.8:0;m.transition=.16;m.previousBody=m.body;}e.govAnimDuration=duration;}
function turn(e,dir){const m=ensure(e);if(m.turnLock>0||dir===e.dir)return false;m.turnFrom=e.dir;m.turnTo=dir;m.turn=0;return true;}
function attackPose(e){const a=attacks[e.governorState];if(!a)return {arm:0,plates:0,core:0,squash:0,body:0};const t=e.govTimer||0,ready=ease(t/a.prepare),release=1-ease((t-a.execute)/(a.duration-a.execute));e.govAttackPhase=t<a.prepare?'preparation':t<a.execute?'execution':'recovery';
 const active=ready*release;return {arm:(e.governorState==='CANNON'?-8:e.governorState==='SUMMON'?-11:e.governorState==='ORDER'?-9:-3)*active,plates:['ULTIMATE','SHIELD'].includes(e.governorState)?active:0,core:e.governorState==='ULTIMATE'?active:0,squash:e.governorState==='ULTIMATE'&&t>=a.prepare&&t<a.execute?-.045:0,body:e.governorState==='ATTACK'?Math.sin(ready*Math.PI)*3*release:e.governorState==='ULTIMATE'?-active:0};}
function update(g,e,dt){const m=ensure(e);dt=clamp(Number.isFinite(dt)?dt:0,0,.05);if(!dt)return;m.clock+=dt;m.turnLock=Math.max(0,m.turnLock-dt);m.pause=Math.max(0,m.pause-dt);m.transition=Math.max(0,(m.transition||0)-dt);
 const state=e.governorState,attacking=!!attacks[state],stopped=attacking||['TURN','HIT','LAND','JUMP_PREP','DEATH'].includes(state),target=stopped?0:m.target;
 // Exact integration of exponential acceleration makes travel independent of
 // update rate. Reversal brakes first, so momentum cannot flip in one update.
 const old=m.velocity,braking=old*target<0||Math.abs(target)<Math.abs(old),rate=braking?8.5:3.6,decay=Math.exp(-rate*dt);
 m.velocity=target+(old-target)*decay;let travel=target*dt+(old-target)*(1-decay)/rate;
 const previousX=e.x;e.x=clamp(e.x+travel,e.introduced?1700:1960,g.worldWidth-e.w-35);
 for(const wall of g.room.solids||[]){if(e.y+e.h<=wall.y||e.y>=wall.y+wall.h)continue;if(travel>0&&previousX+e.w<=wall.x&&e.x+e.w>wall.x){e.x=wall.x-e.w;m.velocity=0;}else if(travel<0&&previousX>=wall.x+wall.w&&e.x<wall.x+wall.w){e.x=wall.x+wall.w;m.velocity=0;}}
 if(e.x===1700||e.x===g.worldWidth-e.w-35)m.velocity=0;
 travel=e.x-previousX;m.acceleration=(m.velocity-old)/dt;e.vx=m.velocity;
 const stride=state==='CHASE'&&e.phase>0?72:60;m.gait+=Math.abs(travel)/stride;m.travel+=Math.abs(travel);
 // Footfalls come from distance, not a global clock: no running in place.
 const step=Math.floor(m.gait*2);if(step>m.steps&&!m.air&&Math.abs(m.velocity)>18){m.steps=step;g.fxBurst(e.x+e.w/2+(step%2?9:-9),e.y+e.h-1,'#665d59',Math.abs(m.velocity)>95?4:2);m.impact=Math.max(m.impact,.15);}else m.steps=step;
 if(state==='TURN'){const p=clamp(e.govTimer/.34,0,1);m.turn=Math.sin(p*Math.PI);if(p>=.55)e.dir=m.turnTo??e.dir;}
 else m.turn=smooth(m.turn,0,16,dt);
 const pose=attackPose(e),speed=Math.abs(m.velocity),facing=e.dir||1,breath=Math.sin(m.clock*2.1),stepWave=Math.cos(m.gait*Math.PI*4);
 const prep=state==='JUMP_PREP'?ease(e.govTimer/.2):0,land=state==='LAND'?Math.pow(1-clamp(e.govTimer/.44,0,1),2):0;
 m.recoil=smooth(m.recoil,0,15,dt);m.impact=smooth(m.impact,0,13,dt);
 m.lean=smooth(m.lean,clamp((m.velocity*.035+m.acceleration*.008)*facing,-7,7)-m.recoil*1.5,9,dt);
 m.head=smooth(m.head,breath*.45-m.lean*.12+(state==='TURN'?m.turn*(m.turnTo===m.turnFrom?-1:1)*2:0),10,dt);
 m.shoulder=smooth(m.shoulder,breath*.45+stepWave*clamp(speed/100,0,1)*.8+m.recoil*.7,9,dt);
 m.arm=smooth(m.arm,pose.arm+Math.sin(m.gait*Math.PI*2)*clamp(speed/80,0,1)*1.2+m.recoil*2,12,dt);
 m.leftArm=smooth(m.leftArm||0,pose.arm*.6-Math.sin(m.gait*Math.PI*2)*clamp(speed/80,0,1)*1.2,10,dt);
 m.plates=smooth(m.plates,pose.plates,8,dt);m.core=smooth(m.core,pose.core,7,dt);
 m.squash=smooth(m.squash,prep*.11+land*.13+pose.squash,18,dt);
 m.body=smooth(m.body,pose.body+prep*2.5+land*2.5+(m.air?-1:Math.abs(stepWave)*clamp(speed/100,0,1)*.7),12,dt);
 // Damped spring, substepped for stable cape lag at low frame rates.
 const capeTarget=clamp(-m.velocity*facing*.045-m.acceleration*facing*.009,-10,10)+Math.sin(m.clock*1.8)*.85+(m.air?clamp(e.vy*.015,-5,5):0);
 let remaining=dt;while(remaining>0){const h=Math.min(remaining,1/120);m.capeVelocity+=(55*(capeTarget-m.cape)-13*m.capeVelocity)*h;m.cape+=m.capeVelocity*h;remaining-=h;}
 if(!attacking)e.govAttackPhase='';

}
function air(g,e,dt,enter){const m=ensure(e);if(e.governorState==='JUMP_PREP'){if(e.govTimer>=.2){e.vy=-310;m.air=true;enter(e,'JUMP');g.fxBurst(e.x+e.w/2,e.y+e.h,'#665d59',6);}return;}
 const oldY=e.y,oldBottom=oldY+e.h;e.y+=e.vy*dt+490*dt*dt;e.vy+=980*dt;
 if(e.vy>=0&&e.governorState==='JUMP')enter(e,'FALL');let floor=520;
 for(const q of [...(g.room.solids||[]),...(g.room.platforms||[])])if(q.active!==false&&e.x+e.w>q.x&&e.x<q.x+q.w&&e.vy>=0&&oldBottom<=q.y+1&&e.y+e.h>=q.y)floor=Math.min(floor,q.y);
 for(const q of g.room.solids||[])if(e.vy<0&&e.x+e.w>q.x&&e.x<q.x+q.w&&oldY>=q.y+q.h&&e.y<q.y+q.h){e.y=q.y+q.h;e.vy=0;}
 if(e.y+e.h>=floor&&e.vy>=0){const impact=e.vy;e.y=floor-e.h;e.vy=0;m.air=false;m.impact=1;m.pause=.44;enter(e,'LAND',.44);g.fxBurst(e.x+e.w/2,floor-1,'#665d59',12);g.shake=Math.max(g.shake,Math.min(5,impact/100));}
}
function frame(e,name,count){const m=ensure(e),loop=['idle','walk','run'].includes(name);if(name==='walk'||name==='run')return Math.floor(m.gait*count)%count;if(name==='idle')return Math.floor((e.govAnimTime||0)*6)%count;const time=name==='death'?1.5-e.deathAnim:e.govAnimTime||0,duration=name==='death'?1.5:e.govAnimDuration||count/10;return clamp(Math.floor(time/duration*count),0,count-1);}
// One whole source frame, anchored at the boots. No triangle slices or pixel
// readback: works when the game is opened directly from a local HTML file.
function draw(c,im,index,x,y,e,attachments){const m=ensure(e);if(!im?.complete||!im.naturalWidth)return;c.save();c.imageSmoothingEnabled=false;c.translate(x+e.w/2,y+e.h);c.rotate(clamp(m.lean,-4,4)*Math.PI/180);const squash=clamp(m.squash,-.035,.12);c.scale(e.dir*.7125*(1+squash*.2)*(1-m.turn*.08),.7125*(1-squash));c.translate(-80,-142);c.drawImage(im,index*160,0,160,160,0,0,160,160);if(attachments)attachments(c,m);c.restore();}
window.DP=window.DP||{};DP.GovernorMotion={ensure,changeAnimation,turn,update,air,frame,draw,attacks,ease};
})();
