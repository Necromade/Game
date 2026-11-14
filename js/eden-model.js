(function(){
'use strict';
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),arena={left:1480,right:2380,top:110,floor:520};
const clips={idle:8,floating:8,movement:8,attack_preparation:8,basic_attack:8,damage:8,recovery:8,teleport:8,transformation:8,death:12},sheets={};
for(let p=0;p<3;p++)for(const key in clips){const im=new Image();im.src=`assets/sprites/eden/p${p}_${key}.png?v=1`;sheets['p'+p+'_'+key]=im;}
for(const key of ['ring','fragment','core','tentacle','beam','singularity','burst']){const im=new Image();im.src='assets/sprites/eden/'+key+'.png?v=1';sheets[key]=im;}
const abilities={
 ABSOLUTE:{label:'RAIO ABSOLUTO // SAIA DA COLUNA',prepare:1.05,execute:.5,recover:.65,cooldown:4,phase:0},
 WAVE:{label:'ONDA CÓSMICA // PULE',prepare:.85,execute:1.8,recover:.6,cooldown:5,phase:0},
 BLADES:{label:'LÂMINAS ORBITAIS // AFASTE-SE',prepare:1,execute:1.2,recover:.7,cooldown:6,phase:0},
 PREDICTION:{label:'PREDIÇÃO // QUEBRE SUA TRAJETÓRIA',prepare:1.25,execute:.45,recover:.6,cooldown:5,phase:0},
 RAIN:{label:'CHUVA DE ENERGIA // ENCONTRE UM INTERVALO',prepare:1.2,execute:1.5,recover:.65,cooldown:7,phase:0},
 CORE:{label:'EXPLOSÃO DE NÚCLEO // RECUE',prepare:1.4,execute:.65,recover:.9,cooldown:7,phase:1},
 CLAW:{label:'GARRA CÓSMICA // SAIA DAS MARCAS',prepare:1.1,execute:1,recover:.7,cooldown:6,phase:1},
 PULSE:{label:'PULSO DIMENSIONAL // PULE AS ONDAS',prepare:1,execute:2,recover:.65,cooldown:7,phase:1},
 COLLAPSE:{label:'COLAPSO DIMENSIONAL // BUSQUE O CORREDOR SEGURO',prepare:1.65,execute:1,recover:.85,cooldown:9,phase:1},
 ADVANCED:{label:'PREDIÇÃO AVANÇADA // MUDE DE DIREÇÃO',prepare:1.35,execute:1.3,recover:.7,cooldown:7,phase:1},
 TOTAL:{label:'COLAPSO TOTAL // ATRAVESSE A ONDA COM ESQUIVA',prepare:1.8,execute:1.4,recover:1,cooldown:10,phase:2},
 JUDGMENT:{label:'JULGAMENTO CÓSMICO // FIQUE ENTRE OS FEIXES',prepare:1.4,execute:2.4,recover:.8,cooldown:8,phase:2},
 SINGULARITY:{label:'SINGULARIDADE // RESISTA À ATRAÇÃO',prepare:1.5,execute:3,recover:.8,cooldown:11,phase:2},
 ANNIHILATION:{label:'ANIQUILAÇÃO // FEIXES, ONDA E RAJADA',prepare:1.4,execute:3.8,recover:1.1,cooldown:13,phase:2}
};
function ensure(e){return e.eden||(e.eden={state:'DORMANT',timer:0,clock:0,phase:0,clip:'idle',anim:0,next:1,teleportCooldown:6,cooldowns:{},history:[],serial:0,zones:[],trails:[],particles:[],hit:0,fired:false,arenaActive:false,dialogue:-1,deathComplete:false});}
function enter(e,state){const m=ensure(e);m.state=state;m.timer=0;m.anim=0;m.fired=false;e.state=state.toLowerCase();m.clip=state==='INTRO'||state==='TRANSFORM'?'transformation':state==='DEATH'?'death':state==='TELEPORT'?'teleport':state==='RECOVER'?'recovery':state==='MOVE'?'movement':'floating';}
function core(e){return{x:e.x+e.w/2,y:e.y+e.h*.4};}
function hitbox(e){return{x:e.x+48,y:e.y+80,w:e.w-96,h:e.h-80};}
function sprite(c,key,frame,x,y,size,alpha=1,rotation=0){const im=sheets[key];if(!im?.complete||!im.naturalWidth)return;c.save();c.imageSmoothingEnabled=false;c.globalAlpha*=clamp(alpha,0,1);c.translate(Math.round(x),Math.round(y));c.rotate(rotation);c.drawImage(im,Math.floor(frame)*320,0,320,320,-size/2,-size/2,size,size);c.restore();}
DP.EdenModel={clamp,arena,clips,sheets,abilities,ensure,enter,core,hitbox,sprite};
})();
