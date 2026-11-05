(function(){
const puzzles=[
{title:'PORTA DE CONTENÇÃO',prompt:'Acesso liberado se energia está ativa E identificação é válida.',answers:['energia || identificação','energia && identificação','!energia && identificação'],correct:1,hint:'As duas condições precisam ser verdadeiras. && significa E.',explain:'&& exige que ambas as condições sejam verdadeiras. A porta destrava.'},
{title:'ROTINA DE MANUTENÇÃO',prompt:'O robô deve dar 3 passos. Qual condição termina após três execuções, começando em i = 0?',answers:['i < 3','i = 3','i > 3'],correct:0,hint:'O laço roda para 0, 1 e 2.',explain:'i < 3 executa exatamente três vezes: 0, 1 e 2.'},
{title:'CHAVE BINÁRIA',prompt:'O arquivo usa a chave 1010. Qual seu valor decimal?',answers:['8','10','12'],correct:1,hint:'Pesos da direita para esquerda: 1, 2, 4, 8.',explain:'1010₂ = 8 + 2 = 10. Dados decodificados.'},
{title:'FILTRO DE DADOS',prompt:'Qual estrutura guarda valores em sequência e permite acesso por índice?',answers:['Booleano','Array','Condicional'],correct:1,hint:'Imagine uma lista ordenada de valores.',explain:'Um array armazena uma sequência ordenada acessível por índice.'},
{title:'SOMA DE VERIFICAÇÃO',prompt:'Pacotes válidos têm número par. Qual condição identifica isso?',answers:['n % 2 === 0','n / 2 === 0','n % 2 === 1'],correct:0,hint:'% retorna o resto da divisão.',explain:'Resto zero ao dividir por dois indica número par.'},
{title:'MEMÓRIA VOLÁTIL',prompt:'Qual componente guarda temporariamente os dados dos programas em execução?',answers:['RAM','SSD','Placa de rede'],correct:0,hint:'Ela perde os dados quando o computador desliga.',explain:'A RAM mantém temporariamente os dados que a CPU está usando.'},
{title:'ENDEREÇO DE REDE',prompt:'Para que serve um endereço IP em uma rede?',answers:['Identificar um dispositivo','Aumentar a memória RAM','Compactar arquivos'],correct:0,hint:'Ele ajuda os dados a encontrar o destino.',explain:'O endereço IP identifica dispositivos e permite encaminhar dados na rede.'},
{title:'CÓPIA DE SEGURANÇA',prompt:'Qual prática ajuda a recuperar arquivos após uma falha no computador?',answers:['Backup periódico','Renomear a pasta','Limpar o histórico'],correct:0,hint:'Mantenha uma cópia separada dos arquivos importantes.',explain:'Backups periódicos permitem restaurar arquivos perdidos ou danificados.'},
{title:'FUNÇÃO',prompt:'Em programação, o que uma função costuma agrupar?',answers:['Instruções reutilizáveis','Somente imagens','Endereços de rede'],correct:0,hint:'Ela pode ser chamada sempre que aquela tarefa for necessária.',explain:'Funções agrupam instruções para executar tarefas reutilizáveis.'},
{title:'PROTEÇÃO DE CONTA',prompt:'Qual opção oferece uma camada extra de segurança além da senha?',answers:['Autenticação em dois fatores','Desativar atualizações','Usar a mesma senha'],correct:0,hint:'A confirmação usa um segundo método de verificação.',explain:'A autenticação em dois fatores exige uma segunda prova de identidade.'},
{title:'ARQUIVOS E PASTAS',prompt:'Qual é a função principal de uma pasta no sistema de arquivos?',answers:['Organizar arquivos','Executar a CPU','Conectar o Wi-Fi'],correct:0,hint:'Ela pode reunir itens relacionados.',explain:'Pastas organizam arquivos e outras pastas em uma estrutura.'},
{title:'NAVEGAÇÃO SEGURA',prompt:'Um site pede sua senha por um link inesperado. O que fazer?',answers:['Verificar o endereço e não informar a senha','Enviar a senha para confirmar','Baixar o anexo primeiro'],correct:0,hint:'Links inesperados podem tentar roubar credenciais.',explain:'Verifique o endereço do site e nunca informe senhas em links suspeitos.'},
{title:'PROCESSADOR',prompt:'Qual componente executa instruções e cálculos do computador?',answers:['CPU','SSD','Monitor'],correct:0,hint:'É conhecido como unidade central de processamento.',explain:'A CPU executa instruções e cálculos dos programas.'},
{title:'ATUALIZAÇÕES',prompt:'Por que instalar atualizações de segurança?',answers:['Corrigir falhas conhecidas','Apagar todos os arquivos','Desligar a rede'],correct:0,hint:'Atualizações fecham brechas exploráveis.',explain:'Atualizações corrigem vulnerabilidades e ajudam a proteger o sistema.'},
{title:'CRIPTOGRAFIA',prompt:'O que a criptografia faz com uma informação?',answers:['Transforma-a para restringir a leitura','Aumenta sua resolução','Duplica o tamanho da tela'],correct:0,hint:'Apenas quem tem a chave adequada deve conseguir ler.',explain:'A criptografia transforma os dados para que só pessoas autorizadas possam lê-los.'},
{title:'ESTRUTURA CONDICIONAL',prompt:'Quando um programa usa uma condição if?',answers:['Para escolher ações conforme uma condição','Para armazenar energia','Para desenhar uma placa'],correct:0,hint:'O programa verifica se uma expressão é verdadeira.',explain:'Uma estrutura if executa ações dependendo do resultado de uma condição.'},
{title:'ARMAZENAMENTO',prompt:'Qual destes dispositivos mantém arquivos mesmo após desligar o computador?',answers:['SSD','RAM','Cache da CPU'],correct:0,hint:'É um dispositivo de armazenamento permanente.',explain:'O SSD mantém arquivos salvos mesmo sem energia.'},
{title:'BUG E DEPURAÇÃO',prompt:'O que significa depurar um programa?',answers:['Encontrar e corrigir erros','Apagar o código-fonte','Aumentar o brilho da tela'],correct:0,hint:'A tarefa é investigar por que o programa não funciona como esperado.',explain:'Depurar é localizar e corrigir erros em um programa.'}
];

const modes=['commands','logic','logic','assembly','debug','assembly','network','commands','logic','security','files','security','assembly','security','security','logic','files','debug'];puzzles.forEach((q,i)=>q.mode=modes[i]);

window.DP=window.DP||{};DP.puzzles=puzzles;


})();

