# Regras das atividades

Comparação entre a régua da planilha do Author e a regra desta demanda. A aula de referência é a de habitats exportada do Author. A única alteração pedida é arrastar e soltar. O resto permanece como na planilha.

O Author ainda não aplica a regra nova. `LIMITES.ARRASTAR_SOLTAR` e a importação continuam com o teto antigo.

## Arrastar e soltar — o que muda

Régua da planilha, igual para 1 ou 2 coleções:

- no mínimo 1 coleção com itens
- no máximo 2 coleções
- no máximo 4 itens por coleção
- no máximo 2 distratores na atividade, sem limite por coleção
- item sem `[ref:C1]` ou `[ref:C2]` é aviso e é ignorado; não vira distrator
- coleção vazia é aviso e é ignorada

Teto da planilha na tela: 8 itens + 2 distratores = 10 peças.

### Com 2 coleções

Esta é a regra restrita:

- no máximo 3 itens por coleção
- no máximo 2 distratores na atividade
- no máximo 1 distrator por coleção

Itens e distratores não se misturam na conta. Os 3 são os itens da coleção. O distrator entra além deles, um em cada coleção.

Teto na tela: 6 itens + 2 distratores = 8 peças.

O que a planilha deixava passar e esta regra corta: 4 itens numa coleção, e os 2 distratores concentrados na mesma coleção.

### Com 1 coleção

- no máximo 4 itens
- no máximo 2 distratores
- total na tela: 6 peças

O teto de 1 distrator por coleção vale só para 2 coleções. Com 1 coleção os 2 distratores podem ficar juntos.

### O que não mudou neste tipo

- continua no máximo 2 coleções
- continua obrigatório ter coleção com itens
- distrator continua fora da lista de itens da coleção
- item sem referência continua inválido; não conta como distrator

## O que a aula de habitats usa

As duas atividades de arrastar e soltar da aula já cabem na regra de 2 coleções. Nenhuma usa distrator.

| Atividade | Coleções | Itens | Distratores |
| --- | --- | --- | --- |
| Classificar animais (nadam / terra) | 2 | 3 + 3 | 0 |
| Descrições de habitat (oceano / floresta) | 2 | 3 + 3 | 0 |

A proposta de interface mantém 3 + 3 e acrescenta distrator, ainda dentro do teto:

| Tela | Itens | Distratores | Cabe em 2 coleções |
| --- | --- | --- | --- |
| Arrastar imagens | 3 + 3 | 2 | sim, no limite de 8 peças |
| Arrastar habitats | 3 + 3 | 1 | sim |

A planilha não amarra distrator a coleção. O "1 por coleção" é restrição nova. Na proposta, os distratores estão soltos (`data-correct="none"`). O número cabe; a distribuição "um por coleção" ainda não está modelada.

## O que permanece

| Atividade | Regra da planilha | Aula de habitats |
| --- | --- | --- |
| Múltipla escolha | 2 a 6 alternativas, exatamente 1 correta | 4 alternativas, 1 correta |
| Selecionar imagem | 2 a 6 alternativas, exatamente 1 correta | 6 alternativas, 1 correta |
| Preenchimento | no máximo 4 respostas; cada uma com no máximo 10 palavras | 1 lacuna; respostas aceitas são variações de "habitat" |
| Organizar | 2 a 8 palavras | 8 palavras |
| Associar | 2 a 3 pares | 3 pares nas duas telas |
| Jogo da memória | 2 a 3 pares | 3 pares nas duas telas |

A proposta de interface repete essas quantidades: 4 alternativas, 6 imagens, 8 palavras, 3 pares em associar e 3 pares em memória.

Ponto de atenção no preenchimento: a importação da planilha limita cada resposta a 10 palavras. A constante da auditoria premium (`maxCaracteres: 10`) trata 10 como caracteres. São réguas diferentes. Esta demanda não mexe nisso; vale a da planilha, 10 palavras.

## Sugestão — correção ortográfica no Author Premium

O Author Premium não corrige nem aponta erro de ortografia no texto que o autor escreve (enunciado, alternativas, itens, pares, palavras).

Sugestão: incluir essa checagem no modo premium, no texto visível da aula, antes da publicação. É sugestão. Não altera as réguas desta demanda.
