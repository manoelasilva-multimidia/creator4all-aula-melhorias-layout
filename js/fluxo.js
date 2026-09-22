const pages = [
  { title: 'Capa', file: 'telas/00-capa.html' },
  { title: 'Conteúdo — Introdução', file: 'telas/01-conteudo-introducao.html' },
  { title: 'Conteúdo', file: 'telas/02-conteudo.html' },
  { title: 'Selecionar imagem', file: 'telas/03-selecionar-imagem.html' },
  { title: 'Resposta correta', file: 'telas/04-resposta-correta.html' },
  { title: 'Múltipla escolha', file: 'telas/05-multipla-escolha.html' },
  { title: 'Resposta incorreta', file: 'telas/06-resposta-incorreta.html' },
  { title: 'Associar — Animal e habitat', file: 'telas/07-associar-animal-habitat.html' },
  { title: 'Associar — Características', file: 'telas/08-associar-caracteristicas.html' },
  { title: 'Arrastar e soltar — Imagens', file: 'telas/09-arrastar-imagens.html' },
  { title: 'Arrastar e soltar — Habitats', file: 'telas/10-arrastar-habitats.html' },
  { title: 'Jogo da memória — Habitats', file: 'telas/11-memoria-habitats.html' },
  { title: 'Jogo da memória — Animal e habitat', file: 'telas/12-memoria-animal-habitat.html' },
  { title: 'Organizar', file: 'telas/13-organizar.html' },
  { title: 'Preenchimento', file: 'telas/14-preenchimento.html' },
  { title: 'Resultados', file: 'telas/15-resultados.html' }
];

const lessonFlow=[0,1,2,3,5,7,8,9,10,11,12,13,14,15];
const activityPages=[3,5,7,8,9,10,11,12,13,14];
const pageToActivity=new Map(activityPages.map((pageIndex,i)=>[pageIndex,i+1]));
const activityToPage=new Map(activityPages.map((pageIndex,i)=>[i+1,pageIndex]));

const activityMeta={
  1:{title:'Selecionar imagem',correctText:'Imagem de um oceano com peixes.',page:3},
  2:{title:'Múltipla escolha',correctText:'O lugar onde um animal encontra alimento, água, abrigo e condições para viver.',page:5},
  3:{title:'Associar — Animal e habitat',correctText:'Macaco → floresta; pinguim → região polar; golfinho → oceano.',page:7},
  4:{title:'Associar — Características',correctText:'Pinguim → ambiente gelado; animal da floresta → floresta; peixe → ambiente aquático.',page:8},
  5:{title:'Arrastar e soltar — Imagens',correctText:'Nadam: golfinho, tartaruga e peixe. Terra: macaco, onça e pinguim.',page:9},
  6:{title:'Arrastar e soltar — Habitats',correctText:'Oceano: animais marinhos, habitat aquático e muita água. Floresta: animais da floresta, árvores e abrigo.',page:10},
  7:{title:'Jogo da memória — Habitats iguais',correctText:'Pares de oceano, floresta e região polar.',page:11},
  8:{title:'Jogo da memória — Animal e habitat',correctText:'Macaco → floresta; golfinho → oceano; pinguim → região polar.',page:12},
  9:{title:'Organizar',correctText:'Os animais vivem em diferentes lugares da natureza.',page:13},
 10:{title:'Preenchimento',correctText:'Habitat',page:14}
};

const frame=document.getElementById('screenFrame');
const toast=document.getElementById('flowToast');
let currentPage=0;
let feedbackContext=null;
let score=0;
const attempts=Object.fromEntries(Array.from({length:10},(_,i)=>[i+1,0]));
const results=Object.fromEntries(Array.from({length:10},(_,i)=>[i+1,{status:'pending',answer:'',attempts:0}]));


