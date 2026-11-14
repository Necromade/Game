(function(){
'use strict';
const M=DP.EdenModel,A=DP.EdenAI,R=DP.EdenRender,{ensure,enter,arena,clamp}=M,proto=DP.Game.prototype;
DP.enemySpecs.eden={size:[260,300],hp:1800,damage:24,speed:30,flying:true};
DP.regions[5].boss='EDEN // A FORMA SUPREMA';
const make=DP.makeRoom;DP.makeRoom=function(index,run=0){const room=make(index,run);if(index!==5)return room;
 room.enemies=room.enemies.filter(e=>e.kind!=='boss');const e=DP.createEnemy('eden',5,2030,205,room.seed+99,{boss:true});e.id='eden-'+room.id;e.hp=e.max=1800;room.enemies.push(e);room.edenArena={...arena};
 room.platforms=room.platforms.filter(p=>p.x<1480);for(const [i,x,y,w] of [[0,1570,450,100],[1,1725,385,115],[2,1900,440,100],[3,2220,450,115]])room.platforms.push({id:'eden-platform-'+i,x,y,w,h:12,material:'glass',active:true,motion:i===1?{amplitude:8,speed:.7,phase:0}:null,collapseDelay:0});room.exit={x:2324,y:478};room.climbables=room.climbables.filter(p=>p.x<1480);room.hazards=room.hazards.filter(h=>h.x<1480);return room;};
proto.updateEden=function(e,dt){dt=clamp(Number.isFinite(dt)?dt:0,0,.05);const m=ensure(e),clip=m.clip,phase=m.phase,frame=Math.floor(m.anim*(clip==='basic_attack'?12:8))%M.clips[clip];A.update(this,e,dt);if(m.clip!==clip||m.phase!==phase){m.previousPose={key:'p'+phase+'_'+clip,frame};m.blend=.12;}else m.blend=Math.max(0,(m.blend||0)-dt);};
const damage=proto.damage;proto.damage=function(e,n,pulse=false){if(e?.kind!=='eden')return damage.call(this,e,n,pulse);const m=ensure(e);if(['DORMANT','INTRO','TRANSFORM','DEATH'].includes(m.state)||e.hp<=0||!Number.isFinite(n)||n<=0)return false;
 // Clamp at each threshold so a powerful hit cannot skip a complete form.
 const floor=m.phase===0?e.max*.5:m.phase===1?e.max*.25:.001;
 const amount=Math.min(n,Math.max(0,e.hp-floor));if(amount<=0)return false;const result=damage.call(this,e,amount,pulse);if(result){m.hit=.18;m.next=Math.min(m.next,.25);if(e.hp<=.0011&&m.phase===2){A.clear(this,e);enter(e,'DEATH');e.deathAnim=4.8;m.arenaActive=true;this.emit('toast','EDEN // FIM DA ERA TECNOLÓGICA');}else if(e.hp<=e.max*(m.phase===0?.5:.25)&&m.phase<2)A.phase(this,e,m.phase+1);}return result;};
function finish(g,e){damage.call(g,e,1,true);e.deathAnim=0;g.room.edenDefeated=true;g.room.edenRemnant=e;g.emit('toast','EDEN SILENCIOU // ACESSE O TERMINAL FINAL [E]');}
const hitbox=DP.Art.hitbox;DP.Art.hitbox=function(e,index){return e.kind==='eden'?M.hitbox(e):hitbox(e,index);};
const drawEnemy=DP.Art.drawEnemy;DP.Art.drawEnemy=function(c,e,index,x,t){if(e.kind==='eden')return R.enemy(c,e,x);return drawEnemy(c,e,index,x,t);};
const backdrop=DP.Art.drawBackdrop;DP.Art.drawBackdrop=function(c,index,cam,t,w,h){backdrop(c,index,cam,t,w,h);R.backdrop(c,index,cam,t,w,h);};
const ground=DP.Art.drawGround;DP.Art.drawGround=function(c,index,w,h){ground(c,index,w,h);if(index!==5)return;c.save();c.fillStyle='#491341';c.fillRect(0,520,w,3);for(let i=0;i<w;i+=48){c.fillStyle=i%96?'#812553':'#ec408c';c.fillRect(i,530,24,2);c.fillStyle='#28122c';c.fillRect(i+24,536,2,30);}c.restore();};
const update=proto.update;proto.update=function(dt){update.call(this,dt);if(!this.running)return;if(this.index!==5){this.edenCamera=null;return;}const e=this.room.enemies.find(e=>e.kind==='eden');if(!e){this.edenCamera=null;return;}const m=ensure(e);if(m.arenaActive&&!m.deathComplete){this.p.x=clamp(this.p.x,arena.left,arena.right-this.p.w);const target=1440;this.edenCamera=(this.edenCamera??this.camera)+(target-(this.edenCamera??this.camera))*(1-Math.exp(-4*clamp(dt,0,.05)));this.camera=this.edenCamera;}else this.edenCamera=null;};
const draw=proto.draw;proto.draw=function(){const e=this.index===5?(this.room.enemies.find(e=>e.kind==='eden')||this.room.edenRemnant):null;R.current=e;try{draw.call(this);if(e&&!ensure(e).deathComplete)R.overlay(this,e);}finally{R.current=null;}};
const hud=proto.updateHud;proto.updateHud=function(){hud.call(this);const el=document.querySelector('#bossHud');if(!el)return;const e=this.room.enemies.find(e=>e.kind==='eden'&&e.hp>0&&e.introduced);el.classList.toggle('eden',!!e);if(e){const m=ensure(e);document.querySelector('#bossName').textContent='EDEN // A FORMA SUPREMA';el.dataset.phase=['I // OBSERVAÇÃO','II // ASCENSÃO','III // TRANSCENDÊNCIA'][m.phase];el.dataset.subtitle=m.state==='DEATH'?'COLAPSO DO SISTEMA':M.abilities[m.state]?.label||'INTELIGÊNCIA ALÉM DO HUMANO';}};
DP.Eden={...M,...A,finish};
})();
