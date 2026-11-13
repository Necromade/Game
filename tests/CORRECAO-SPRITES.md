# Correção dos sprites do Guardião e do Governador

## Defeitos encontrados

Os retângulos de várias poses do Guardião atravessavam a separação entre personagens na referência. A sequência de movimento tem nove poses visíveis com larguras diferentes; os recortes anteriores cortavam o próprio corpo e incluíam pedaços do vizinho. Havia também normalização de tamanho pela altura de cada recorte, fazendo o corpo mudar de escala.

No Governador, poses de ataque também incluíam partes vizinhas. O ciclo repetia o início da ação dentro dos oito quadros. A renderização ainda dividia o corpo em triângulos e fazia leitura de pixels do canvas para corrigir poses, o que podia gerar deformações e falhar ao abrir arquivos locais com restrições de origem.

Os testes anteriores conferiam quantidade, dimensões, transparência e funcionamento da batalha, mas não detectavam os recortes semanticamente errados. A nova prancha visual mostra as poses completas, renderizadas pelo mesmo código do jogo.

## Correções

- Novos limites individuais dos recortes do Guardião em todas as sequências, preservando uma escala de pixels comum e a origem nos pés.
- Remoção de componentes soltos e resíduos do fundo. Partes secundárias não incluem mais pedaços opacos de pele/patas retirados do retrato.
- Cogumelos adicionais presos às costas; eles não ficam mais suspensos acima do corpo.
- Língua e esporos usam poses corporais completas e consistentes. Efeitos permanecem separados do corpo.
- Ataque do Governador com máscaras para excluir os personagens vizinhos e ordem progressiva de preparação, execução e retorno.
- Canhão com margem superior suficiente para não cortar o capacete.
- Um único desenho inteiro do corpo do Governador por frame; removida a malha de triângulos e a leitura de pixels do canvas. Inclinação e compressão têm limites conservadores.
- Giro sem esmagar o sprite; pés alinhados na geração dos PNGs.
- Proporção do canvas preservada também no Distrito Zero. As URLs dos PNGs receberam revisão para invalidar o cache antigo.

## Arquivos

Modificados: `tools/build-root-guardian.ps1`, `tools/build-governor.ps1`, `js/root-guardian-render.js`, `js/root-guardian-model.js`, `js/governor.js`, `js/governor-motion.js`, `css/governor.css` e os PNGs gerados de ambos os personagens. A lógica de habilidades, dano, fases e progressão foi preservada.

Novos: `tests/sprite-repair.html`, `tests/sprite-repair.js` e a prancha/resultados `sprite-repair-result.png/.txt`.

## Verificação

A prancha contém 64 amostras de movimento, língua, esporos, ultimate, caminhada, corrida, ataque e canhão. Foi inspecionada visualmente após a correção.

Os três novos testes exigem um único desenho inteiro do Governador, funcionamento sem leitura de pixels e ausência de avanço/reinício de animação durante a renderização. As suítes existentes do Guardião (25 testes), combate do Governador (14) e movimento (18) incluem batalhas automatizadas completas. Como antes, a vida do jogador é restaurada apenas no teste de batalha para exercitar todas as fases.

Resultado: **60 verificações aprovadas**, além da entrada pelo menu real nos dois encontros, sem erros JavaScript. A inspeção visual foi feita sobre os quadros compostos, não apenas sobre o número ou a transparência dos arquivos.