function showToast(message){
  toast.textContent=message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer=setTimeout(()=>toast.classList.remove('show'),1800);
}
function normalizeText(value){
  return (value||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[.!?;,]+/g,'').replace(/\s+/g,' ').trim().toLowerCase();
}
function escapeText(value){return String(value??'')}
function pointsNow(){return score}
function flowPosition(pageIndex){return lessonFlow.indexOf(pageIndex)}
function previousLessonPage(pageIndex){const p=flowPosition(pageIndex);return p>0?lessonFlow[p-1]:0}
function nextLessonPage(pageIndex){const p=flowPosition(pageIndex);return p>=0&&p<lessonFlow.length-1?lessonFlow[p+1]:15}




const SCREEN_MOTION_MS=450;
const SCREEN_MOTION_CSS=`
@keyframes screenEnter{from{transform:translateX(200px)}to{transform:translateX(0)}}
@keyframes screenExit{from{transform:translateX(0)}to{transform:translateX(-200px)}}
main.screen-enter{animation:screenEnter .5s ease-in-out}
main.screen-exit{animation:screenExit .45s ease-in-out forwards}
@media (prefers-reduced-motion:reduce){
  main.screen-enter,main.screen-exit{animation:none !important}
}`;
let navLock=false;
let hasShownScreen=false;

function childDocument(){
  try{return frame.contentDocument}catch(e){return null}
}
function ensureScreenMotion(doc){
  if(!doc||doc.getElementById('screen-motion')) return;
  const style=doc.createElement('style');
  style.id='screen-motion';
  style.textContent=SCREEN_MOTION_CSS;
  (doc.head||doc.documentElement).appendChild(style);
}
function runNavigation(apply){
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const doc=childDocument();
  const panel=doc&&doc.querySelector('main');
  if(!hasShownScreen||!panel||reduce){
    apply();
    return;
  }
  if(navLock) return;
  navLock=true;
  ensureScreenMotion(doc);
  panel.classList.remove('screen-enter');
  void panel.offsetWidth;
  panel.classList.add('screen-exit');
  window.setTimeout(()=>{
    navLock=false;
    apply();
  },SCREEN_MOTION_MS);
}
function playScreenEnter(doc){
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const panel=doc.querySelector('main');
  if(!panel||reduce) return;
  ensureScreenMotion(doc);
  panel.classList.remove('screen-exit');
  panel.classList.add('screen-enter');
}
function loadPage(pageIndex){
  runNavigation(()=>{
    feedbackContext=null;
    currentPage=pageIndex;
    frame.title=pages[pageIndex].title;
    frame.src=pages[pageIndex].file;
    history.replaceState(null,'','#tela-'+(flowPosition(pageIndex)+1));
  });
}
function loadFeedback(ctx){
  runNavigation(()=>{
    feedbackContext=ctx;
    currentPage=ctx.correct?4:6;
    frame.title=pages[currentPage].title;
    frame.src=pages[currentPage].file;
  });
}

function getImageAlt(el){return el?.querySelector('img')?.alt?.trim()||''}
function associationsFromDom(doc){
  const pairs=[];
  const left=[...doc.querySelectorAll('.pair-card.left.matched')];
  const right=[...doc.querySelectorAll('.pair-card.right.matched')];
  for(const l of left){
    const number=l.querySelector('.pair-number')?.textContent?.trim();
    if(!number) continue;
    const r=right.find(x=>x.querySelector('.pair-number')?.textContent?.trim()===number);
    if(r) pairs.push({left:l.dataset.id,right:r.dataset.id,leftAlt:getImageAlt(l),rightAlt:getImageAlt(r)});
  }
  return pairs;
}
function dragState(doc){
  const zones=[...doc.querySelectorAll('.drop-zone')];
  const map={};
  for(const zone of zones){map[zone.dataset.zone]=[...zone.querySelectorAll('.placed-item')].map(x=>x.dataset.id)}
  return map;
}
function dragAnswerText(doc,map){
  const parts=[];
  for(const [zone,ids] of Object.entries(map)){
    const name=doc.querySelector(`.drop-zone[data-zone="${zone}"] .drop-header strong`)?.textContent?.trim()||zone;
    const labels=ids.map(id=>doc.querySelector(`.drag-item[data-id="${id}"] img`)?.alt?.trim()||id);
    parts.push(`${name}: ${labels.length?labels.join(', '):'nenhum item'}`);
  }
  return parts.join(' | ');
}

