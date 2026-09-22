const panel = document.getElementById('a11yPanel');

document.querySelectorAll('.a11y-trigger').forEach(button => {
  button.addEventListener('click', () => {
    const opening = panel.hidden;
    panel.hidden = !opening;

    document.querySelectorAll('.a11y-trigger').forEach(item => {
      item.setAttribute('aria-expanded', String(opening));
    });
  });
});

document.getElementById('fontButton').addEventListener('click', () => {
  document.body.classList.toggle('large-text');
});

document.getElementById('contrastButton').addEventListener('click', () => {
  document.body.classList.toggle('high-contrast');
});

let muted = false;

document.querySelectorAll('.sound-trigger').forEach(button => {
  button.addEventListener('click', () => {
    muted = !muted;

    document.querySelectorAll('.sound-trigger').forEach(item => {
      const icon = item.querySelector('.icon');

      item.classList.toggle('is-muted', muted);
    });
  });
});


/* =========================================================
   ASSOCIAÇÃO — interação revisada
   - permite começar por qualquer lado;
   - um clique troca a seleção;
   - clicar em item já ligado desfaz e já o deixa selecionado;
   - permite pares errados normalmente;
   - validação só ocorre ao confirmar.
   ========================================================= */

const board = document.getElementById('pairs');
const svg = document.getElementById('lines');
const confirmButton = document.getElementById('confirmButton');
const matchStatus = document.getElementById('matchStatus');
const cards = [...document.querySelectorAll('.pair-card')];

let selectedCard = null;
let pairs = [];

function getSide(card) {
  return card.classList.contains('left') ? 'left' : 'right';
}

function getPair(card) {
  return pairs.find(pair => pair.left === card || pair.right === card) || null;
}

function removePair(pair) {
  if (!pair) return;
  pairs = pairs.filter(item => item !== pair);
}

function makePair(a, b) {
  if (!a || !b || getSide(a) === getSide(b)) return;

  const left = getSide(a) === 'left' ? a : b;
  const right = getSide(a) === 'right' ? a : b;

  // Segurança: um item só pode pertencer a um par por vez.
  removePair(getPair(left));
  removePair(getPair(right));

  pairs.push({ left, right });
}

function connectorPoint(card, side) {
  const boardRect = board.getBoundingClientRect();
  const cardRect = card.getBoundingClientRect();

  return {
    x: (side === 'left' ? cardRect.right : cardRect.left) - boardRect.left,
    y: cardRect.top + cardRect.height / 2 - boardRect.top
  };
}

function redrawLines() {
  svg.innerHTML = '';

  pairs.forEach(pair => {
    const start = connectorPoint(pair.left, 'left');
    const end = connectorPoint(pair.right, 'right');

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', start.x);
    line.setAttribute('y1', start.y);
    line.setAttribute('x2', end.x);
    line.setAttribute('y2', end.y);
    svg.appendChild(line);
  });
}

function renderState() {
  cards.forEach(card => {
    card.classList.remove('matched');
    card.setAttribute('aria-pressed', 'false');

    const badge = card.querySelector('.pair-number');
    if (badge) badge.textContent = '';
  });

  pairs.forEach((pair, index) => {
    const number = String(index + 1);

    [pair.left, pair.right].forEach(card => {
      card.classList.add('matched');
      const badge = card.querySelector('.pair-number');
      if (badge) badge.textContent = number;
    });
  });

  if (selectedCard && !getPair(selectedCard)) {
    selectedCard.setAttribute('aria-pressed', 'true');
  }

  matchStatus.textContent =
    `${pairs.length} de 3 ${pairs.length === 1 ? 'par associado' : 'pares associados'}`;

  confirmButton.disabled = pairs.length !== 3;

  requestAnimationFrame(redrawLines);
}

function handleCard(card) {
  // Segundo clique no mesmo item apenas cancela a seleção.
  if (selectedCard === card && !getPair(card)) {
    selectedCard = null;
    renderState();
    return;
  }

  const existing = getPair(card);

  // Item já associado:
  // desfaz a ligação e usa esse mesmo clique como início da nova associação.
  if (existing) {
    removePair(existing);

    if (selectedCard && selectedCard !== card && getSide(selectedCard) !== getSide(card)) {
      makePair(selectedCard, card);
      selectedCard = null;
    } else {
      selectedCard = card;
    }

    renderState();
    return;
  }

  // Nenhuma seleção ativa: pode começar pela esquerda OU pela direita.
  if (!selectedCard) {
    selectedCard = card;
    renderState();
    return;
  }

  // Clicou em outro item da mesma coluna: troca a seleção sem exigir clique extra.
  if (getSide(selectedCard) === getSide(card)) {
    selectedCard = card;
    renderState();
    return;
  }

  // Colunas opostas: cria a associação, mesmo que pedagogicamente esteja errada.
  makePair(selectedCard, card);
  selectedCard = null;
  renderState();
}

cards.forEach(card => {
  card.addEventListener('click', event => {
    event.preventDefault();
    handleCard(card);
  });
});

window.addEventListener('resize', () => requestAnimationFrame(redrawLines));

confirmButton.addEventListener('click', () => {
  const answer = Object.fromEntries(
    pairs.map(pair => [pair.left.dataset.id, pair.right.dataset.id])
  );

  console.log('Associações:', answer);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    if (!panel.hidden) {
      panel.hidden = true;

      document.querySelectorAll('.a11y-trigger').forEach(item => {
        item.setAttribute('aria-expanded', 'false');
      });

      return;
    }

    selectedCard = null;
    renderState();
  }
});

renderState();
