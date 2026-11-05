(function(){
const screens={
 commands:`<div class="mini-terminal"><span>HELIX SHELL // USUÁRIO LOCAL</span><code>root@helix:~$ <b>_</b></code><small>Escolha a instrução que executa a tarefa.</small></div>`,
 logic:`<div class="mini-flow"><span>ENTRADA</span><i>→</i><span>CONDIÇÃO</span><i>→</i><span>SAÍDA</span></div>`,
 network:`<div class="mini-network"><span>HELIX</span><i></i><span>RELAY</span><i></i><span>EDEN</span></div>`,
 assembly:`<div class="mini-parts"><span>CPU</span><span>RAM</span><span>PLACA-MÃE</span><span>SSD</span></div>`,
 debug:`<pre class="mini-code"><em>01</em> if (sinal <b>!=</b> ATIVO) {\n<em>02</em>   reparar_conexao();\n<em>03</em> }</pre>`,
 security:`<div class="mini-security"><span>IDENTIDADE</span><i>+</i><span>PERMISSÃO</span><i>+</i><span>PROTEÇÃO</span></div>`,
 files:`<div class="mini-files"><span>ARQUIVOS</span><b>/</b><span>PASTAS</span><b>/</b><span>DADOS</span></div>`
};
const labels={commands:'TERMINAL DE COMANDOS',logic:'LÓGICA DE PROGRAMAÇÃO',network:'REDE E CONECTIVIDADE',assembly:'MONTAGEM DE COMPUTADORES',debug:'IDENTIFICAÇÃO DE ERROS',security:'SEGURANÇA DIGITAL',files:'SISTEMA DE ARQUIVOS'};
function render(q,index){const mode=screens[q.mode]?q.mode:'logic';return `<section class="minigame-display mode-${mode}" aria-label="${labels[mode]}"><header><span>${labels[mode]}</span><small>DESAFIO ${String(index+1).padStart(2,'0')}</small></header>${screens[mode]}<p>${q.prompt}</p><p id="quizFeedback" class="quiz-feedback" aria-live="polite">Selecione a resposta correta para sincronizar o terminal.</p></section>`}
window.DP=window.DP||{};DP.Minigames={render,labels};
})();
