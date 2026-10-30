(function(){
const puzzles=[
{title:'PORTA DE CONTENÇÃO',prompt:'Acesso liberado se energia está ativa E identificação é válida.',answers:['energia || identificação','energia && identificação','!energia && identificação'],correct:1,hint:'As duas condições precisam ser verdadeiras. && significa E.',explain:'&& exige que ambas as condições sejam verdadeiras. A porta destrava.'},
{title:'ROTINA DE MANUTENÇÃO',prompt:'O robô deve dar 3 passos. Qual condição termina após três execuções, começando em i = 0?',answers:['i < 3','i = 3','i > 3'],correct:0,hint:'O laço roda para 0, 1 e 2.',explain:'i < 3 executa exatamente três vezes: 0, 1 e 2.'},
{title:'CHAVE BINÁRIA',prompt:'O arquivo usa a chave 1010. Qual seu valor decimal?',answers:['8','10','12'],correct:1,hint:'Pesos da direita para esquerda: 1, 2, 4, 8.',explain:'1010₂ = 8 + 2 = 10. Dados decodificados.'},
{title:'FILTRO DE DADOS',prompt:'Qual estrutura guarda valores em sequência e permite acesso por índice?',answers:['Booleano','Array','Condicional'],correct:1,hint:'Imagine uma lista ordenada de valores.',explain:'Um array armazena uma sequência ordenada acessível por índice.'},
{title:'SOMA DE VERIFICAÇÃO',prompt:'Pacotes válidos têm número par. Qual condição identifica isso?',answers:['n % 2 === 0','n / 2 === 0','n % 2 === 1'],correct:0,hint:'% retorna o resto da divisão.',explain:'Resto zero ao dividir por dois indica número par.'}
];

window.DP=window.DP||{};DP.puzzles=puzzles;


})();

