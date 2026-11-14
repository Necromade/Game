# EDEN — A forma suprema

## Apresentação cinematográfica

`eden-cinematic.js` acrescenta uma apresentação de 72 segundos: suspense (0–4), manifestação dos anéis e olho (4–8), materialização (8–10), diálogo com oito falas e pausas, demonstração sem dano (49–55), veredicto (55–64), título e música (64–69) e devolução dos controles (69–72). A câmera usa translação e escala uniforme; o corpo mantém suas proporções. Texto, efeitos e câmera compartilham o relógio da simulação. Pausar a simulação congela toda a sequência.

As falas são legendadas, com sinais eletrônicos sintetizados; não há voz gravada. Web Audio reduz a trilha ambiente e restaura o volume escolhido pelo jogador. A apresentação respeita o áudio desativado. A entrada de combate inicia uma sequência musical própria.

O bloqueio inclui teclado, comandos de combate, interação e dano. A simulação de combate fica suspensa durante a apresentação. `room.edenIntroPlayed` pertence apenas à instância da sala: não grava um bloqueio permanente no save. Um checkpoint ou uma nova tentativa cria uma nova entrada; sair da sala limpa a câmera, os controles e os nós de áudio. O término não altera as escolhas nem o progresso salvo.

`tests/eden-cinematic.html` cobre estados, câmera, proteção contra dano, restauração, reentrada, pausa e cruzamento do limite da arena. `tools/check-eden-cinema.ps1` testa o menu real, teclado, Web Audio, HUD e esquiva após simular os 72 segundos.

EDEN substitui apenas o chefe genérico da região 5. Os inimigos da aproximação, ondas, terminais, equipamentos, checkpoints, outros cinco chefes e escolhas de encerramento continuam usando os sistemas existentes.

## Integração

- `eden-model.js`: 37 spritesheets, dez sequências por forma, limites da arena e hitbox.
- `eden-ai.js`: máquina de estados, 14 habilidades, avisos, colisão e seleção de padrões por forma.
- `eden-render.js`: corpo, olho, anéis, fragmentos, apêndices articulados, fundo em profundidade, rastros, distorção e cinematográficas.
- `eden.js`: construção da sala, despacho de atualização, dano, câmera, HUD e conclusão da batalha.

O único novo despacho no núcleo do combate é `updateEden`. Projéteis, dano, esquiva, invulnerabilidade, armas, plataformas, experiência e recompensas são reutilizados. As colisões dos ataques são calculadas nas mesmas coordenadas usadas para desenhar seus avisos.

## Escala e arena

A entidade mede 260 × 300 unidades no mundo, maior que o colosso de 180 × 230. O protagonista mantém sua hitbox de 30 × 42. O corpo é desenhado proporcionalmente em um quadro de 320 × 320; a envoltória dos anéis e fragmentos alcança aproximadamente 440 unidades. A escala maior que 3,5 vezes foi escolhida para cumprir a prioridade de superar os chefes existentes.

A arena ocupa x=1480–2380 e mantém o chão em y=520. Quatro plataformas próprias oferecem caminhos de esquiva. A câmera converge para x=1440 durante a batalha, enquadrando toda a arena sem reduzir o personagem. O corpo e sua envoltória ficam dentro dos limites. O acesso ao encerramento usa o terminal existente em x=2324.

## Formas e leitura dos ataques

Observação (100–50%): raio em coluna, onda baixa que pode ser pulada, lâminas em movimento, predição baseada em velocidade e chuva em colunas espaçadas.

Ascensão (50–25%): explosão circular, três impactos de garra, ondas sucessivas, colapso com corredor seguro e três previsões escalonadas. Transformação de 3,6 segundos cancela os ataques anteriores.

Transcendência (25–0%): onda circular expansiva que exige esquiva, julgamento em feixes alternados, singularidade com atração limitada e aniquilação combinando feixes, onda e rajada. Novas poses, anéis e fragmentos são adicionados à configuração do corpo.

Predições fixam seu alvo ao começar o aviso. Elas não seguem o jogador durante a execução. Ataques não se repetem consecutivamente; cada habilidade tem recarga própria. Receber dano mantém o ataque em andamento e reduz a espera de retaliação. As mudanças de fase limitam o dano ao limiar correspondente, impedindo que um golpe elimine uma forma inteira.

## Animações e imagens

As duas imagens fornecidas são usadas localmente por `tools/build-eden.ps1`: a ficha com fundo preto fornece as poses e efeitos; a segunda fornece o olho central. Os recortes removem o fundo escuro, mantêm proporção e usam reamostragem por vizinho mais próximo. Sequências combinam poses da referência com deslocamento e rotação registrados; não são quadros inéditos desenhados individualmente. Anéis, olho, fragmentos e apêndices têm relógios e trajetórias independentes.

Cada forma contém `idle`, `floating`, `movement`, `attack_preparation`, `basic_attack`, `damage`, `recovery`, `teleport`, `transformation` e `death`. O flash de dano é uma sobreposição curta que não interrompe a IA. A renderização nunca avança os relógios da simulação.

Reconstrução: `powershell -NoProfile -ExecutionPolicy Bypass -File tools/build-eden.ps1 -Reference "imagem principal.png" -Design "segunda ficha.png"`.

## Morte e progressão

O golpe final inicia um colapso de 4,8 segundos. Ataques e projéteis pertencentes ao chefe são removidos, os anéis perdem estabilidade, o olho se apaga, fragmentos caem e o corpo desaparece. A vida permanece em um valor residual até o fim da sequência, preservando o bloqueio existente da saída. Só então o sistema normal concede recompensa e libera o terminal e as escolhas originais do final.

## Limites e validação

Máximo de 36 zonas de ataque simultâneas e cinco rastros; as rajadas têm no máximo sete projéteis. Zonas e projéteis expiram e são removidos ao trocar de forma, morrer ou sair da sala. Não há leitura de pixels durante a batalha; os recortes são preparados previamente.

`tests/eden.html` executa carregamento, transparência, sequências, cada um dos 14 ataques, avisos, dano, zonas seguras, predição, atração, limiares, retaliação, teleporte, câmera, armas, morte, limpeza e uma batalha com disparos reais.

`tools/check-eden-app.ps1` verifica o menu real, entrada, três formas, morte e acesso às escolhas existentes de encerramento. O teste isola o chefe depois de confirmar a presença dos inimigos da aproximação; a batalha completa sem invulnerabilidade ainda precisa de avaliação humana para ajuste fino de dificuldade.
