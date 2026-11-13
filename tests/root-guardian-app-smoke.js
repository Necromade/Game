new Promise((resolve,reject)=>{
 let attempts=0;
 const wait=setInterval(()=>{
  if(!window.DP?.Game||!document.querySelector('#new')){if(attempts++>200){clearInterval(wait);reject(Error('App did not initialize'));}return;}
  clearInterval(wait);
  const errors=[];window.addEventListener('error',e=>errors.push(e.message));
  // Start through the real menu, substituting only the checkpoint location.
  const original=DP.Game.prototype.loadRoom;
  DP.Game.prototype.loadRoom=function(){const room=original.call(this,2);this.p.x=1850;this.p.y=478;window.rootGuardianSmokeGame=this;return room;};
  document.querySelector('#new').click();DP.Game.prototype.loadRoom=original;
  setTimeout(()=>{
   const g=window.rootGuardianSmokeGame,b=g?.room.enemies.find(e=>e.kind==='rootGuardian');
   if(g){g.running=false;g.draw();}
   const hudRect=document.querySelector('#bossHud').getBoundingClientRect(),shellRect=document.querySelector('#shell').getBoundingClientRect();const fits=hudRect.left>=shellRect.left-1&&hudRect.right<=shellRect.right+1&&getComputedStyle(document.querySelector('#game')).objectFit==='contain'; const ok=fits&&g?.index===2&&b?.introduced&&b?.rootGuardian?.clip&&document.querySelector('#bossHud').classList.contains('root-guardian')&&document.querySelector('#overlay').classList.contains('hidden')&&!errors.length;
   resolve((ok?'PASS':'FAIL')+' '+innerWidth+'x'+innerHeight+' real menu -> Floresta Experimental, active guardian, HUD inside viewport, preserved canvas aspect ratio. Runtime errors: '+JSON.stringify(errors));
  },2500);
 },100);
})
