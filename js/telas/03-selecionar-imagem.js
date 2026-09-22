const a11yPanel=document.getElementById('a11yPanel');
document.querySelectorAll('.a11y-trigger').forEach(b=>b.addEventListener('click',()=>{const open=a11yPanel.hidden;a11yPanel.hidden=!open;document.querySelectorAll('.a11y-trigger').forEach(x=>x.setAttribute('aria-expanded',String(open)));}));
document.getElementById('fontButton').addEventListener('click',()=>document.body.classList.toggle('large-text'));
document.getElementById('contrastButton').addEventListener('click',()=>document.body.classList.toggle('high-contrast'));
let muted=false;document.querySelectorAll('.sound-trigger').forEach(b=>b.addEventListener('click',()=>{muted=!muted;document.querySelectorAll('.sound-trigger').forEach(x=>{const icon=x.querySelector('.icon');x.classList.toggle('is-muted', muted);});}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!a11yPanel.hidden){a11yPanel.hidden=true;document.querySelectorAll('.a11y-trigger').forEach(x=>x.setAttribute('aria-expanded','false'));}});
const opts=[...document.querySelectorAll('.image-option')],confirmBtn=document.getElementById('confirm');opts.forEach(o=>o.addEventListener('click',()=>{opts.forEach(x=>x.setAttribute('aria-pressed','false'));o.setAttribute('aria-pressed','true');confirmBtn.disabled=false;}));
