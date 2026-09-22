const a11yPanel=document.getElementById('a11yPanel');
document.querySelectorAll('.a11y-trigger').forEach(b=>b.addEventListener('click',()=>{
  const open=a11yPanel.hidden;
  a11yPanel.hidden=!open;
  document.querySelectorAll('.a11y-trigger').forEach(x=>x.setAttribute('aria-expanded',String(open)));
}));
document.getElementById('fontButton').addEventListener('click',()=>document.body.classList.toggle('large-text'));
document.getElementById('contrastButton').addEventListener('click',()=>document.body.classList.toggle('high-contrast'));
let muted=false;
document.querySelectorAll('.sound-trigger').forEach(b=>b.addEventListener('click',()=>{
  muted=!muted;
  document.querySelectorAll('.sound-trigger').forEach(x=>x.classList.toggle('is-muted', muted));
}));

const saveButton=document.querySelector('.grupo-finaliza-buttons .button.is-success');
if(saveButton){
  saveButton.addEventListener('click',()=>{
    saveButton.hidden=true;
  });
}

const optionsButton=document.getElementById('exibir-finaliza-opcoes');
const optionsList=document.querySelector('.finaliza-lista-opcoes');
optionsButton.addEventListener('click',event=>{
  event.stopPropagation();
  optionsList.classList.toggle('ativo');
});
document.addEventListener('click',event=>{
  if(event.target===optionsButton||optionsButton.contains(event.target)) return;
  optionsList.classList.remove('ativo');
});
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'){
    optionsList.classList.remove('ativo');
    if(!a11yPanel.hidden){
      a11yPanel.hidden=true;
      document.querySelectorAll('.a11y-trigger').forEach(x=>x.setAttribute('aria-expanded','false'));
    }
  }
});
