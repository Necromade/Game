(function(){
class AudioSystem{
 constructor(){this.ctx=null;this.master=null;this.enabled=true}
 init(){if(this.ctx)return;try{this.ctx=new(window.AudioContext||window.webkitAudioContext)();this.master=this.ctx.createGain();this.master.gain.value=.2;this.master.connect(this.ctx.destination);for(const hz of [55,82.4]){let o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type="sine";o.frequency.value=hz;g.gain.value=.018;o.connect(g);g.connect(this.master);o.start()}}catch{this.enabled=false}}
 tone(freq=220,duration=.08,type='square',volume=.08){if(!this.enabled)return;this.init();if(!this.ctx)return;let o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=type;o.frequency.setValueAtTime(freq,this.ctx.currentTime);g.gain.setValueAtTime(volume,this.ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,this.ctx.currentTime+duration);o.connect(g);g.connect(this.master);o.start();o.stop(this.ctx.currentTime+duration)}
 hit(){this.tone(90,.1,'sawtooth',.12)} jump(){this.tone(340,.09,'triangle',.07)} terminal(){this.tone(660,.12,'square',.035)} hurt(){this.tone(70,.22,'sawtooth',.15)}
}

window.DP=window.DP||{};DP.AudioSystem=AudioSystem;


})();


