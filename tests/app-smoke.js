new Promise((resolve,reject)=>{
 let attempts=0;
 const wait=setInterval(()=>{
  if(!window.DP?.Game||!document.querySelector('#new')){if(attempts++>200){clearInterval(wait);reject(Error('App did not initialize'));}return;}
  clearInterval(wait);
  const errors=[];window.addEventListener('error',e=>errors.push(e.message));
  // Start through the real menu, substituting only the checkpoint location.
  const original=DP.Game.prototype.loadRoom;
  DP.Game.prototype.loadRoom=function(){const room=original.call(this,1);this.p.x=1850;this.p.y=478;window.governorSmokeGame=this;return room;};
  document.querySelector('#new').click();DP.Game.prototype.loadRoom=original;
  setTimeout(()=>{
   const g=window.governorSmokeGame,b=g?.room.enemies.find(e=>e.kind==='governor');
   if(g){g.running=false;g.draw();}
   const ok=g?.index===1&&b?.introduced&&b?.govAnim&&document.querySelector('#bossHud').classList.contains('governor')&&document.querySelector('#overlay').classList.contains('hidden')&&!errors.length;
   resolve((ok?'PASS':'FAIL')+' real index.html menu -> Distrito Zero checkpoint -> active Governor, sprite rendering and HUD. Runtime errors: '+JSON.stringify(errors));
  },2500);
 },100);
})
