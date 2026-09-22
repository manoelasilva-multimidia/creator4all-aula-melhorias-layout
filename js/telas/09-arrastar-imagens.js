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
   DRAG / CLICK-TO-PLACE
   ========================================================= */

const items = [...document.querySelectorAll('.drag-item')];
const zones = [...document.querySelectorAll('.drop-zone')];
const confirmButton = document.getElementById('confirmButton');

let selectedItem = null;
let draggedId = null;

function sourceItem(id) {
  return document.querySelector(`.drag-item[data-id="${id}"]`);
}

function clearSelection() {
  items.forEach(item => item.classList.remove('selected'));
  selectedItem = null;
  zones.forEach(zone => zone.classList.remove('selected-target'));
}

function updateZone(zone) {
  const content = zone.querySelector('.drop-content');
  const placed = content.querySelectorAll('.placed-item');

  let empty = content.querySelector('.empty-message');

  if (placed.length > 0 && empty) {
    empty.remove();
  }

  if (placed.length === 0 && !empty) {
    empty = document.createElement('span');
    empty.className = 'empty-message';
    empty.textContent =
      zone.dataset.zone === 'swim'
        ? 'Solte aqui os animais que nadam.'
        : 'Solte aqui os animais que se movem em terra.';
    content.appendChild(empty);
  }
}

function updateStatus() {
  const total = document.querySelectorAll('.placed-item').length;

  /*
    Mantemos apenas a regra funcional:
    o aluno precisa mover 6 imagens antes de confirmar.
    A interface NÃO revela quantas devem ir em cada coleção,
    permitindo classificações incorretas e distribuição desigual.
  */
  confirmButton.disabled = total === 0;
}

function returnItem(id) {
  const placed = document.querySelector(`.placed-item[data-id="${id}"]`);
  if (!placed) return;

  const zone = placed.closest('.drop-zone');
  placed.remove();

  const original = sourceItem(id);
  original.hidden = false;

  updateZone(zone);
  updateStatus();
}


function setupZoneSelection(zone) {
  const tryPlaceSelectedItem = event => {
    if (event && event.target && event.target.closest('.remove-item')) return;
    if (!selectedItem) return;
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    placeItem(selectedItem.dataset.id, zone);
  };

  [zone, zone.querySelector('.drop-header'), zone.querySelector('.drop-content')]
    .filter(Boolean)
    .forEach(target => {
      target.addEventListener('click', tryPlaceSelectedItem);

      target.addEventListener('pointerup', event => {
        if (event.pointerType === 'mouse') return;
        tryPlaceSelectedItem(event);
      });

      target.addEventListener('touchend', event => {
        tryPlaceSelectedItem(event);
      }, { passive: false });
    });
}

function placeItem(id, zone) {
  const original = sourceItem(id);
  if (!original || original.hidden) return;

  const card = document.createElement('div');
  card.className = 'placed-item';
  card.dataset.id = id;

  const img = original.querySelector('img').cloneNode(true);
  const remove = document.createElement('button');
  remove.type = 'button';
  remove.className = 'remove-item';
  remove.setAttribute('aria-label', 'Retirar imagem da coleção');
  remove.textContent = '×';
  remove.addEventListener('click', () => returnItem(id));

  card.appendChild(img);
  card.appendChild(remove);

  zone.querySelector('.drop-content').appendChild(card);
  original.hidden = true;

  clearSelection();
  updateZone(zone);
  updateStatus();
}

items.forEach(item => {
  item.addEventListener('click', () => {
    if (item.hidden) return;

    const alreadySelected = selectedItem === item;
    clearSelection();

    if (!alreadySelected) {
      selectedItem = item;
      item.classList.add('selected');
      zones.forEach(zone => zone.classList.add('selected-target'));
    }
  });

  item.addEventListener('dragstart', event => {
    draggedId = item.dataset.id;
    event.dataTransfer.setData('text/plain', draggedId);
    event.dataTransfer.effectAllowed = 'move';
  });

  item.addEventListener('dragend', () => {
    draggedId = null;
    zones.forEach(zone => zone.classList.remove('drag-over'));
  });
});


zones.forEach(zone => {
  setupZoneSelection(zone);

  zone.addEventListener('keydown', event => {
    if ((event.key === 'Enter' || event.key === ' ') && selectedItem) {
      event.preventDefault();
      placeItem(selectedItem.dataset.id, zone);
    }
  });

  zone.addEventListener('dragover', event => {
    event.preventDefault();
    zone.classList.add('drag-over');
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  });

  zone.addEventListener('dragleave', () => {
    zone.classList.remove('drag-over');
  });

  zone.addEventListener('drop', event => {
    event.preventDefault();
    zone.classList.remove('drag-over');

    const id = (event.dataTransfer && event.dataTransfer.getData('text/plain')) || draggedId;
    if (id) placeItem(id, zone);
  });
});

confirmButton.addEventListener('click', () => {
  const result = {};

  zones.forEach(zone => {
    result[zone.dataset.zone] =
      [...zone.querySelectorAll('.placed-item')].map(item => item.dataset.id);
  });

  console.log('Classificação:', result);
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    if (!panel.hidden) {
      panel.hidden = true;
      return;
    }
    clearSelection();
  }
});
