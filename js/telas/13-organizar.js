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
   ORGANIZAR
   ========================================================= */

const chips = [...document.querySelectorAll('.word-chip')];
const wordBank = document.getElementById('wordBank');
const answerZone = document.getElementById('answerZone');
const placeholder = document.getElementById('answerPlaceholder');
const confirmButton = document.getElementById('confirmButton');
const resetButton = document.getElementById('resetButton');

let draggedId = null;
let draggedPlaced = null;

function updateState(){
  const count = answerZone.querySelectorAll('.placed-word').length;

  placeholder.hidden = count > 0;

  /*
    O botão só habilita quando as 8 palavras forem utilizadas,
    mas a interface não revela a ordem correta e permite erro.
  */
  confirmButton.disabled = count !== 8;
}

function sourceChip(id){
  return document.querySelector(`.word-chip[data-id="${id}"]`);
}

function placeWord(id, beforeElement = null){
  const source = sourceChip(id);

  if(!source || source.hidden) return;

  const placed = document.createElement('button');
  placed.type = 'button';
  placed.className = 'placed-word';
  placed.draggable = true;
  placed.dataset.id = id;
  placed.textContent = source.textContent;

  placed.addEventListener('click', () => returnWord(placed));

  placed.addEventListener('dragstart', event => {
    draggedPlaced = placed;
    draggedId = null;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', id);
  });

  placed.addEventListener('dragend', () => {
    draggedPlaced = null;
    answerZone.classList.remove('drag-over');
  });

  if(beforeElement){
    answerZone.insertBefore(placed, beforeElement);
  }else{
    answerZone.appendChild(placed);
  }

  source.hidden = true;
  updateState();
}

function returnWord(placed){
  const source = sourceChip(placed.dataset.id);

  if(source){
    source.hidden = false;
  }

  placed.remove();
  updateState();
}

function resetAll(){
  answerZone.querySelectorAll('.placed-word').forEach(placed => {
    const source = sourceChip(placed.dataset.id);
    if(source) source.hidden = false;
    placed.remove();
  });

  updateState();
}

/* Clique/toque: adiciona à frase */
chips.forEach(chip => {
  chip.addEventListener('click', () => placeWord(chip.dataset.id));

  chip.addEventListener('dragstart', event => {
    draggedId = chip.dataset.id;
    draggedPlaced = null;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', draggedId);
  });

  chip.addEventListener('dragend', () => {
    draggedId = null;
    answerZone.classList.remove('drag-over');
  });
});

/* Drag para a área da frase e reordenação */
answerZone.addEventListener('dragover', event => {
  event.preventDefault();
  answerZone.classList.add('drag-over');
  event.dataTransfer.dropEffect = 'move';

  if(draggedPlaced){
    const placedWords = [...answerZone.querySelectorAll('.placed-word:not(:hover)')];

    const target = [...answerZone.querySelectorAll('.placed-word')]
      .find(item => {
        if(item === draggedPlaced) return false;

        const rect = item.getBoundingClientRect();
        return event.clientX < rect.left + rect.width / 2 &&
               event.clientY >= rect.top &&
               event.clientY <= rect.bottom;
      });

    if(target){
      answerZone.insertBefore(draggedPlaced, target);
    }
  }
});

answerZone.addEventListener('dragleave', event => {
  if(!answerZone.contains(event.relatedTarget)){
    answerZone.classList.remove('drag-over');
  }
});

answerZone.addEventListener('drop', event => {
  event.preventDefault();
  answerZone.classList.remove('drag-over');

  if(draggedPlaced){
    draggedPlaced = null;
    updateState();
    return;
  }

  const id = event.dataTransfer.getData('text/plain') || draggedId;

  if(id){
    placeWord(id);
  }
});

resetButton.addEventListener('click', resetAll);

confirmButton.addEventListener('click', () => {
  const sentence = [...answerZone.querySelectorAll('.placed-word')]
    .map(item => item.textContent.trim())
    .join(' ');

  console.log('Frase montada:', sentence);
});

document.addEventListener('keydown', event => {
  if(event.key === 'Escape' && !panel.hidden){
    panel.hidden = true;

    document.querySelectorAll('.a11y-trigger').forEach(item => {
      item.setAttribute('aria-expanded','false');
    });
  }
});

updateState();