function evaluateActivity(activityNo,doc){
  if(activityNo===1){
    const sel=doc.querySelector('.image-option[aria-pressed="true"]');
    return {complete:!!sel,correct:!!sel&&sel.dataset.index==='0',answer:sel?getImageAlt(sel):''};
  }
  if(activityNo===2){
    const sel=doc.querySelector('.choice[aria-pressed="true"]');
    const answer=sel?sel.textContent.replace(/\s+/g,' ').trim():'';
    return {complete:!!sel,correct:!!sel&&sel.dataset.i==='1',answer};
  }
  if(activityNo===3){
    const pairs=associationsFromDom(doc);
    const map=Object.fromEntries(pairs.map(p=>[p.left,p.right]));
    const correct=pairs.length===3&&map.monkey==='forest'&&map.penguin==='polar'&&map.dolphin==='ocean';
    const answer=pairs.map(p=>`${p.leftAlt} → ${p.rightAlt}`).join('; ');
    return {complete:pairs.length===3,correct,answer};
  }
  if(activityNo===4){
    const pairs=associationsFromDom(doc);
    const map=Object.fromEntries(pairs.map(p=>[p.left,p.right]));
    const correct=pairs.length===3&&map.penguin==='ice-habitat'&&map['forest-animal']==='forest-habitat'&&map.fish==='reef-habitat';
    const answer=pairs.map(p=>`${p.leftAlt} → ${p.rightAlt}`).join('; ');
    return {complete:pairs.length===3,correct,answer};
  }
  if(activityNo===5){
    const map=dragState(doc);
    const placed=Object.values(map).flat();
    const swim=new Set(map.swim||[]), land=new Set(map.land||[]);
    const valid=['monkey','dolphin','turtle','fish','jaguar','penguin'];
    const correct=placed.length===6&&valid.every(id=>placed.includes(id))&&['dolphin','turtle','fish'].every(id=>swim.has(id))&&['monkey','jaguar','penguin'].every(id=>land.has(id));
    return {complete:placed.length>0,correct,answer:dragAnswerText(doc,map)};
  }
  if(activityNo===6){
    const map=dragState(doc);
    const placed=Object.values(map).flat();
    const ocean=new Set(map.ocean||[]), forest=new Set(map.forest||[]);
    const valid=['ocean_animals','forest_animals','trees','shelter','aquatic','water'];
    const correct=placed.length===6&&valid.every(id=>placed.includes(id))&&['ocean_animals','aquatic','water'].every(id=>ocean.has(id))&&['forest_animals','trees','shelter'].every(id=>forest.has(id));
    return {complete:placed.length>0,correct,answer:dragAnswerText(doc,map)};
  }
  if(activityNo===7||activityNo===8){
    const matched=doc.querySelectorAll('.memory-card.matched').length;
    const answer=activityMeta[activityNo].correctText;
    return {complete:matched===6,correct:matched===6,answer};
  }
  if(activityNo===9){
    const words=[...doc.querySelectorAll('.placed-word')].map(x=>x.textContent.trim());
    const sentence=words.join(' ');
    return {complete:words.length===8,correct:normalizeText(sentence)==='os animais vivem em diferentes lugares da natureza',answer:sentence};
  }
  if(activityNo===10){
    const value=doc.querySelector('#answer')?.value?.trim()||'';
    return {complete:value.length>0,correct:normalizeText(value)==='habitat',answer:value};
  }
  return {complete:false,correct:false,answer:''};
}

