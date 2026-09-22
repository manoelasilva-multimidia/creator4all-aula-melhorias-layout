const a=document.getElementById('access'),p=document.getElementById('panel');
a.addEventListener('click',()=>{const open=a.getAttribute('aria-expanded')==='true';a.setAttribute('aria-expanded',String(!open));p.hidden=open});
document.getElementById('font').onclick=()=>document.documentElement.style.fontSize=document.documentElement.style.fontSize?'':'18px';
document.getElementById('contrast').onclick=()=>document.body.style.filter=document.body.style.filter?'':'contrast(1.18)';
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!p.hidden){p.hidden=true;a.setAttribute('aria-expanded','false');a.focus()}});
document.getElementById('start').onclick=()=>console.log('Iniciar aula');
