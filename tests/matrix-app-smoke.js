new Promise((resolve,reject)=>{
 let attempts=0;
 const wait=setInterval(()=>{
  if(!window.DP?.Game||!document.querySelector('#new')){if(attempts++>200){clearInterval(wait);reject(Error('App did not initialize'));}return;}
  clearInterval(wait);
  const errors=[];window.addEventListener('error',e=>errors.push(e.message));
  // Start through the real menu, substituting only the checkpoint location.
  const original=DP.Game.prototype.loadRoom;
  DP.Game.prototype.loadRoom=function(){const room=original.call(this,4);this.p.x=1850;this.p.y=478;window.matrixSmokeGame=this;return room;};
  document.querySelector('#new').click();DP.Game.prototype.loadRoom=original;
  setTimeout(()=>{
   const g=window.matrixSmokeGame,b=g?.room.enemies.find(e=>e.kind==='matrix');
   if(g){g.running=false;g.draw();}
   const ok=g?.index===4&&b?.introduced&&b?.matrix?.clip&&document.querySelector('#bossHud').classList.contains('matrix')&&document.querySelector('#overlay').classList.contains('hidden')&&!errors.length;
   resolve((ok?'PASS':'FAIL')+' real index.html menu -> Cidade Submersa checkpoint -> active Matrix, sprite rendering and HUD. Runtime errors: '+JSON.stringify(errors));
  },2500);
 },100);
})