function setAttemptDots(doc,activityNo){
  const total=2;
  const remaining=Math.max(0,total-(attempts[activityNo]||0));
  const slot=doc.querySelector('.fixo-top-right');
  if(!slot) return;
  slot.replaceChildren();
  if(remaining>0){
    const box=doc.createElement('div');
    box.id='icones-tentativas';
    const msg=doc.createElement('p');
    msg.className='msgTentativasRestantes';
    msg.append('Tentativas: ');
    const hidden=doc.createElement('span');
    hidden.className='foraDaTela';
    hidden.textContent=String(remaining);
    msg.appendChild(hidden);
    box.appendChild(msg);
    for(let n=0;n<total;n++){
      const icon=doc.createElement('span');
      icon.className=(n+1)>remaining?'icon-trevo-borda':'icon-trevo';
      box.appendChild(icon);
    }
    slot.appendChild(box);
  }else{
    const label=doc.createElement('p');
    label.className='label-tentativas-esgotadas';
    label.textContent='Tentativas esgotadas';
    slot.appendChild(label);
  }
}
function patchPoints(doc){doc.querySelectorAll('.points strong').forEach(el=>el.textContent=String(pointsNow()))}

function finalizeWrong(activityNo,answer){
  results[activityNo]={status:'incorrect',answer:answer||results[activityNo].answer,attempts:attempts[activityNo]};
}
function recordCorrect(activityNo,answer){
  if(results[activityNo].status!=='correct') score+=10;
  results[activityNo]={status:'correct',answer,attempts:attempts[activityNo]};
}
function submitCurrentActivity(){
  const activityNo=pageToActivity.get(currentPage);
  if(!activityNo) return;
  const doc=frame.contentDocument;
  const evaluation=evaluateActivity(activityNo,doc);
  const correct=evaluation.complete&&evaluation.correct;
  const answer=evaluation.answer||'';
  attempts[activityNo]=Math.min(2,attempts[activityNo]+1);
  results[activityNo].answer=answer;
  results[activityNo].attempts=attempts[activityNo];
  const remaining=Math.max(0,2-attempts[activityNo]);
  if(correct){
    recordCorrect(activityNo,answer);
    loadFeedback({activityNo,correct:true,answer,remaining});
  }else{
    if(attempts[activityNo]>=2) finalizeWrong(activityNo,answer);
    loadFeedback({activityNo,correct:false,answer,remaining});
  }
}

function patchFeedback(doc){
  const ctx=feedbackContext;if(!ctx)return;
  const title=doc.querySelector('h1');
  const desc=doc.querySelector('.feedback-card > p');
  const box=doc.querySelector('.answer-box');
  const actions=doc.querySelector('.feedback-actions');
  if(ctx.correct){
    if(title) title.textContent='Resposta correta!';
    if(desc) desc.textContent='Muito bem! Sua resposta está correta.';
  }else{
    if(title) title.textContent='Resposta incorreta!';
    if(desc) desc.textContent=ctx.remaining>0?'Essa resposta não está correta. Você ainda pode tentar novamente.':'Essa resposta não está correta. Suas duas tentativas foram utilizadas.';
  }
  if(box){
    box.replaceChildren();
    const strong=doc.createElement('strong');strong.textContent='Sua resposta';
    box.append(strong,doc.createTextNode(ctx.answer||'Sem resposta registrada.'));
  }
  if(!ctx.correct&&ctx.remaining<=0){
    const retry=[...doc.querySelectorAll('button')].find(b=>buttonText(b).includes('tentar novamente'));
    if(retry) retry.remove();
  }
  // Garante que o botão de avanço exista e mantenha o padrão visual da tela.
  if(actions&&!actions.querySelector('button')){
    const b=doc.createElement('button');b.type='button';b.className='feedback-primary';b.textContent='Avançar';actions.appendChild(b);
  }
}

