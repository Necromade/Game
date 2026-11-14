(async function(){
const sleep=ms=>new Promise(r=>setTimeout(r,ms));for(let i=0;i<200&&!document.querySelector('#new');i++)await sleep(50);
async function until(fn){for(let i=0;i<3600;i++){if(fn())return;await sleep(50);}throw Error('Timed out waiting for game state');}
const errors=[],frames=new Set();window.addEventListener('error',e=>errors.push(e.message));
const load=DP.Game.prototype.loadRoom,draw=CanvasRenderingContext2D.prototype.drawImage;let g;
DP.Game.prototype.loadRoom=function(){const r=load.call(this,5);this.p.x=1710;this.p.y=478;g=this;window.edenSmokeGame=this;return r;};
CanvasRenderingContext2D.prototype.drawImage=function(im,...args){if(Object.values(DP.Eden.sheets).includes(im))frames.add(im.src+':'+args[0]);return draw.call(this,im,...args);};
document.querySelector('#new').click();DP.Game.prototype.loadRoom=load;
try{
 const e=g.room.enemies.find(q=>q.kind==='eden');if(!e||!g.room.enemies.some(q=>!q.boss))throw Error('final room integration');
 // Isolate the encounter after validating that the approach enemies exist.
 g.room.enemies=[e];g.room.spawn.remaining=0;g.room.spawn.scheduled=null;g.p.invuln=100;
 await until(()=>e.eden&&!['DORMANT','INTRO'].includes(e.eden.state));
 g.damage(e,99999);await until(()=>e.eden.phase===1&&e.eden.state!=='TRANSFORM');
 g.damage(e,99999);await until(()=>e.eden.phase===2&&e.eden.state!=='TRANSFORM');
 if(!document.querySelector('#bossHud').classList.contains('eden')||frames.size<30)throw Error('HUD or frozen sprites '+frames.size);
 g.damage(e,99999);await until(()=>g.room.clearReported&&g.room.edenDefeated);
 g.p.x=2324;g.p.y=478;window.dispatchEvent(new KeyboardEvent('keydown',{key:'e'}));window.dispatchEvent(new KeyboardEvent('keyup',{key:'e'}));
 if(!document.querySelector('[data-ending="reboot"]'))throw Error('existing ending screen not reached');
 if(errors.length)throw Error(errors.join('; '));
 return 'PASS real menu -> final arena -> intro -> three forms -> cinematic death -> existing ending choices. Distinct sprite frames: '+frames.size+'. Runtime errors: []';
}finally{CanvasRenderingContext2D.prototype.drawImage=draw;}
})();
