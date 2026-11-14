new Promise((resolve,reject)=>{
 let attempts=0;
 const wait=setInterval(()=>{
  if(!window.DP?.Game||!document.querySelector('#new')){if(attempts++>200){clearInterval(wait);reject(Error('App did not initialize'));}return;}
  clearInterval(wait);
  const errors=[];window.addEventListener('error',e=>errors.push(e.message));
  // Start through the real menu, substituting only the checkpoint location.
  const frames=new Set(),draw=CanvasRenderingContext2D.prototype.drawImage;
  CanvasRenderingContext2D.prototype.drawImage=function(im,...args){if(Object.values(DP.Colossus.sheets).includes(im))frames.add(im.src+':'+args[0]);return draw.call(this,im,...args);};
  const original=DP.Game.prototype.loadRoom;
  DP.Game.prototype.loadRoom=function(){const room=original.call(this,3);this.p.x=1850;this.p.y=478;window.governorSmokeGame=this;return room;};
  document.querySelector('#new').click();DP.Game.prototype.loadRoom=original;
  setTimeout(()=>{
   const g=window.governorSmokeGame,b=g?.room.enemies.find(e=>e.kind==='colossus');
   if(g){g.running=false;g.draw();}CanvasRenderingContext2D.prototype.drawImage=draw;
   const ok=g?.index===3&&b?.introduced&&b?.colossus&&document.querySelector('#bossHud').classList.contains('colossus')&&document.querySelector('#overlay').classList.contains('hidden')&&!errors.length&&frames.size>=3;
   resolve((ok?'PASS':'FAIL')+' real index.html menu -> Núcleo Industrial checkpoint -> active Colossus, sprite rendering and HUD. Animated body frames: '+frames.size+'. Runtime errors: '+JSON.stringify(errors));
  },2500);
 },100);
})