function patchResults(doc){
  const correctCount=Object.values(results).filter(r=>r.status==='correct').length;
  const nota=doc.querySelector('#nota');
  if(nota) nota.textContent=Math.floor((correctCount/10)*100)+'%';
  doc.querySelectorAll('.points strong').forEach(el=>el.textContent=String(score));
  const lines=[...doc.querySelectorAll('.resp-aluno')];
  lines.forEach((line,index)=>{
    const rec=results[index+1];
    if(!rec||rec.status==='pending'||!rec.answer){
      line.textContent='Resposta do aluno: Não respondido';
      return;
    }
    const prefix=rec.status==='correct'?'Resposta do aluno (correta): ':'Resposta do aluno (incorreta): ';
    line.textContent=prefix+rec.answer;
  });
}

function buttonText(el){const raw=(el.textContent||'').replace(/\s+/g,' ').trim();return (raw||el.getAttribute('aria-label')||'').toLowerCase()}
function isActivityPage(pageIndex){return pageToActivity.has(pageIndex)}
function goForwardFromPage(pageIndex){loadPage(nextLessonPage(pageIndex))}
function goBackFromPage(pageIndex){loadPage(previousLessonPage(pageIndex))}


function setupMobilePointerDrag(doc){
  if(!doc || doc.__creatorMobileDragReady) return;

  const items=[...doc.querySelectorAll('.drag-item')];
  const zones=[...doc.querySelectorAll('.drop-zone')];

  if(!items.length || !zones.length) return;

  doc.__creatorMobileDragReady=true;

  const style=doc.createElement('style');
  style.textContent=`
    @media (pointer: coarse), (max-width:700px) {
      .drag-item{
        touch-action:manipulation;
        -webkit-user-select:none;
        user-select:none;
        -webkit-touch-callout:none;
      }
      .drag-item.mobile-dragging{
        opacity:.55;
        transform:none !important;
      }
      .drop-zone.mobile-drag-over,
      .drop-zone.selected-target{
        border-color:#0062a0 !important;
        background:#eef7fd !important;
        box-shadow:0 0 0 4px rgba(0,98,160,.14) !important;
      }
      .mobile-drag-ghost{
        position:fixed !important;
        z-index:999999 !important;
        margin:0 !important;
        pointer-events:none !important;
        opacity:.94 !important;
        transform:translate(-50%,-50%) scale(.92) !important;
        box-shadow:0 14px 32px rgba(26,54,74,.24) !important;
        border-color:#0062a0 !important;
        background:#fff !important;
      }
      .collection-picker{
        position:fixed;
        left:10px;
        right:10px;
        bottom:12px;
        z-index:1000000;
        display:flex;
        flex-direction:column;
        gap:8px;
        padding:12px;
        border:1px solid #dadff1;
        border-radius:14px;
        background:#fff;
        box-shadow:0 12px 32px rgba(23,61,91,.22);
      }
      .collection-picker p{
        margin:0 2px 2px;
        color:#173d5b;
        font-size:.92rem;
        font-weight:800;
      }
      .collection-picker button{
        width:100%;
        border:0;
        border-radius:10px;
        background:#00579e;
        color:#fff;
        font-size:1rem;
        font-weight:700;
        padding:12px 14px;
      }
    }
  `;
  doc.head.appendChild(style);

  doc.querySelectorAll('.helper').forEach(el=>{
    el.textContent='Toque na imagem, escolha a coleção e ela vai sozinha para o quadrado.';
  });

  let active=null;
  let ghost=null;
  let activePointer=null;
  let syntheticClick=false;
  let ignoreClicksUntil=0;
  let startX=0;
  let startY=0;
  let moved=false;
  const TAP_SLOP=14;

  function viewportPoint(event){
    return {x:event.clientX,y:event.clientY};
  }

  function zoneAt(x,y){
    return zones.find(zone=>{
      const r=zone.getBoundingClientRect();
      return x>=r.left && x<=r.right && y>=r.top && y<=r.bottom;
    }) || null;
  }

  function highlight(zone){
    zones.forEach(z=>z.classList.toggle('mobile-drag-over',z===zone));
  }

  function zoneLabel(zone){
    return zone.querySelector('.drop-header strong')?.textContent?.replace(/\s+/g,' ').trim() || 'Coleção';
  }

  function hidePicker(){
    doc.querySelectorAll('.collection-picker').forEach(el=>el.remove());
  }

  function showPicker(item){
    hidePicker();
    const picker=doc.createElement('div');
    picker.className='collection-picker';
    picker.setAttribute('role','dialog');
    picker.setAttribute('aria-label','Escolher coleção');
    const title=doc.createElement('p');
    title.textContent='Qual coleção é esta opção?';
    picker.appendChild(title);
    zones.forEach(zone=>{
      const button=doc.createElement('button');
      button.type='button';
      button.textContent=zoneLabel(zone);
      button.addEventListener('click',event=>{
        event.preventDefault();
        event.stopPropagation();
        hidePicker();
        sendItemToZone(item, zone);
      });
      picker.appendChild(button);
    });
    doc.body.appendChild(picker);
  }

  function sendItemToZone(item, zone){
    const win=doc.defaultView;
    const rect=zone.getBoundingClientRect();
    const visible=rect.top>=8 && rect.bottom<=(win?.innerHeight||0)-8;
    if(!visible) zone.scrollIntoView({block:'center', behavior:'smooth'});
    const place=()=>{
      if(!item.classList.contains('selected')){
        syntheticClick=true;
        item.click();
        syntheticClick=false;
      }
      syntheticClick=true;
      zone.click();
      syntheticClick=false;
    };
    if(visible) place();
    else win.setTimeout(place, 340);
  }

  function createGhost(item){
    const rect=item.getBoundingClientRect();
    const clone=item.cloneNode(true);
    clone.classList.add('mobile-drag-ghost');
    clone.classList.remove('selected');
    clone.hidden=false;
    const width=Math.min(rect.width,132);
    clone.style.width=width+'px';
    clone.style.height=width+'px';
    doc.body.appendChild(clone);
    return clone;
  }

  function moveGhost(x,y){
    if(!ghost) return;
    ghost.style.left=x+'px';
    ghost.style.top=y+'px';
  }

  function autoScroll(y){
    const win=doc.defaultView;
    if(!win) return;
    const edge=82;
    const speed=15;
    if(y<edge) win.scrollBy(0,-speed);
    else if(y>win.innerHeight-edge) win.scrollBy(0,speed);
  }

  function cleanup(){
    if(active){
      active.classList.remove('mobile-dragging');
      try{
        if(activePointer!==null && active.hasPointerCapture?.(activePointer)){
          active.releasePointerCapture(activePointer);
        }
      }catch(e){}
    }
    highlight(null);
    if(ghost){
      ghost.remove();
      ghost=null;
    }
    active=null;
    activePointer=null;
  }

  function finish(event,cancelled=false){
    if(!active || event.pointerId!==activePointer) return;
    const item=active;
    const {x,y}=viewportPoint(event);
    const wasTap=!moved && !cancelled;
    const targetZone=(!wasTap && !cancelled) ? zoneAt(x,y) : null;
    cleanup();

    if(wasTap){
      syntheticClick=true;
      item.click();
      syntheticClick=false;
      ignoreClicksUntil=performance.now()+450;
      if(item.classList.contains('selected') && !item.hidden) showPicker(item);
      else hidePicker();
    }else{
      ignoreClicksUntil=performance.now()+450;
      hidePicker();
      if(targetZone){
        syntheticClick=true;
        item.click();
        targetZone.click();
        syntheticClick=false;
      }
    }

    event.preventDefault();
    event.stopPropagation();
  }

  doc.addEventListener('click',event=>{
    if(event.target.closest?.('.collection-picker')) return;
    if(!syntheticClick && performance.now()<ignoreClicksUntil){
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  },true);

  items.forEach(item=>{
    item.addEventListener('pointerdown',event=>{
      if(event.pointerType==='mouse') return;
      if(item.hidden) return;
      active=item;
      activePointer=event.pointerId;
      moved=false;
      const point=viewportPoint(event);
      startX=point.x;
      startY=point.y;
      try{item.setPointerCapture?.(event.pointerId)}catch(e){}
      event.preventDefault();
    },{passive:false});

    item.addEventListener('pointermove',event=>{
      if(active!==item || event.pointerId!==activePointer) return;
      const {x,y}=viewportPoint(event);
      if(!moved && Math.hypot(x-startX, y-startY)<TAP_SLOP) return;
      moved=true;
      if(!ghost){
        item.classList.add('mobile-dragging');
        ghost=createGhost(item);
      }
      moveGhost(x,y);
      highlight(zoneAt(x,y));
      autoScroll(y);
      event.preventDefault();
    },{passive:false});

    item.addEventListener('pointerup',event=>finish(event,false),{passive:false});
    item.addEventListener('pointercancel',event=>finish(event,true),{passive:false});
  });
}

function wireChild(){
  navLock=false;
  let doc;try{doc=frame.contentDocument}catch(e){return}if(!doc)return;
  hasShownScreen=true;
  playScreenEnter(doc);
  setupMobilePointerDrag(doc);
  if(feedbackContext){patchFeedback(doc)}else{
    patchPoints(doc);
    const activityNo=pageToActivity.get(currentPage);
    if(activityNo) setAttemptDots(doc,activityNo);
    if(currentPage===15) patchResults(doc);
  }

  doc.addEventListener('click',event=>{
    const target=event.target.closest('button,a,summary');
    if(!target)return;
    if(target.matches('button:disabled'))return;
    const text=buttonText(target);

    if(feedbackContext){
      if(text.includes('tentar novamente')){
        event.preventDefault();
        const page=activityToPage.get(feedbackContext.activityNo);
        loadPage(page);
        return;
      }
      if(text.startsWith('avançar')){
        event.preventDefault();
        const ctx=feedbackContext;
        if(!ctx.correct&&results[ctx.activityNo].status!=='correct') finalizeWrong(ctx.activityNo,ctx.answer);
        loadPage(nextLessonPage(activityToPage.get(ctx.activityNo)));
        return;
      }
    }

    if(text.includes('confirmar resposta')&&isActivityPage(currentPage)){
      event.preventDefault();
      // Captura o estado depois que o clique interno teve chance de ocorrer.
      setTimeout(submitCurrentActivity,0);
      return;
    }
    if(text.includes('começar')){event.preventDefault();loadPage(1);return}
    if(text==='prosseguir'||text.includes('prosseguir →')){event.preventDefault();goForwardFromPage(currentPage);return}
    if(text==='avançar'){
      event.preventDefault();
      // Mesma regra da aula padrão: em exercício, Avançar avalia enquanto houver tentativa.
      // Sem tentativas restantes, segue para a próxima tela sem reavaliar.
      if(isActivityPage(currentPage)){
        const activityNo=pageToActivity.get(currentPage);
        const remaining=Math.max(0,2-(attempts[activityNo]||0));
        if(remaining===0) goForwardFromPage(currentPage);
        else submitCurrentActivity();
      }else{
        goForwardFromPage(currentPage);
      }
      return;
    }
    if(text==='voltar'){event.preventDefault();goBackFromPage(currentPage);return}
    if(text==='fechar'){event.preventDefault();loadPage(0);return}
    if(text.includes('concluir aula')){event.preventDefault();showToast('Aula concluída.');return}
  },true);
}
frame.addEventListener('load',()=>{
  let doc=null;
  try{doc=frame.contentDocument}catch(e){doc=null}
  if(!doc){
    showToast('Abra esta aula por um servidor local. O navegador bloqueia a navegação quando o arquivo é aberto direto.');
    return;
  }
  wireChild();
});
loadPage(0);
