(async function(){
const sleep=ms=>new Promise(r=>setTimeout(r,ms));for(let i=0;i<200&&!document.querySelector('#new');i++)await sleep(50);
const errors=[];window.addEventListener('error',e=>errors.push(e.message));let g;const load=DP.Game.prototype.loadRoom;
DP.Game.prototype.loadRoom=function(){const r=load.call(this,5);this.p.x=1510;this.p.y=478;g=this;return r;};document.querySelector('#new').click();DP.Game.prototype.loadRoom=load;
g.room.enemies=g.room.enemies.filter(e=>e.kind==='eden');g.room.spawn.remaining=0;g.room.spawn.scheduled=null;g.update(.016);if(!g.edenCinema)throw Error('intro missing');
window.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));window.dispatchEvent(new KeyboardEvent('keydown',{key:'q',bubbles:true,cancelable:true}));
if(!document.querySelector('#overlay').classList.contains('hidden'))throw Error('accidental pause');
for(let i=0;i<1450;i++){g.update(.05);if(i%120===0)g.draw();}await sleep(500);
if(g.edenCinema||document.body.classList.contains('eden-cinema'))throw Error('locked at end');
if(g.audio?.master&&Math.abs(g.audio.master.gain.value-(g.data.settings?.volume??.2))>.01)throw Error('volume not restored');
if(!g.audio.musicTimer)throw Error('boss music missing');
if(!g.startDodge())throw Error('controls not restored');
if(errors.length)throw Error(errors.join('; '));
g.draw();return 'PASS real menu, keyboard interception, 72s simulation, Web Audio music/volume restoration, HUD and dodge after cinematic. No runtime errors.';
})();
