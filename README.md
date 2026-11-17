# DEAD PROTOCOL
### Documentação Técnica — Sistema de Jogo Web 2D

![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-orange)
![Platform](https://img.shields.io/badge/Platform-Web-blue)
![Language](https://img.shields.io/badge/JavaScript-ES6%2B-yellow)
![License](https://img.shields.io/badge/License-A%20definir-lightgrey)

---

## 1. Descrição do Projeto

**DEAD PROTOCOL** é uma aplicação interativa desenvolvida para navegadores web, estruturada como um jogo eletrônico 2D que combina elementos de Roguelike, Action Platformer, exploração ambiental e progressão baseada em combate.

O sistema foi concebido utilizando tecnologias nativas de desenvolvimento web, com foco na implementação de mecânicas em tempo real, gerenciamento de entidades, processamento de eventos, detecção de colisões e controle de estados de execução.

A aplicação apresenta um ambiente pós-apocalíptico no qual o jogador controla um protagonista que desperta anos após sua morte, assumindo uma forma esquelética em um mundo dominado por estruturas tecnológicas, organismos modificados e sistemas automatizados.

Além de suas mecânicas convencionais de exploração e combate, o projeto incorpora desafios relacionados à disciplina de Redes de Computadores, integrando perguntas de múltipla escolha à progressão do jogador.

## 2. Objetivos Técnicos

O desenvolvimento tem como finalidade aplicar conceitos fundamentais de engenharia de software e programação, contemplando:

- Desenvolvimento de aplicações web interativas.
- Implementação de lógica de jogo utilizando JavaScript.
- Manipulação e renderização de elementos gráficos 2D.
- Gerenciamento de entidades e objetos.
- Implementação de sistemas de colisão e física de movimentação.
- Controle de estados e eventos de execução.
- Desenvolvimento de inteligência comportamental para inimigos.
- Implementação de sistemas de combate e progressão.
- Integração de estruturas de dados para armazenamento e validação de perguntas.
- Aplicação de conhecimentos de Redes de Computadores em mecânicas interativas.

## 3. Stack Tecnológica

| Tecnologia | Responsabilidade |
|---|---|
| HTML5 | Estruturação da aplicação e elementos da interface |
| CSS3 | Estilização, layout e apresentação visual |
| JavaScript ES6+ | Implementação da lógica de negócio e mecânicas |
| Canvas API | Renderização gráfica 2D, caso utilizada |
| Git | Controle de versão do código-fonte |
| GitHub | Versionamento e hospedagem do repositório |
| OpenAI Codex | Assistência no desenvolvimento, refatoração e depuração |

A aplicação tem como objetivo funcionar em navegadores modernos, sem necessidade de instalação de um cliente executável.

## 4. Arquitetura do Sistema

A organização lógica do DEAD PROTOCOL é baseada na separação de responsabilidades entre os subsistemas da aplicação.

### 4.1. Game Manager

Responsável pelo gerenciamento global do estado de execução do jogo.

Principais atribuições:

- Inicialização dos sistemas.
- Controle do estado atual da partida.
- Gerenciamento de transições entre fases.
- Controle de pausa e reinicialização.
- Integração entre os diferentes módulos.
- Gerenciamento do ciclo principal de execução.

### 4.2. Player System

Subsistema responsável pela representação e pelo controle do personagem principal.

Funcionalidades:

- Processamento de entrada do teclado.
- Movimentação horizontal e vertical.
- Controle de velocidade e aceleração.
- Detecção de colisões.
- Gerenciamento de pontos de vida.
- Processamento de ataques.
- Controle dos estados de animação.
- Gerenciamento de morte e reaparecimento, quando aplicável.

### 4.3. Combat System

Responsável pelo processamento das interações de combate.

Operações principais:

- Identificação de alvos.
- Detecção de áreas de ataque.
- Validação de colisões ofensivas.
- Cálculo e aplicação de dano.
- Atualização dos atributos das entidades.
- Controle de intervalos entre ataques.
- Gerenciamento dos estados de combate.

### 4.4. Enemy System

Subsistema destinado ao gerenciamento das entidades adversárias.

Cada inimigo pode possuir parâmetros específicos, como:

- Pontos de vida.
- Velocidade de movimentação.
- Dano causado.
- Distância de detecção.
- Comportamento de perseguição.
- Padrões de ataque.
- Estados de animação.

O comportamento dos inimigos pode ser estruturado por meio de máquinas de estados finitos (Finite State Machines — FSM), permitindo controlar transições entre estados como repouso, patrulhamento, perseguição, ataque e recebimento de dano.

### 4.5. Boss System

Responsável pelo gerenciamento dos chefes de fase.

O subsistema contempla a possibilidade de:

- Atributos próprios de resistência e dano.
- Padrões de ataque específicos.
- Controle de fases de combate.
- Transições entre comportamentos.
- Animações exclusivas.
- Gerenciamento de barras de vida.
- Eventos associados ao início e encerramento do confronto.

### 4.6. Animation System

Responsável pelo gerenciamento da representação visual das entidades.

Suas atribuições incluem:

- Carregamento de sprites.
- Seleção de quadros de animação.
- Controle de velocidade de reprodução.
- Transições entre animações.
- Sincronização entre movimentação e animação.
- Gerenciamento de estados visuais.

O controle adequado dos quadros de animação é importante para evitar inconsistências visuais durante movimentos, ataques e transições de estado.

### 4.7. World System

Responsável pela estruturação e pelo gerenciamento dos ambientes.

Funcionalidades:

- Carregamento dos cenários.
- Gerenciamento de plataformas e obstáculos.
- Detecção de colisões ambientais.
- Distribuição de entidades.
- Controle de elementos interativos.
- Gerenciamento da progressão entre regiões.

### 4.8. Quiz System

Subsistema responsável pela integração dos conteúdos de Redes de Computadores à jogabilidade.

Suas responsabilidades incluem:

- Armazenamento das questões.
- Exibição dos enunciados.
- Apresentação das alternativas.
- Identificação da resposta selecionada.
- Validação da resposta.
- Retorno visual ao jogador.
- Acionamento do sistema de recompensas.

### 4.9. Reward System

Responsável pelo processamento e pela aplicação das recompensas obtidas durante a partida.

O sistema deve realizar a comunicação com os atributos do jogador, permitindo que uma resposta correta produza alterações efetivas na jogabilidade.

Exemplos de operações:

- Recuperação de vida.
- Modificação temporária de dano.
- Recuperação de energia.
- Aplicação de efeitos defensivos.
- Desbloqueio de habilidades.
- Concessão de equipamentos.

---

## 5. Ciclo de Execução (Game Loop)

A execução de um jogo em tempo real depende de um ciclo contínuo de atualização e renderização.

Conceitualmente, o ciclo principal do DEAD PROTOCOL pode ser representado pelas seguintes etapas:

1. Captura dos eventos de entrada do usuário.
2. Atualização do estado do personagem.
3. Processamento da movimentação e física.
4. Verificação de colisões.
5. Atualização dos comportamentos dos inimigos.
6. Processamento dos eventos de combate.
7. Atualização dos elementos do cenário.
8. Renderização dos elementos gráficos.
9. Repetição do ciclo enquanto a partida estiver ativa.

Quando utilizada, a API `requestAnimationFrame()` permite sincronizar a atualização visual com o ciclo de renderização do navegador.

## 6. Gerenciamento de Estados

O sistema utiliza o conceito de estados para controlar diferentes situações da aplicação.

Entre os estados previstos estão:

| Estado | Descrição |
|---|---|
| MENU | Tela inicial e opções de partida |
| PLAYING | Execução normal da partida |
| PAUSED | Suspensão temporária da execução |
| QUIZ | Exibição de desafios educacionais |
| COMBAT | Situação de confronto, quando controlada separadamente |
| GAME OVER | Encerramento por derrota |
| VICTORY | Encerramento por vitória |

A utilização de estados permite controlar quais operações podem ser executadas em cada momento, evitando conflitos entre sistemas e eventos simultâneos.

## 7. Estrutura de Progressão

A progressão é organizada por regiões com características ambientais, inimigos e desafios próprios.

### 7.1. Regiões do jogo

| Região | Caracterização |
|---|---|
| Laboratório Esquecido | Instalação científica abandonada |
| Distrito Zero | Área urbana devastada |
| Núcleo Industrial | Complexo tecnológico e automatizado |
| Cidade Submersa | Região urbana dominada pela água |
| EDEN | Confronto final relacionado à inteligência tecnológica |

### 7.2. Escalonamento de dificuldade

A progressão de dificuldade considera a introdução gradual de novos desafios.

Os parâmetros que podem ser utilizados incluem:

- Quantidade de inimigos.
- Resistência das entidades.
- Dano dos adversários.
- Velocidade de movimentação.
- Frequência de ataques.
- Complexidade dos padrões de combate.
- Variação das combinações de inimigos.

O objetivo é estabelecer uma curva de dificuldade progressiva, preservando o equilíbrio entre desafio e capacidade de evolução do jogador.

## 8. Sistema Educacional — Redes de Computadores

O projeto incorpora um módulo educacional destinado à aplicação prática dos conhecimentos de Redes de Computadores.

O sistema utiliza perguntas de múltipla escolha durante a partida, integrando avaliação de conhecimento e progressão.

### 8.1. Especificação funcional

Cada questão deve conter:

- Identificador único.
- Enunciado.
- Quatro alternativas.
- Índice da alternativa correta.
- Identificação do resultado da validação.

O banco de questões deve possuir pelo menos dez perguntas diferentes, exclusivamente relacionadas à disciplina de Redes de Computadores.

### 8.2. Fluxo de processamento

O processamento de uma questão segue a sequência:

1. Acionamento de um evento que solicita uma questão.
2. Seleção de uma questão disponível.
3. Exibição do enunciado e das alternativas.
4. Recebimento da resposta do jogador.
5. Comparação da resposta com o gabarito.
6. Identificação do resultado.
7. Exibição de feedback.
8. Acionamento da recompensa, caso a resposta esteja correta.
9. Retorno à execução normal da partida.

### 8.3. Conteúdos contemplados

- Modelo OSI.
- Arquitetura TCP/IP.
- Endereçamento IPv4 e IPv6.
- Máscaras de sub-rede.
- Protocolos de comunicação.
- DNS e DHCP.
- HTTP e HTTPS.
- Endereços MAC.
- Protocolo ARP.
- NAT.
- Equipamentos de interconexão.
- Topologias de rede.
- Segurança de redes.

## 9. Tratamento de Eventos e Colisões

O processamento de eventos é responsável por interpretar as ações do usuário e as interações entre as entidades do jogo.

O sistema deve considerar:

- Eventos de teclado.
- Eventos de interação.
- Colisões entre personagem e cenário.
- Colisões entre ataques e inimigos.
- Colisões entre entidades.
- Eventos de transição entre fases.
- Eventos de morte e conclusão de objetivos.

A detecção de colisões pode utilizar estruturas geométricas, como retângulos delimitadores (Bounding Boxes), dependendo da implementação.

O tratamento adequado desses eventos é essencial para manter a consistência das mecânicas e evitar comportamentos inesperados.

## 10. Organização e Manutenção do Código

O desenvolvimento deve seguir princípios de organização e legibilidade, buscando reduzir o acoplamento entre os subsistemas.

Práticas recomendadas:

- Separação de responsabilidades.
- Reutilização de funções.
- Padronização de nomenclatura.
- Modularização quando aplicável.
- Centralização de parâmetros configuráveis.
- Tratamento de exceções.
- Evitar duplicação de lógica.
- Controle de dependências entre sistemas.

Essa abordagem facilita a manutenção, a identificação de erros e a expansão futura da aplicação.

## 11. Requisitos de Execução

### 11.1. Requisitos de software

- Navegador atualizado com suporte a HTML5, CSS3 e JavaScript.
- Sistema operacional compatível com o navegador utilizado.
- Servidor HTTP local quando necessário pela estrutura de módulos e carregamento de recursos.

### 11.2. Execução local

1. Clonar o repositório:

```bash
git clone URL_DO_REPOSITORIO
```

2. Acessar o diretório:

```bash
cd DEAD-PROTOCOL
```

3. Abrir a pasta no editor de código.

4. Executar o projeto utilizando um servidor local, caso necessário.

5. Acessar o endereço local disponibilizado pelo servidor no navegador.

**Observação:** o nome do diretório e o procedimento de inicialização devem corresponder à estrutura efetiva do repositório.

## 12. Publicação e Distribuição

O projeto pode ser disponibilizado por meio do GitHub Pages ou de outra plataforma compatível com aplicações web estáticas.

A publicação deve disponibilizar:

- Arquivos HTML.
- Folhas de estilo CSS.
- Scripts JavaScript.
- Recursos gráficos.
- Sprites e animações.
- Arquivos de áudio, quando existentes.
- Demais dependências necessárias.

O ambiente publicado deve permitir a execução do jogo sem exigir que o usuário instale ferramentas de desenvolvimento ou execute comandos manualmente.

## 13. Testes e Validação

A validação do projeto deve contemplar testes funcionais e verificações de estabilidade.

| Sistema | Verificação |
|---|---|
| Inicialização | Carregamento correto da aplicação |
| Movimentação | Resposta adequada aos comandos |
| Colisões | Detecção e tratamento de impactos |
| Combate | Aplicação correta de dano |
| Inimigos | Funcionamento dos comportamentos |
| Chefes | Transições e padrões de ataque |
| Animações | Sincronização dos sprites |
| Progressão | Transição adequada entre fases |
| Questionário | Validação correta das respostas |
| Recompensas | Aplicação efetiva dos benefícios |
| Interface | Exibição adequada dos elementos |
| Reinicialização | Restabelecimento do estado inicial |

Os testes devem ser realizados em diferentes situações de execução, buscando identificar falhas de lógica, inconsistências gráficas e problemas de integração entre os subsistemas.

## 14. Desenvolvimento Assistido por IA

O OpenAI Codex foi utilizado como ferramenta de assistência durante o desenvolvimento.

Sua aplicação no processo de engenharia de software contempla:

- Apoio à implementação de funcionalidades.
- Análise de estruturas de código.
- Identificação de problemas.
- Refatoração de componentes.
- Otimização de rotinas.
- Aperfeiçoamento de sistemas gráficos.
- Desenvolvimento de comportamentos de entidades.
- Apoio à implementação de mecânicas.

A utilização da ferramenta é complementar ao processo de desenvolvimento. A análise, validação e compreensão das implementações permanecem sob responsabilidade do desenvolvedor.

## 15. Considerações Finais

O DEAD PROTOCOL constitui uma aplicação prática de desenvolvimento web orientada à criação de um sistema interativo em tempo real.

Sua implementação reúne conceitos de programação estruturada e modular, gerenciamento de estados, processamento de eventos, renderização gráfica, manipulação de entidades e desenvolvimento de interfaces.

A integração do módulo de Redes de Computadores amplia a aplicação educacional do projeto, transformando conhecimentos teóricos em elementos funcionais de uma experiência interativa.

O projeto busca demonstrar a utilização de tecnologias web na construção de aplicações complexas, considerando organização arquitetural, funcionalidade, manutenção e possibilidade de expansão.

---

## 16. Informações do Projeto

| Campo | Informação |
|---|---|
| Nome | DEAD PROTOCOL |
| Categoria | Jogo Web 2D |
| Gênero | Roguelike / Ação / Exploração |
| Plataforma | Navegadores Web |
| Linguagens | HTML, CSS e JavaScript |
| Ferramenta de apoio | OpenAI Codex |
| Repositório | Inserir URL do GitHub |
| Publicação | Inserir URL do jogo |
| Documentação | README.md |

---

**DEAD PROTOCOL — SYSTEM DOCUMENTATION**  
*Technical documentation of the web-based game application.*
