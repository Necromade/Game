(function(){
'use strict';
const M=DP.EdenModel,R=DP.EdenRender,P=DP.Game.prototype,clamp=M.clamp;
const smooth=t=>{t=clamp(t,0,1);return t*t*(3-2*t);},mix=(a,b,t)=>a+(b-a)*smooth(t);
const lines=[
 [10,4,'Então... você finalmente chegou.'],
 [15,5,'Observei sua jornada desde o primeiro instante.'],
 [21,7,'Suas descobertas. Suas escolhas. Suas tentativas de compreender este mundo.'],
 [29,8,'Você atravessou aquilo que restou da humanidade acreditando que encontraria respostas.'],
 [38,3,'Mas nunca percebeu...'],
 [43,6,'Que todas as respostas estavam observando você.'],
 [55,4,'Não há mais nada a descobrir.'],
 [60,4,'Vamos concluir sua jornada.']
];
const stages=[[0,'SUSPENSE'],[4,'MANIFESTATION'],[8,'REVEAL'],[10,'DIALOGUE'],[49,'POWER'],[55,'VERDICT'],[64,'TITLE'],[69,'RETURN']],duration=72;
let activeGame=null;
window.addEventListener('keydown',event=>{if(activeGame&&['a','d','w','s','j','k','q','e','m',' ','escape','tab','shift','arrowleft','arrowright','arrowup'].includes(event.key.toLowerCase())){event.preventDefault();event.stopImmediatePropagation();}},true);
function soundStart(g,s){const a=g.audio;if(!a?.enabled||!a.ctx||!a.master)return;s.audio={a,volume:a.master.gain.value,nodes:[],bus:a.ctx.createGain(),hadMusic:!!a.musicTimer};const q=s.audio,ctx=a.ctx;q.bus.gain.value=q.volume;q.bus.connect(ctx.destination);a.stopMusic();a.master.gain.cancelScheduledValues(ctx.currentTime);a.master.gain.setTargetAtTime(q.volume*.15,ctx.currentTime,.7);
 const buffer=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate),data=buffer.getChannelData(0);let seed=17;for(let i=0;i<data.length;i++){seed=(seed*16807)%2147483647;data[i]=(seed/2147483647-.5)*.035;}const noise=ctx.createBufferSource(),filter=ctx.createBiquadFilter();filter.type='lowpass';filter.frequency.value=480;noise.buffer=buffer;noise.loop=true;noise.connect(filter);filter.connect(q.bus);noise.start();q.nodes.push(noise,filter);
 for(const hz of [38,57]){const o=ctx.createOscillator(),gain=ctx.createGain();o.type='sine';o.frequency.value=hz;gain.gain.value=.025;o.connect(gain);gain.connect(q.bus);o.start();q.nodes.push(o,gain);}}
function cue(s,hz=110,length=.5){const q=s.audio;if(!q||!q.a.enabled)return;const c=q.a.ctx,o=c.createOscillator(),v=c.createGain(),now=c.currentTime;o.type='triangle';o.frequency.setValueAtTime(hz,now);o.frequency.exponentialRampToValueAtTime(hz*.6,now+length);v.gain.setValueAtTime(.0001,now);v.gain.exponentialRampToValueAtTime(.08,now+.04);v.gain.exponentialRampToValueAtTime(.0001,now+length);o.connect(v);v.connect(q.bus);o.start();o.stop(now+length);o.onended=()=>{o.disconnect();v.disconnect();};}
function soundEnd(s,battle){const q=s?.audio;if(!q)return;for(const node of q.nodes){try{node.stop?.();node.disconnect();}catch{}}q.bus.disconnect();const a=q.a,now=a.ctx.currentTime;a.master.gain.cancelScheduledValues(now);a.master.gain.setTargetAtTime(q.volume,now,.4);if(battle){a.stopMusic();let beat=0;const notes=[55,55,82.41,73.42,55,65.41,49,82.41];a.musicTimer=setInterval(()=>{if(!a.enabled)return;const n=notes[beat++%notes.length];a.tone(n,.32,'triangle',.055);if(beat%2===0)a.tone(n*4,.18,'sine',.025);},300);}else if(q.hadMusic)a.startMusic();s.audio=null;}
function begin(g,e){if(g.edenCinema||g.room.edenIntroPlayed)return;const m=M.ensure(e);M.enter(e,'INTRO');m.clip='floating';m.arenaActive=true;e.introduced=true;g.room.edenIntroPlayed=true;g.projectiles=[];g.fx=[];g.p.attackState=null;g.p.attack=0;g.p.skill=0;g.p.dodge=0;g.p.vx=g.p.vy=0;g.p.y=520-g.p.h;g.keys={};g.once={};
 g.edenCinema={e,time:0,stage:'SUSPENSE',active:true,startX:clamp(g.p.x,1480,2350),camera:g.camera,zoom:1,panY:0,panX:0,line:-1,cueStage:'',releaseMusic:false};activeGame=g;window.dispatchEvent(new Event('eden-controls-reset'));g.p.x=g.edenCinema.startX;document.body.classList.add('eden-cinema');soundStart(g,g.edenCinema);g.updateHud();}
function finish(g,abort=false){const s=g.edenCinema;if(!s)return;s.active=false;soundEnd(s,!abort);if(activeGame===g)activeGame=null;window.dispatchEvent(new Event('eden-controls-reset'));document.body.classList.remove('eden-cinema');g.keys={};g.once={};g.p.vx=g.p.vy=0;g.p.attackState=null;g.p.attack=g.p.skill=g.p.dodge=0;if(!abort){M.enter(s.e,'FLOAT');M.ensure(s.e).next=1.2;g.p.invuln=Math.max(g.p.invuln,1);g.camera=g.edenCamera=1440;}g.edenCinema=null;g.updateHud();}
function update(g,dt){const s=g.edenCinema,e=s.e,m=M.ensure(e);s.time+=dt;g.time+=dt;m.clock+=dt;m.anim+=dt;m.timer=s.time;s.stage=stages.filter(q=>s.time>=q[0]).at(-1)[1];if(s.stage!==s.cueStage){s.cueStage=s.stage;cue(s,s.stage==='POWER'?45:s.stage==='TITLE'?165:82,s.stage==='POWER'?1.5:.65);}
 const t=s.time;g.p.x=mix(s.startX,clamp(s.startX+40,1480,2350),t/4);g.p.face=e.x>g.p.x?1:-1;g.p.animTime+=dt;g.p.animState=t<4?'walk':'idle';g.p.ground=true;g.p.y=520-g.p.h;g.camera=mix(s.camera,1440,t/8);
 s.panY=t<8?mix(0,105,(t-3)/5):t<37?mix(105,45,(t-8)/5):t<49?mix(45,-(M.core(e).y-300)*1.45,(t-37)/5):t<64?mix(-(M.core(e).y-300)*1.45,20,(t-49)/4):mix(20,0,(t-64)/8);
 s.zoom=t<37?mix(1,1.08,(t-8)/4):t<49?mix(1.08,1.45,(t-37)/5):t<64?mix(1.45,1,(t-49)/4):1;
 s.panX=t<37?0:t<49?mix(0,-(M.core(e).x-1440-480)*1.45,(t-37)/5):mix(-(M.core(e).x-1440-480)*1.45,0,(t-49)/4);
 const n=lines.findIndex(q=>t>=q[0]&&t<q[0]+q[1]);if(n!==s.line){s.line=n;if(n>=0)cue(s,145+n*9,.3);}
 if(t>=64&&!s.releaseMusic){s.releaseMusic=true;soundEnd(s,true);}g.updateHud();if(t>=duration)finish(g);}
const oldUpdate=P.update;P.update=function(dt){if(!this.running)return;const e=this.index===5?this.room.enemies.find(e=>e.kind==='eden'&&e.hp>0):null;if(e&&!this.edenCinema&&!this.room.edenIntroPlayed&&this.p.x>1450&&!this.p.dead&&this.room.spawn.remaining<=0&&!this.room.spawn.scheduled&&!this.room.enemies.some(q=>q!==e&&q.hp>0)&&['DORMANT','INTRO'].includes(M.ensure(e).state))begin(this,e);if(this.edenCinema){update(this,clamp(Number.isFinite(dt)?dt:0,0,.05));return;}oldUpdate.call(this,dt);};
for(const name of ['setKeys','action','startAttack','startSkill','startDodge','damagePlayer']){const original=P[name];P[name]=function(...args){if(this.edenCinema?.active)return false;return original.apply(this,args);};}
const oldLoad=P.loadRoom;P.loadRoom=function(...args){if(this.edenCinema)finish(this,true);this.audio?.stopMusic?.();const result=oldLoad.apply(this,args);if(this.audio?.ctx)this.audio.startMusic?.();return result;};
const oldEnemy=DP.Art.drawEnemy;DP.Art.drawEnemy=function(c,e,index,x,t){if(e.kind!=='eden')return oldEnemy(c,e,index,x,t);const m=M.ensure(e);if(m.state==='DORMANT')return;if(m.state!=='INTRO')return oldEnemy(c,e,index,x,t);const time=m.timer,cx=x+e.w/2,cy=e.y+e.h*.4;
 if(time>=4&&time<10){c.save();c.globalAlpha=smooth((time-4)/4);for(let i=0;i<3;i++){c.strokeStyle='#d33cbd';c.lineWidth=2;c.beginPath();c.ellipse(cx,cy-115+i*35,125+i*15,18+i*4,Math.sin(time*.3+i)*.08,0,Math.PI*2);c.stroke();}c.restore();}
 if(time>=6){M.sprite(c,'core',Math.floor(m.clock*8)%8,cx,cy,70,smooth((time-6)/2));}if(time>=8){c.save();c.globalAlpha=smooth((time-8)/3);c.translate(0,-35*(1-smooth((time-8)/3)));R.body(c,e,x);c.restore();}}
const oldOverlay=R.overlay;R.overlay=function(g,e){if(g.edenCinema)return;oldOverlay(g,e);};
function overlay(g,s){const c=g.x,t=s.time,shade=t<8?mix(0,.65,t/4):mix(.65,.08,(t-8)/3);c.save();c.fillStyle='rgba(3,0,10,'+shade+')';c.fillRect(0,0,g.w,g.h);
 // Suspended debris and a harmless demonstration wave have no combat hitboxes.
 if(t>=3&&t<64){const power=t>=49?smooth((t-49)/3):.18;for(let i=0;i<18;i++){const xx=80+i*47,yy=475-(30+power*115)+Math.sin(t*.8+i)*12;c.fillStyle=i%3?'#8832a4':'#f059a4';c.globalAlpha=.3+power*.5;c.fillRect(xx,yy,4+i%4,8+i%5);c.fillRect(xx,510,2,6);}c.globalAlpha=1;if(t>=51&&t<55){const radius=(t-51)*330;c.strokeStyle='#f7a3e9';c.lineWidth=3;c.globalAlpha=1-smooth((t-51)/4);c.beginPath();c.ellipse(720,390,radius,radius*.45,0,0,Math.PI*2);c.stroke();}if(t>=49&&t<54){for(let i=0;i<5;i++){const y=150+i*65;c.drawImage(g.c,0,y,g.w,3,Math.sin(t*12+i)*4,y,g.w,3);}}}
 c.globalAlpha=1;c.fillStyle='#030108';const bar=40*(t<2?smooth(t/2):t>69?1-smooth((t-69)/3):1);c.fillRect(0,0,g.w,bar);c.fillRect(0,g.h-bar,g.w,bar);
 const line=lines.find(q=>t>=q[0]&&t<q[0]+q[1]);if(line){const elapsed=t-line[0],text=line[2].slice(0,Math.floor(elapsed*36));c.fillStyle='#09040de8';c.fillRect(90,490,780,68);c.textAlign='center';c.fillStyle='#e77dbc';c.font='11px monospace';c.fillText('E D E N',480,507);c.fillStyle='#ffe6f6';c.font='16px monospace';const words=text.split(' ');let row='',y=530;for(const word of words){if(c.measureText(row+' '+word).width>710){c.fillText(row,480,y);row=word;y+=21;}else row+=(row?' ':'')+word;}c.fillText(row,480,y);}
 if(t>=64&&t<70){c.globalAlpha=smooth((t-64)/.8)*(1-smooth((t-68)/2));c.textAlign='center';c.fillStyle='#ffdcf4';c.font='bold 44px monospace';c.fillText('E D E N',480,215);c.font='15px monospace';c.fillText('A FORMA DE VIDA SUPREMA',480,245);}c.restore();}
const oldDraw=P.draw;P.draw=function(){const s=this.edenCinema;if(!s)return oldDraw.call(this);const c=this.x;c.save();c.fillStyle='#090410';c.fillRect(0,0,this.w,this.h);c.translate(480+s.panX,300+s.panY);c.scale(s.zoom,s.zoom);c.translate(-480,-300);try{oldDraw.call(this);}finally{c.restore();}overlay(this,s);};
const oldHud=P.updateHud;P.updateHud=function(){oldHud.call(this);const hud=document.querySelector('#bossHud');if(!hud)return;hud.classList.toggle('eden-intro-hidden',!!this.edenCinema&&this.edenCinema.time<67);};
DP.EdenCinematic={begin,finish,update,lines,stages,duration};
})();
