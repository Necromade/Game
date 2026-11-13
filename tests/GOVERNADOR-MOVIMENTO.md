# Governador Mecânico — aprimoramento de movimento

**Correção posterior:** a malha e a leitura de pixels descritas no histórico abaixo foram substituídas por renderização de um quadro inteiro, após identificação de defeitos nos sprites. Estado atual: [CORRECAO-SPRITES.md](CORRECAO-SPRITES.md).

Os 106 quadros originais e os arquivos PNG foram preservados. O aprimoramento atua na física, na seleção de quadros e em uma malha de deformação aplicada a um único quadro principal.

## Implementação

- `js/governor-motion.js` (novo): aceleração e frenagem com integração exponencial, inércia de reversão, rig de cabeça/ombros/braços/capa, inclinação, compressão, contato dos pés, controle de passada, etapas dos ataques e aterrissagem.
- `js/governor.js`: a IA solicita uma velocidade em vez de alterar diretamente a posição. Há frenagem para posicionar ataques, pausas após habilidades, distância própria para cada especial, giro com antecipação e bloqueio contra alternância rápida de direção.
- `index.html`, `tests/audit.html` e `tests/governor.html`: carregam o controlador antes do módulo do chefe.
- `tests/governor.js`: os testes de salto e feixes agora exigem preparação, em vez de esperar execução instantânea.
- `tests/governor-motion.html` / `tests/governor-motion-tests.js` (novos): testes de movimento e estudo visual das poses.

Não houve substituição do chefe, reconstrução dos sprites nem alteração dos demais inimigos.

## Movimento e transições

A velocidade sobe gradualmente; ao parar ou inverter a direção, o deslocamento continua durante a frenagem. Colisões com paredes e os limites da arena bloqueiam o movimento. Saltos têm 0,2 segundo de preparação; queda, colisão superior com sólidos, aterrissagem em plataformas e recuperação de 0,44 segundo são tratadas separadamente. Ao caminhar para fora de uma plataforma, o chefe entra em queda.

Walk e Run usam a distância efetivamente percorrida para avançar a passada, com histerese entre os dois ritmos. Poeira e impactos dos pés vêm dos contatos da passada. Ficar bloqueado em uma parede não faz o chefe continuar correndo no lugar.

A capa usa uma mola amortecida, com subpassos de até 1/120 segundo. Cabeça, ombros e braços têm respostas próprias; o braço do canhão recebe recuo. A inclinação acompanha velocidade e aceleração. Abertura de placas e pulsação do núcleo acompanham a preparação e recuperação das habilidades.

As trocas de animação preservam a fase da passada entre Walk e Run. Uma correção transitória de pontos anatômicos aproxima a pose de entrada da pose anterior e decai suavemente. Não existe sobreposição entre animações principais: uma malha de 40 triângulos deforma regiões distintas do mesmo quadro. Efeitos de energia continuam sendo camadas secundárias.

O contato real das botas é calculado por quadro e armazenado em cache para compensar margens diferentes nos recortes. A compressão horizontal já presente nos quadros de TURN é compensada antes da rotação mais suave do rig. Os PNGs permanecem intactos.

## Habilidades

| Habilidade | Preparação | Execução | Recuperação |
| --- | --- | --- | --- |
| Ataque próximo | 0–0,58 s | 0,58–0,72 s | 0,72–0,95 s |
| Decreto de Execução | 0–0,70 s | 0,70–1,20 s | 1,20–1,65 s |
| Autoridade Absoluta | 0–0,58 s | 0,58–0,80 s | 0,80–1,10 s |
| Vigilância Total | 0–0,58 s | 0,58–1,05 s | 1,05–1,70 s |
| Ordem de Extermínio | 0–0,40 s | 0,40–2,05 s | 2,05–2,65 s |
| Protocolo de Supremacia | 0–2,15 s | 2,15–2,65 s | 2,65–3,40 s |

Ordem de Extermínio só cria marcações depois da preparação, preservando pelo menos 1,05 segundo de aviso antes do primeiro feixe. O escudo só reduz dano depois de formado. A morte interrompe a velocidade e não reinicia a animação.

## Verificações no Edge

- **18 testes de movimento aprovados**, zero falhas: aceleração, frenagem, equivalência de deslocamento a 30/60/120 Hz, giro, estabilidade das animações, passada, salto, impacto, paredes, saída de plataformas, alcance da IA, etapas das habilidades, recuo, aviso dos feixes, placas, renderização de um único clipe, silhueta do giro, morte e desempenho.
- **14 testes de combate aprovados**, incluindo batalha completa nas três fases e remoção de objetos. A vida do jogador é restaurada nesse teste para exercitar todas as fases; os testes individuais verificam o dano. Isso não substitui avaliação humana de dificuldade.
- Entrada pelo menu real de `index.html`, checkpoint no Distrito Zero, chefe ativo e HUD: aprovada, sem erros JavaScript.
- Auditoria geral: 29 aprovações; as mesmas quatro falhas preexistentes registradas em `audit-baseline.txt`, sem novas falhas.

A medição de renderização do chefe está em `governor-motion-result.txt`; ela mede o custo de CPU nesse navegador, não garante a taxa de quadros em outros dispositivos.

Resultados e capturas: `governor-motion-result.txt/.png`, `governor-result.txt/.png` e `app-smoke-result.txt/.png`. Para repetir o estudo de movimento, abra `tests/governor-motion.html` no navegador. Para jogar, use `index.html` normalmente.
