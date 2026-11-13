# Guardião das Raízes — O Último Ecossistema

Correção posterior de recortes, escala e elementos secundários: [CORRECAO-SPRITES.md](CORRECAO-SPRITES.md).

Chefe integrado à **Floresta Experimental**, região 2 da campanha. A antiga Floresta de Concreto foi renomeada no mesmo índice, preservando checkpoints, transições, inimigos comuns e progressão. O Guardião genérico foi substituído por uma única instância `rootGuardian`, perto da saída (x=2110).

## Arquivos criados

- `js/root-guardian-model.js`: estados de animação, temporização, compressão/extensão, brilho e fases.
- `js/root-guardian-physics.js`: saltos balísticos, patas plantadas na preparação, colisões, língua, raízes, ondas, esporos e física das criaturas menores.
- `js/root-guardian-ai.js`: escolha por distância, cooldowns, limites da arena, recuperação e invocações.
- `js/root-guardian-render.js`: corpo, olhos, língua, cipós, musgos, cogumelos, núcleo, efeitos e cenário da estação botânica abandonada.
- `js/root-guardian.js`: integração com dano, vida, HUD, morte, projéteis e descarte de objetos.
- `css/root-guardian.css`: retrato, barra, fases e apresentação responsiva. O canvas mantém sua proporção na região da floresta, com áreas livres quando necessário.
- `assets/sprites/enemies/root_guardian/`: 107 PNGs individuais, 12 spritesheets, retrato e manifesto.
- `assets/sprites/effects/root_guardian/`: 12 spritesheets de oito quadros para partes e efeitos.
- `tools/build-root-guardian.ps1`: extração reproduzível da referência irregular, remoção do fundo em gradiente e normalização pelos pés.
- `tests/root-guardian.html`, `tests/root-guardian-tests.js`, `tests/root-guardian-app-smoke.js`: testes de combate, animações e entrada pelo menu real.

## Arquivos modificados

- `js/world.js`: nome da região, objetivo, especificações e instância exclusiva do chefe e criaturas.
- `js/game.js`: encaminhamento para a IA do Guardião, cogumelos e criaturas; sistemas existentes permanecem responsáveis por dano, projéteis comuns e progressão.
- `index.html`: carrega módulos e estilo.
- `tests/audit.html`, `tests/governor.html`, `tests/governor-motion.html`, `tests/matrix.html`: incluem a nova integração para verificar compatibilidade.
- `tests/audit.js`: o teste de rajada do chefe genérico usa EDEN na segunda fase, pois a floresta agora tem um chefe próprio.
- `tools/browser-check.ps1`: permite escolher largura e altura do navegador; valores anteriores continuam sendo os padrões.

## Sprites

| Animação | Quadros |
| --- | ---: |
| IDLE, FLOAT, MOVE, JUMP | 8 cada |
| LAND | 5 |
| TONGUE_ATTACK | 10 |
| SPORE_ATTACK | 8 |
| ROOT_ATTACK, MUSHROOM_SUMMON | 10 cada |
| ULTIMATE | 16 |
| HIT | 4 |
| DEATH | 12 |

Corpo: RGBA 192×192, origem nos pés (96,164), virado à direita e espelhado conforme necessário. Partes/efeitos: RGBA 128×128, oito quadros. Os títulos foram excluídos por retângulos inspecionados por sequência; a imagem inteira não é usada como sprite.

A referência não contém todas as poses distintas anunciadas pelo pedido, nem uma sequência dedicada à língua. Os intermediários foram derivados com respiração, deformação controlada e colapso, usando poses existentes. A língua foi desenhada como uma extensão própria, combinada com poses de boca da referência. O manifesto registra as contagens de origem. Não se trata de 107 poses desenhadas individualmente na imagem original.

Um único quadro principal é desenhado por vez. Olhos, língua, raízes, cogumelos, musgos, núcleo, esporos e cipós têm animação independente. Os pés mantêm a origem durante a deformação do corpo.

