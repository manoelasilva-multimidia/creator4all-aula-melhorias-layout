const panel=document.getElementById('a11yPanel');
document.querySelectorAll('.a11y-trigger').forEach(button=>{
  button.addEventListener('click',()=>{
    const opening=panel.hidden;
    panel.hidden=!opening;
    document.querySelectorAll('.a11y-trigger').forEach(item=>item.setAttribute('aria-expanded',String(opening)));
  });
});
document.getElementById('fontButton').addEventListener('click',()=>document.body.classList.toggle('large-text'));

let muted=false;
document.querySelectorAll('.sound-trigger').forEach(button=>{
  button.addEventListener('click',()=>{
    muted=!muted;
    document.querySelectorAll('.sound-trigger').forEach(item=>{
      const icon=item.querySelector('.icon');
      item.classList.toggle('is-muted', muted);
    });
  });
});

const cards=[...document.querySelectorAll('.memory-card')];
const status=document.getElementById('status');
const confirmButton=document.getElementById('confirmButton');

let first=null;
let second=null;
let lock=false;
let matchedPairs=0;
let move=0;

function updateStatus(){
  status.textContent=`${matchedPairs} de 3 pares encontrados`;
  confirmButton.disabled=matchedPairs!==3;
}

function resetTurn(){
  first=null;
  second=null;
  lock=false;
}

cards.forEach(card=>{
  card.addEventListener('click',()=>{
    if(lock || card.classList.contains('matched') || card===first) return;

    card.classList.add('flipped');

    if(!first){
      first=card;
      return;
    }

    second=card;
    lock=true;
    move++;

    if(first.dataset.pair===second.dataset.pair){
      matchedPairs++;
      first.classList.add('matched');
      second.classList.add('matched');
      first.disabled=true;
      second.disabled=true;
      const n=String(matchedPairs);
      first.querySelector('.match-badge').textContent=n;
      second.querySelector('.match-badge').textContent=n;
      updateStatus();
      resetTurn();
    }else{
      window.setTimeout(()=>{
        first.classList.remove('flipped');
        second.classList.remove('flipped');
        resetTurn();
      },650);
    }
  });
});

confirmButton.addEventListener('click',()=>{
  console.log('Jogo da memória concluído em',move,'jogadas.');
});
