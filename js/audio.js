(function(){
class AudioSystem{
 constructor(){this.ctx=null;this.master=null;this.enabled=true;this.musicTimer=null;this.musicStep=0}
 init(){if(this.ctx)return;try{this.ctx=new(window.AudioContext||window.webkitAudioContext)();this.master=this.ctx.createGain();this.master.gain.value=.2;this.master.connect(this.ctx.destination);for(const hz of [55,82.4]){let o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type="sine";o.frequency.value=hz;g.gain.value=.018;o.connect(g);g.connect(this.master);o.start()}}catch{this.enabled=false}}
 startMusic(){this.init();if(!this.ctx||this.musicTimer)return;this.ctx.resume?.();const notes=[110,130.81,164.81,146.83,110,98,123.47,146.83,164.81,146.83,123.47,110,98,110,130.81,146.83];this.musicStep=0;const playStep=()=>{if(!this.enabled||!this.ctx)return;const now=this.ctx.currentTime,step=this.musicStep++%notes.length;const o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type='triangle';o.frequency.setValueAtTime(notes[step],now);g.gain.setValueAtTime(.0001,now);g.gain.exponentialRampToValueAtTime(.035,now+.035);g.gain.exponentialRampToValueAtTime(.0001,now+.48);o.connect(g);g.connect(this.master);o.start(now);o.stop(now+.5);if(step%4===0){const bass=this.ctx.createOscillator(),bg=this.ctx.createGain();bass.type='sine';bass.frequency.value=notes[step]/2;bg.gain.setValueAtTime(.0001,now);bg.gain.exponentialRampToValueAtTime(.045,now+.06);bg.gain.exponentialRampToValueAtTime(.0001,now+.65);bass.connect(bg);bg.connect(this.master);bass.start(now);bass.stop(now+.7)}};playStep();this.musicTimer=setInterval(playStep,375)}
 stopMusic(){if(this.musicTimer){clearInterval(this.musicTimer);this.musicTimer=null}}
 tone(freq=220,duration=.08,type='square',volume=.08){if(!this.enabled)return;this.init();if(!this.ctx)return;let o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=type;o.frequency.setValueAtTime(freq,this.ctx.currentTime);g.gain.setValueAtTime(volume,this.ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,this.ctx.currentTime+duration);o.connect(g);g.connect(this.master);o.start();o.stop(this.ctx.currentTime+duration)}
 hit(){this.tone(90,.1,'sawtooth',.12)} jump(){this.tone(340,.09,'triangle',.07)} terminal(){this.tone(660,.12,'square',.035)} hurt(){this.tone(70,.22,'sawtooth',.15)}
}

window.DP=window.DP||{};DP.AudioSystem=AudioSystem;


})();


