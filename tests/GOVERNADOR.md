# Governador Mecânico — O Regente de Ferro

Aprimoramento posterior de física, rig e transições: [GOVERNADOR-MOVIMENTO.md](GOVERNADOR-MOVIMENTO.md). Os PNGs documentados abaixo foram preservados.

Integrado à instância `governor` já existente no Distrito Zero, perto da saída (x=2110). A aproximação a 640 pixels inicia o encontro. A criação da sala continua responsável por instanciar uma única unidade; não existe um segundo gerador de chefes.

## Arquivos

- `js/governor.js`: máquina de estados, movimentação, ataques, drones, animações, colisões especiais, transições, integração de dano/morte e HUD.
- `js/game.js`: dois encaminhamentos de IA para governador/drone e exclusão do escudo genérico na renderização desse chefe.
- `index.html`: carrega o módulo e `css/governor.css`.
- `assets/sprites/governor/`: 106 PNGs individuais, 14 spritesheets de personagem, 9 spritesheets secundárias e `manifest.json`.
- `tools/build-governor.ps1`: recortes manuais da referência irregular, remoção do fundo por segmentação conectada às bordas, normalização e geração dos quadros derivados.
- `tests/governor.html` e `tests/governor.js`: teste automatizado de combate e visualização da fase final.
- `tests/audit.html`: carrega também o novo módulo; as asserções da auditoria existente foram preservadas.
- `tools/browser-check.ps1`: execução e captura via Chrome DevTools Protocol do Edge headless.
- `tests/app-smoke.js`: inicia pelo menu real de `index.html`, usando somente uma localização de checkpoint de teste no Distrito Zero.

As alterações que já estavam em `js/world.js`, `js/audio.js` e `js/main.js` foram preservadas. A sala já declarava as especificações e a instância `governor`; essa integração foi reutilizada.

## Arte

| Animação | Quadros |
| --- | ---: |
| IDLE, WALK, RUN | 8 cada |
| TURN | 4 |
| JUMP | 6 |
| FALL, LAND | 4 cada |
| ATTACK, CANNON, SHIELD, SUMMON_DRONES | 8 cada |
| ULTIMATE | 16 |
| HIT | 4 |
| DEATH | 12 |

Todos os quadros do personagem usam RGBA de 160×160, origem (80,142), voltados à direita. O jogo espelha uma única imagem por quadro quando necessário. A origem permanece presa aos pés. As poses foram extraídas por retângulos inspecionados individualmente, sem assumir uma grade da referência. As transições de giro, salto, queda, aterrissagem, impacto e morte são derivações progressivas das poses disponíveis; não são sequências completas originalmente presentes na referência. IDLE usa respiração/núcleo; WALK e RUN usam conjuntos distintos de poses; ATTACK inclui um arco de golpe próprio.

Elementos secundários: drone, projétil, peça do canhão, escudo, feixe, explosão, partículas, núcleo e carregamento. Cada arquivo tem oito quadros de 128×192. Colisões usam dados de jogo, nunca a área transparente do arquivo.

## Combate

Fase 1: acima de 70%, avanço, golpe próximo e canhão com preparação. Depois do canhão, aproxima-se para variar a distância de combate.

Fase 2: de 70% a 40%, escudo por 4,5 segundos, dois drones e áreas marcadas com feixes escalonados. Cooldowns independentes e memória do último especial impedem repetições imediatas desses especiais.

Fase 3: até 40%, três drones, cinco disparos, intervalos menores, núcleo intenso, atmosfera vermelha temporária e Supremacia. A descarga avisa por 2,15 segundos, atinge raio de 245 pixels e termina em recuperação. Os feixes avisam por pelo menos 1,05 segundo.

Morte: 1,5 segundo / 12 quadros; drones subordinados e projéteis hostis são desativados, marcações e descarga são removidas. A saída continua obedecendo à progressão original, incluindo inimigos/ondas restantes. Troca de sala descarta os objetos da sala anterior.

## Verificação no Microsoft Edge

`governor-result.txt`: **14 testes aprovados, zero falhas**, incluindo movimento/direção/salto, canhão, escudo e expiração, drones, feixes, Supremacia, limites de fase, HUD, seleção de quadros, colisões, morte e limpeza. A batalha completa usa disparos reais do rifle, IA e colisões normais. A vida do jogador é restaurada durante esse teste automatizado para observar todas as fases; os testes individuais verificam o dano recebido. Isso valida funcionamento, não substitui avaliação humana de dificuldade.

`app-smoke-result.txt`: menu real → checkpoint no Distrito Zero → chefe ativo, sprites e barra especial; nenhum erro JavaScript. Capturas: `governor-result.png` e `app-smoke-result.png`.

Auditoria geral: **29 aprovados e quatro falhas preexistentes**, com saída idêntica antes e depois desta integração. Evidências: `audit-baseline.txt` e `audit-result.txt`. As falhas são: teste que espera IDs sequenciais, preparação do golpe do executioner, contagem antiga de terminais e restrições antigas de altura das plataformas. Nenhum desses sistemas foi reescrito para acomodar o chefe.

Para repetir a suíte, abra `tests/governor.html` no navegador. Para capturar via CDP, inicie Edge headless com `--remote-debugging-port=9237 --allow-file-access-from-files` usando um perfil exclusivo de teste e execute `tools/browser-check.ps1`. Os testes não devem usar o perfil pessoal do navegador.

Para reconstruir os PNGs, execute `tools/build-governor.ps1 -Reference '<caminho da referência>'`. O jogo usa os PNGs já gerados; não depende do arquivo em Downloads.