## Comportamento

O deslocamento usa pequenos saltos: 0,22 segundo de preparação com as patas paradas, impulso e recuperação na aterrissagem. O salto maior tem 0,28 segundo de antecipação. A gravidade e o deslocamento usam delta time; não há movimento horizontal contínuo com o corpo parado no chão.

Língua Predatória fixa o alvo antes de estender uma cadeia com colisões próprias, aplica um golpe por extensão e retrai. Chuva de Esporos carrega os fungos e lança trajetórias diferentes com gravidade; esporos colidem com o jogador/estruturas e se desfazem no chão. Julgamento das Raízes avisa as posições antes de emergir e retrai com duração limitada.

A altura de colisão de cada raiz acompanha sua altura visível durante crescimento e retração. Raízes e ondas usam o recorte útil do efeito para que as margens transparentes não afastem o desenho do chão nem diminuam a onda em relação à sua colisão.

Colônia Fúngica cria cogumelos que crescem por 1,15 segundo antes de atacar; criaturas menores emergem e seguem o jogador por saltos, com vida, IA e animações próprias. Limites: dois cogumelos na fase 2, três na fase 3 e até quatro criaturas ativas. Todas as unidades têm tempo de vida.

Extinção Verde comprime o corpo por 0,85 segundo, executa um salto de aproximadamente 166 pixels de altura, marca a posição alcançável de impacto e aterrissa com sete raízes e ondas nos dois sentidos. O mergulho atravessa plataformas unidirecionais para concluir o impacto no chão, respeitando sólidos. Ondas baixas podem ser evitadas com salto; raízes têm seus próprios avisos.

Fases: Despertar acima de 70%; Colonização de 70% a 35%; Ecossistema Final até 35%. A última fase aumenta os fungos do corpo, expõe o núcleo, intensifica os olhos e reduz cooldowns. Há memória do ataque anterior e pausas de recuperação.

A arena acrescenta árvores, raízes sobre estruturas, equipamentos tomados pela vegetação, cogumelos, núcleos decorativos e iluminação verde/roxa. Esses elementos ficam atrás dos atores e dos avisos.

Morte: 12 quadros durante 1,8 segundo; língua, raízes, ondas, projéteis e invocações subordinadas são desativados. A saída continua condicionada ao fim das ondas e dos inimigos restantes, como antes. Trocar de sala descarta os objetos locais.

## Testes

`root-guardian-result.txt/.png`: suíte de animações, transparência de todos os quadros, física a 30/60/120 Hz, paredes/plataformas/limites, habilidades, colisões, crescimento, invocações, fases, morte e encerramento do combate. A batalha usa disparos reais do rifle; a vida do jogador é restaurada apenas no teste para observar todas as fases. Os testes individuais verificam o dano. Isso não substitui avaliação humana de dificuldade.

Entrada pelo menu real, HUD dentro da tela e proporção do canvas preservada: `root-guardian-desktop` (1280×900), `root-guardian-landscape` (800×450) e `root-guardian-mobile` (390×844), com resultados `.txt` e capturas `.png`.

As suítes anteriores do Governador, da Matriz e a auditoria geral verificam compatibilidade. A auditoria já possuía quatro falhas em expectativas de IDs, terminais, plataformas e golpe do executioner, registradas em `audit-baseline.txt`.

Resultado final no Edge: **25 testes do Guardião aprovados**, **21 da Matriz aprovados**, **14 de combate do Governador aprovados** e **18 de movimento do Governador aprovados**. Os três testes de resolução passaram, sem erros JavaScript. A auditoria geral mantém **29 aprovações e as mesmas quatro falhas preexistentes**, com saída igual à referência anterior.

Para repetir, abra `tests/root-guardian.html`. Para jogar, abra `index.html`. Para reconstruir os sprites, execute `tools/build-root-guardian.ps1 -Reference '<imagem>'`; o jogo usa os PNGs prontos e não depende da pasta Downloads.
