# Matriz Orgânica — organismo tecnológico

Atualização posterior da floresta: o antigo Guardião genérico agora possui implementação própria, documentada em [GUARDIAO-DAS-RAIZES.md](GUARDIAO-DAS-RAIZES.md). A região passou a se chamar Floresta Experimental, mantendo o índice 2.

Integrada à **Cidade Submersa**, perto da saída (x=2110), com uma única instância por sala. O encontro genérico dessa região foi substituído pela Matriz. O chefe genérico que tinha o nome Matriz na Floresta de Concreto foi preservado com o nome **Guardião das Raízes**, evitando duas entidades com a mesma identidade em regiões diferentes.

## Arquivos criados

- `js/matrix-model.js`: dados, animações, contagem de quadros, núcleo, abertura de placas e transições. Mantém o núcleo como origem e preserva a fase entre animações de flutuação/deslocamento.
- `js/matrix-ai.js`: estados, decisão por distância/fase/cooldowns, preparação, execução, recuperação e invocações.
- `js/matrix-physics.js`: deslocamento com inércia, flutuação suave, seis tentáculos independentes com colisões por segmentos, projéteis, conexões elétricas, raízes e drones.
- `js/matrix-render.js`: composição biomecânica do tronco, apêndices, cabos, placas, olhos artificiais e núcleo; avisos e efeitos da arena.
- `js/matrix.js`: integração com vida/dano, renderização, HUD, morte e limpeza de objetos.
- `css/matrix.css`: barra de vida, retrato e identificação das fases.
- `assets/sprites/matrix/`: 88 PNGs individuais, dez spritesheets de corpo, 12 spritesheets secundárias, retrato e `manifest.json`.
- `tools/build-matrix.ps1`: extração reproduzível da referência irregular, remoção do fundo preto, registro do núcleo, máscara do tronco e quadros derivados.
- `tests/matrix.html`, `tests/matrix-tests.js`, `tests/matrix-app-smoke.js`: testes do encontro e entrada pelo menu real.

## Arquivos modificados

- `js/world.js`: localização, nome, especificações e instância única da Matriz; pool de inimigos e geometria das regiões preservados.
- `js/game.js`: encaminha IA da Matriz/drones e permite uma reação opcional à colisão dos projéteis com estruturas (`onBlocked`). Projéteis comuns continuam usando a mesma lógica de dano e remoção.
- `index.html`: carrega os módulos e o estilo.
- `tests/audit.html`, `tests/governor.html`, `tests/governor-motion.html`: carregam também a integração da Matriz para verificar compatibilidade.
- `tests/audit.js`: o teste do chefe genérico foi transferido da região 4 para a região 2, que continua usando esse tipo de inimigo. A Matriz possui seus próprios testes de ataque; não é mais um chefe genérico.

## Sprites e anatomia

| Animação | Quadros integrados |
| --- | ---: |
| IDLE, FLOAT, MOVE | 8 cada |
| TENTACLE_ATTACK, ORGANIC_SHOT, SUMMON, ROOT_ATTACK | 8 cada |
| ULTIMATE | 16 |
| HIT | 4 |
| DEATH | 12 |

Quadros do corpo: RGBA de 192×192, origem (96,96) no núcleo. Partes e efeitos: RGBA de 128×128, oito quadros por spritesheet. Os retângulos foram inspecionados por sequência; não se supõe uma grade uniforme.

Os rótulos da referência anunciam mais quadros do que as poses distintas presentes em vários conjuntos. Os quadros faltantes foram derivados com respiração, pulsação emissiva e desintegração progressiva; as contagens originais e finais estão no manifesto. Não são 88 poses desenhadas individualmente na imagem original.

O corpo usa um único quadro principal. Os tentáculos externos da imagem são retirados da máscara do tronco e substituídos por seis cadeias articuladas com segmentos metálicos, tecido e pontas próprias. Cabos, placas, núcleo e olhos usam seus próprios relógios/fases. Não se desenha a referência completa como sprite nem duas animações principais sobrepostas.

## Combate

- **Nervos de Aço:** seis apêndices com curvas e colisões individuais; três atacam na fase inicial, quatro na integração e seis na fusão. Cada golpe tem antecipação e recuperação, com alvo fixado antes da investida.
- **Infecção de Circuito:** projéteis orgânicos usam as colisões existentes. Ao tocar plataformas, sólidos ou o chão, criam conexões elétricas com pelo menos 0,85 segundo de aviso. Pontos presos acompanham estruturas móveis e desaparecem quando a estrutura deixa de existir.
- **Assimilação Mecânica:** dois drones na fase 2 e três na fase 3; possuem vida, movimento, disparos, animação de morte e limite de duração próprios.
- **Raízes de Titânio:** três ou cinco estruturas emergem de superfícies, com indicadores prévios e colisões separadas.
- **Fusão Absoluta:** núcleo e placas abrem progressivamente, a anatomia se expande e uma área de 265 pixels de raio é avisada por 2,25 segundos antes da descarga. Há recuperação após a liberação.

As fases mudam em 70% e 40% de vida. Cooldowns separados, memória do último ataque, limites de alcance, frenagem antes de habilidades e pausas de recuperação controlam as combinações.

Pontos de infecção são limitados a seis, drones a três, raízes têm vida finita e a descarga tem uma única instância. A morte limpa perigos e projéteis pertencentes ao chefe, desativa suas invocações e reproduz 12 quadros durante 1,8 segundo. Os tentáculos retraem. A liberação da saída continua obedecendo às ondas e inimigos restantes da sala. Trocas de sala descartam os objetos anteriores.

## Testes e evidências

Abra `tests/matrix.html` para repetir a suíte de IA, física, animações e combate. O teste de batalha usa rifle, colisões, dano e cooldowns reais, restaurando a vida do jogador para observar todas as fases; a aplicação normal não recebe essa restauração. Os testes individuais verificam o dano das habilidades. Isso não substitui avaliação humana de dificuldade.

Resultados: `matrix-result.txt`; captura: `matrix-result.png`. Entrada pelo menu real: `matrix-app-result.txt/.png`. A auditoria geral e os testes do Governador também são executados para verificar compatibilidade; a auditoria já tinha quatro falhas registradas em `audit-baseline.txt`.

Resultado final: **21 testes da Matriz aprovados**, **14 testes de combate do Governador aprovados** e **18 testes de movimento do Governador aprovados**, sem erros JavaScript nas suítes. A auditoria geral manteve **29 aprovações e as mesmas quatro falhas anteriores** (expectativas antigas de IDs, terminais e plataformas, além do golpe pesado do executioner). O teste genérico de rajada continua passando em uma região que mantém o chefe genérico.

Reconstrução dos assets: `tools/build-matrix.ps1 -Reference '<caminho da imagem>'`. O jogo usa os PNGs gerados e não depende da pasta Downloads.
