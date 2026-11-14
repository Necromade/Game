# Colosso da Fábrica

Integrado ao Núcleo Industrial (índice 3), substituindo apenas o chefe genérico. As duas fases são etapas da mesma batalha: despertar e sobrecarga aos 50% de vida. Os chefes das outras regiões e as ondas industriais são preservados.

`js/colossus.js` concentra máquina de estados, temporização, colisões e renderização, seguindo a extensão de `DP.Game` usada pelos outros chefes. Reutiliza dano, invulnerabilidade, esquiva, experiência, projéteis do jogador e teste de segmento existente. O raio sai do núcleo e fixa a direção durante a preparação; não acompanha o jogador durante o disparo.

As nove spritesheets transparentes ficam em `assets/sprites/colossus`. As poses vêm das duas referências fornecidas, recortadas com remoção de fundo e alinhadas pelos pés, usando escala constante por sequência. A morte usa desmonte de oito faixas do sprite, queda, explosões e desativação do núcleo; as referências não incluem uma sequência de morte desenhada. Fumaça, núcleo, vapor, ondas e energia são efeitos animados em Canvas. As partículas locais são limitadas a 64.

Para reconstruir os sprites:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File tools/build-colossus.ps1 -Reference "caminho/Folha de sprites do Colosso da Fábrica.png" -Design "caminho/Ficha de Design do Colosso da Fábrica.png"
```

Abra `tests/colossus.html` para testar as duas fases, cada ataque, transparência e poses distintas, avisos, colisões, salto sobre ondas e raio, combinações, paredes, dano, morte e uma batalha completa com disparos reais. `tests/colossus-app-smoke.js` verifica a integração pelo menu de `index.html`. `tests/colossus-regression.html` executa a auditoria geral com o módulo novo carregado.

A auditoria geral apresenta quatro falhas que também constam no resultado anterior `tests/audit-result.txt`: identidade de inimigos entre salas, antecipação do executioner, quantidade de terminais e altura das plataformas. Nenhuma foi introduzida pela integração do Colosso.
