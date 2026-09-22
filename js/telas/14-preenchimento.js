const panel=document.getElementById('a11yPanel');

document.querySelectorAll('.a11y-trigger').forEach(button=>{
  button.addEventListener('click',()=>{
    const opening=panel.hidden;
    panel.hidden=!opening;
    document.querySelectorAll('.a11y-trigger').forEach(item=>{
      item.setAttribute('aria-expanded',String(opening));
    });
  });
});

document.getElementById('fontButton').addEventListener('click',()=>{
  document.body.classList.toggle('large-text');
});

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

const answer=document.getElementById('answer');
const confirmButton=document.getElementById('confirmButton');

function updateButton(){
  confirmButton.disabled=answer.value.trim().length===0;
}

answer.addEventListener('input',updateButton);

answer.addEventListener('keydown',event=>{
  if(event.key==='Enter' && !confirmButton.disabled){
    confirmButton.click();
  }
});

confirmButton.addEventListener('click',()=>{
  console.log('Resposta preenchida:',answer.value.trim());
});

document.addEventListener('keydown',event=>{
  if(event.key==='Escape' && !panel.hidden){
    panel.hidden=true;
    document.querySelectorAll('.a11y-trigger').forEach(item=>{
      item.setAttribute('aria-expanded','false');
    });
  }
});

updateButton();
