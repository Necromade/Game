(function(){
const weapons=[
 {id:'wrench',name:'Chave de manutenção',kind:'melee',damage:16,reach:31,cooldown:.18,windup:.045,active:.07,color:'#b4d5c6',description:'Confiável e equilibrada.'},
 {id:'plasma',name:'Espada de plasma',kind:'melee',damage:18,reach:39,cooldown:.14,windup:.025,active:.085,color:'#62f5c8',description:'Cortes rápidos com alcance ampliado.'},
 {id:'axe',name:'Machado industrial',kind:'melee',damage:34,reach:50,cooldown:.55,windup:.22,active:.12,color:'#ffb35e',description:'Lento, pesado e capaz de quebrar defesas.'},
 {id:'twin',name:'Lâminas duplas',kind:'melee',damage:12,reach:33,cooldown:.09,windup:.02,active:.055,color:'#d3a3ff',description:'Combos velozes; cada golpe causa menos dano.'},
 {id:'pistol',name:'Pistola energética',kind:'ranged',damage:15,reach:0,cooldown:.31,windup:.045,active:.04,projectile:{speed:420,radius:4,color:'#73cfff'},description:'Disparo preciso de baixo custo.'},
 {id:'rifle',name:'Rifle experimental',kind:'ranged',damage:9,reach:0,cooldown:.13,windup:.025,active:.035,automatic:true,projectile:{speed:500,radius:3,color:'#83ffcd'},description:'Fogo contínuo enquanto J estiver pressionado.'},
 {id:'coil',name:'Canhão eletromagnético',kind:'ranged',damage:38,reach:0,cooldown:.8,windup:.18,active:.04,energyCost:12,projectile:{speed:370,radius:8,color:'#70c9ff'},description:'Projétil pesado que atravessa alvos.'},
 {id:'unstable',name:'Arma de energia instável',kind:'ranged',damage:30,reach:0,cooldown:.62,windup:.12,active:.04,energyCost:8,projectile:{speed:440,radius:6,color:'#ff6e9e'},description:'Alto impacto e consumo de energia.'}
];
window.DP=window.DP||{};DP.weapons=weapons;
})();
