//Código para ler e processar o arquivo CSV. O código foi, em partes, desenvolvido pelo colega Adley junto com sua equipe. 
//Utilizamos parte do código criado por ele para realizar a leitura e parte do processamento do arquivo.

document.addEventListener("DOMContentLoaded", () => {
    // Caminho para o arquivo CSV
    const filePath = "../src/js/athlete_events.csv";

    // Função para processar o arquivo CSV
    const processarCSV = () => {
        fetch(filePath) //Busca o arquivo no servidor e retorna uma Promise com a resposta
            .then(response => response.text())
            .then(csvLinha => {
                /*O conteúdo do arquivo é passado como argumento para a função
                Divide o CSV em linhas, utilizando o padrão de separação ";;;;;;;;;;;;;;\n?"
                Isso significa que o separador é uma linha que contém múltiplos ';' seguidos por uma possível quebra de linha (/n)
                O [cabecalho, ...linhas] é uma técnica chamada "destructuring assignment" que divide o resultado da divisão do CSV em duas partes
                - cabecalho: a primeira linha (que contém o cabeçalho)
                - linhas: as linhas restantes (dados)*/

                    // Divide a string csvLinha em um array de linhas usando a quebra de linha como separador
                        const [cabecalho, ...linhas] = csvLinha.split('\n');

                        // Converte cada elemento do cabeçalho para letras minúsculas e remove as aspas duplas
                        const cabecalhoFormatado = cabecalho
                            .toLowerCase() // Converte para minúsculas
                            .split(',') // Divide os dados usando a vírgula como parâmetro
                            .map((elemento) => elemento.replace(/["]/g, "")); // Remove aspas duplas de cada elemento do cabeçalho

                        // Mapeia as linhas de dados para registros processados
                        const registros = linhas.map(linha => {
                            // Verifica se a linha é null ou vazia
                            if (!linha) return;

                            // Extrai os campos da linha usando uma expressão regular
                            const campos = linha.match(/(?:[^,"]+|"[^"]*")+/g);
                            
                            // Reduz os campos em um objeto de registro usando o cabeçalho formatado
                            return cabecalhoFormatado.reduce((objeto, campo, indice) => {
                                // Extrai o valor do campo e remove as aspas e barras invertidas
                                const valor = (typeof campos[indice] === 'string' ? campos[indice].replace(/^\\*"?|\\*"?$/g, '') : campos[indice]);
                                
                                // Verifica se o campo deve ser convertido para número e cria um novo objeto de registro
                                const novoObjeto = Object.assign({}, objeto, {
                                    [campo]: ['id', 'age', 'weight', 'year', 'height'].includes(campo) && !isNaN(parseFloat(valor)) ? parseInt(valor, 10) : valor
                                });
                                return novoObjeto;
                            }, {});
                        });

                        // Filtra apenas os registros de atletas do sexo feminino
                        const atletasF = registros.filter((atleta) => atleta && atleta.sex === 'F');

                        // Exibe os registros de atletas femininas no console
                        //console.log(femaleAthletes);      
                        const mediaAlturaAtletas = (esporte) => (atletas) => {
                            const alturasUnicas = atletas
                                .filter(atleta => atleta.height !== 'NA' && atleta.sport === esporte) // Corrigindo 'Height' para 'height' e 'Sport' para 'sport'
                                .map(atleta => parseFloat(atleta.height)) // Convertendo altura para número
                            const alturaFormatada = alturasUnicas.map((altura) => (altura / 100)) // Removendo o toFixed() para manter o número decimal
                            const somaAlturas = alturaFormatada.reduce((acc, altura) => acc + altura, 0) // Removendo parseFloat() pois já estamos trabalhando com números
                            const qtdeAtletas = alturasUnicas.length
                            const mediaAlturas = (somaAlturas / qtdeAtletas).toFixed(2).replace('.', ',') // Mantendo a formatação da média
                        
                            return `A média de altura das atletas da modalidade ${esporte} é ${mediaAlturas}m!`;
                        }
                        console.log(mediaAlturaAtletas('Judo')(atletasF))                
            })
            .catch(error => { // Chama o catch quando a promisse é rejeitada, e retorna um erro
                console.log('Ocorreu um erro ao processar o arquivo CSV: ', error);
            });
    };
    // Chama a função para processar o CSV quando o DOM estiver carregado
    processarCSV();
});
