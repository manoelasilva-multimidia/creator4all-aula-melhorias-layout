# Creator4all Premium — Aula sobre animais e habitats

Proposta de interface para uma aula interativa do Creator4all. O aluno percorre o conteúdo, responde atividades sobre animais e seus habitats e vê o resultado no final.

A aula roda no navegador, sem build e sem dependências. Um shell em `index.html` carrega cada tela em um iframe e controla navegação, pontuação e feedback.

## Como abrir

As telas são carregadas em um iframe, então abra por um servidor local. Abrir o arquivo direto no navegador não funciona.

```bash
python -m http.server
```

Depois acesse [http://localhost:8000](http://localhost:8000).

## Percurso da aula

| Tela | Tipo |
| --- | --- |
| Capa | Início |
| Conteúdo — Introdução | Leitura |
| Conteúdo | Leitura |
| Selecionar imagem | Atividade |
| Múltipla escolha | Atividade |
| Associar — Animal e habitat | Atividade |
| Associar — Características | Atividade |
| Arrastar e soltar — Imagens | Atividade |
| Arrastar e soltar — Habitats | Atividade |
| Jogo da memória — Habitats | Atividade |
| Jogo da memória — Animal e habitat | Atividade |
| Organizar | Atividade |
| Preenchimento | Atividade |
| Resultados | Encerramento |

As telas de resposta correta e resposta incorreta aparecem depois de cada atividade, conforme o acerto.

## O que a interface inclui

- Barra da aula com progresso, pontuação, som e acessibilidade
- Aumento de texto e alto contraste
- Arrastar e soltar no desktop e escolha por toque no celular
- Transição entre telas, respeitando `prefers-reduced-motion`
- Pontuação e tentativas reunidas na tela de resultados

## Estrutura

```text
index.html          shell da aula
js/fluxo.js         ordem das telas, correção e navegação
css/casca.css       moldura do iframe
css/chrome.css      barra e controles compartilhados
telas/              uma página HTML por tela
css/telas/          estilo de cada tela
js/telas/           comportamento de cada tela
img/                ilustrações das atividades
fonts/              Poppins, Font Awesome e Icomoon
```

Cada tela tem o próprio HTML, CSS e JavaScript, com o mesmo número no nome do arquivo. A ordem e as respostas esperadas ficam em `js/fluxo.js`.
