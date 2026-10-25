'use strict';
(()=>{
const db=window.ATLAS_DATA;
if(!db){document.body.insertAdjacentHTML('afterbegin','<p>Conteúdo indisponível; verifique o arquivo assets/data.js.</p>');return}
const $=id=>document.getElementById(id);
const keys=['etica','leg','log','dmn'];
const short={etica:'Ética',leg:'Legislação',log:'Logística',dmn:'DMN'};
const numeral={etica:'01',leg:'02',log:'03',dmn:'04'};
const colors={etica:'var(--coral)',leg:'var(--blue)',log:'var(--green)',dmn:'var(--purple)'};
let active='etica',filtered='all',questionId=-1,caseId=0;
let read = new Set(); try{read=new Set(JSON.parse(localStorage.getItem('atlas-read')||'[]'))}catch(e){}
const escape=s=>String(s??'').replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const norm=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const theme=()=>{let t='dark';try{t=localStorage.getItem('atlas-theme')||'dark'}catch(e){}document.documentElement.dataset.theme=t};theme();
$('themeToggle').addEventListener('click',()=>{const n=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=n;try{localStorage.setItem('atlas-theme',n)}catch(e){}});
function showSubject(k,scroll=true,open=-1){
 if(!keys.includes(k))return;
 active=k;const d=db.subjects[k];
 document.querySelectorAll('.subject-tab').forEach(x=>{const yes=x.dataset.subject===k;x.classList.toggle('active',yes);x.setAttribute('aria-pressed',yes?'true':'false')});
 $('readingOverline').textContent='BIBLIOTECA / '+numeral[k]+' — '+short[k].toUpperCase();
 $('readingTitle').textContent=d.name;
 $('readingDescription').textContent=d.description;
 $('keyTopics').innerHTML=d.points.slice(0,6).map(p=>`<span class="topic-chip">${escape(p[0])}</span>`).join('');
 $('chapterIndex').innerHTML=db.chapters[k].map((c,i)=>`<button type="button" class="chapter-jump" data-index="${i}"><span>${String(i+1).padStart(2,'0')}</span>${escape(c.title)}</button>`).join('');
 $('chapterList').innerHTML=db.chapters[k].map((c,i)=>{
 const id=k+'-'+i,done=read.has(id);
 return `<details class="chapter" data-chapter="${id}" id="chapter-${id}" ${i===open||(!Number.isInteger(open)&&i===0)?'open':''}>
 <summary><span class="chapter-num">${String(i+1).padStart(2,'0')}</span><span class="chapter-name">${escape(c.title)}</span><span class="chapter-check">${done?'✓ Lido':''}</span><span class="chapter-chevron">+</span></summary>
 <div class="chapter-body">${c.body.map(p=>`<p>${escape(p)}</p>`).join('')}
 <div class="insight-box"><strong>EXEMPLO APLICADO</strong><p>${escape(c.example)}</p></div>
 <div class="summary-box"><strong>SÍNTESE PARA REVISAR</strong><p>${escape(c.oral)}</p></div>
 <div class="chapter-end"><button class="marked-btn ${done?'done':''}" type="button" data-read="${id}">${done?'✓ Capítulo lido':'Marcar como lido'}</button><span class="chapter-source">Material de estudo: ${escape(c.sources?.join(' · ')||'referência do tema')}</span></div></div></details>`}).join('');
 if(open<0){const first=$('chapter-'+k+'-0');first?.setAttribute('open','')}
 document.querySelectorAll('.chapter-jump').forEach(btn=>btn.addEventListener('click',()=>{const i=Number(btn.dataset.index),el=$('chapter-'+active+'-'+i);el.open=true;el.scrollIntoView({behavior:'smooth',block:'start'})}));
 document.querySelectorAll('[data-read]').forEach(btn=>btn.addEventListener('click',()=>{const id=btn.dataset.read;if(read.has(id))read.delete(id);else read.add(id);try{localStorage.setItem('atlas-read',JSON.stringify([...read]))}catch(e){}updateRead();btn.classList.toggle('done',read.has(id));btn.textContent=read.has(id)?'✓ Capítulo lido':'Marcar como lido';btn.closest('.chapter').querySelector('.chapter-check').textContent=read.has(id)?'✓ Lido':''}));
 if(scroll){$('biblioteca').scrollIntoView({behavior:'smooth'});if(open>=0)setTimeout(()=>{$('chapter-'+k+'-'+open)?.scrollIntoView({behavior:'smooth',block:'start'})},200)}
 updateRead();
}
function updateRead(){$('readCount').textContent=String(read.size).padStart(2,'0')}
$('subjectCards').innerHTML=keys.map(k=>{const d=db.subjects[k];return `<button type="button" data-subject="${k}" class="subject-card reveal" style="--subject-color:${colors[k]}"><div class="sub-top"><span class="sub-code">CAMPO ${numeral[k]} / 04</span><span class="sub-arrow">↗</span></div><h3>${escape(d.name)}</h3><p>${escape(d.description)}</p><span class="sub-foot">${db.chapters[k].length} CAPÍTULOS • ${d.points.length} CONCEITOS-CHAVE</span></button>`}).join('');
$('subjectTabs').innerHTML=keys.map(k=>`<button type="button" class="subject-tab" data-subject="${k}" style="--subject-color:${colors[k]}"><span class="subject-dot ${db.subjects[k].tone}"></span>${escape(short[k])}</button>`).join('');
document.querySelectorAll('[data-subject]').forEach(btn=>btn.addEventListener('click',()=>{showSubject(btn.dataset.subject,true);$('sidebar').classList.remove('open')}));
$('nextSubject').addEventListener('click',()=>showSubject(keys[(keys.indexOf(active)+1)%keys.length]));
showSubject('etica',false);
function chooseConnection(i){const c=db.connections[i];$('connectionDetail').innerHTML=`<small>CONEXÃO 0${i+1} / 04 · ${escape(c.tag.toUpperCase())}</small><h3>${escape(c.title)}</h3><p>${escape(c.text)}</p><p class="connection-example"><strong>Em uma situação prática:</strong> ${escape(c.example)}</p>`;document.querySelectorAll('.conn-btn').forEach((b,j)=>{b.classList.toggle('active',i===j);b.setAttribute('aria-pressed',String(i===j))})}
$('connectionControls').innerHTML=db.connections.map((c,i)=>`<button class="conn-btn" type="button" data-conn="${i}">${escape(c.title)}</button>`).join('');
document.querySelectorAll('[data-conn]').forEach(b=>b.addEventListener('click',()=>chooseConnection(+b.dataset.conn)));chooseConnection(0);
function chooseQuestion(){const pool=db.questions.map((q,i)=>({...q,index:i})).filter(q=>filtered==='all'||q.cat===filtered);if(!pool.length)return;const candidates=pool.filter(x=>x.index!==questionId);const q=(candidates.length?candidates:pool)[Math.floor(Math.random()*(candidates.length||pool.length))];questionId=q.index;$('questionDisplay').innerHTML=`<span class="qtag">${escape(short[q.cat].toUpperCase())} / ${escape(q.id)}</span><h4>${escape(q.q)}</h4><div class="answer" id="questionAnswer" hidden><strong>RESPOSTA FUNDAMENTADA</strong><p>${escape(q.short)}</p><p>${escape(q.more)}</p><small>Referência no material: ${escape(q.src)}</small></div>`;$('revealAnswer').textContent='Ler explicação'}
$('questionFilters').innerHTML=`<button type="button" data-filter="all" class="filter-chip active">Todas</button>`+keys.map(k=>`<button type="button" data-filter="${k}" class="filter-chip">${escape(short[k])}</button>`).join('');
$('questionFilters').querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{filtered=b.dataset.filter;document.querySelectorAll('.filter-chip').forEach(x=>x.classList.toggle('active',x===b));chooseQuestion()}));
$('newQuestion').addEventListener('click',chooseQuestion);$('revealAnswer').addEventListener('click',()=>{const a=$('questionAnswer');if(!a)return;a.hidden=!a.hidden;$('revealAnswer').textContent=a.hidden?'Ler explicação':'Ocultar explicação'});chooseQuestion();
function chooseCase(i){caseId=i;let q=db.cases[i];$('caseDisplay').innerHTML=`<div class="case-question"><span class="kicker">SITUAÇÃO ${String(i+1).padStart(2,'0')} / ${db.cases.length}</span><h4>${escape(q.prompt)}</h4><div class="case-options">${q.choices.map((c,j)=>`<button class="case-choice" type="button" data-choice="${j}">${escape(c)}</button>`).join('')}</div><div id="caseFeedback" class="case-feedback" hidden></div></div>`;document.querySelectorAll('[data-choice]').forEach(b=>b.addEventListener('click',()=>{const ok=+b.dataset.choice===q.correct;document.querySelectorAll('[data-choice]').forEach(x=>{x.disabled=true;if(+x.dataset.choice===q.correct)x.classList.add('correct');else if(x===b)x.classList.add('incorrect')});const box=$('caseFeedback');box.hidden=false;box.textContent=(ok?'Interpretação adequada. ':'É importante rever esse critério. ')+q.why}))}
$('nextCase').addEventListener('click',()=>chooseCase((caseId+1)%db.cases.length));chooseCase(0);
let reflectionIndex=-1;let reflectionScope='all';
function renderReflection(){
 const pool=db.quiz.map((q,i)=>({...q,idx:i})).filter(x=>reflectionScope==='all'||x.cat===reflectionScope);
 if(!pool.length)return;
 let available=pool.filter(q=>q.idx!==reflectionIndex);if(!available.length)available=pool;
 const q=available[Math.floor(Math.random()*available.length)];reflectionIndex=q.idx;
 $('reflectionCard').innerHTML=`<span class="reflection-category">${escape(short[q.cat].toUpperCase())} · QUESTÃO COMENTADA</span><h4 class="reflection-prompt">${escape(q.q)}</h4><div>${q.opts.map((opt,i)=>`<button type="button" class="reflection-option" data-reflection-choice="${i}">${escape(opt)}</button>`).join('')}</div><div class="reflection-explanation" id="reflectionExplanation" hidden></div>`;
 document.querySelectorAll('[data-reflection-choice]').forEach(b=>b.addEventListener('click',()=>{
 const picked=+b.dataset.reflectionChoice,correct=q.correct;
 document.querySelectorAll('[data-reflection-choice]').forEach(x=>{x.disabled=true;if(+x.dataset.reflectionChoice===correct)x.classList.add('correct');else if(x===b)x.classList.add('incorrect')});
 const result=$('reflectionExplanation');result.hidden=false;result.textContent=(picked===correct?'Interpretação adequada. ':'Reveja o fundamento. ')+q.why;
 }));
}
$('reflectionScope').addEventListener('change',e=>{reflectionScope=e.target.value;reflectionIndex=-1;renderReflection()});
$('nextReflection').addEventListener('click',renderReflection);renderReflection();
$('glossaryGrid').innerHTML=db.glossary.map(x=>`<div class="term"><strong>${escape(x.term)}</strong><p>${escape(x.desc)}</p></div>`).join('');
$('officialSources').innerHTML=db.officialSources.map(x=>`<a class="source-link" target="_blank" rel="noopener noreferrer" href="${escape(x.url)}"><span><strong>${escape(x.title)}</strong><small>${escape(x.tag)} · ${escape(x.cat)}</small></span><span class="external" aria-hidden="true">↗</span></a>`).join('');
$('manualSources').innerHTML=db.manualSources.map(x=>`<div class="manual-item"><span class="book">${escape(x.id)}</span><div><strong>${escape(x.title)}</strong><small>${escape(x.cat)} · material didático de referência</small></div></div>`).join('');
const items=[];for(const k of keys){for(const [i,c] of db.chapters[k].entries())items.push({cat:k,index:i,title:c.title,body:c.body.join(' ')+' '+c.example});for(const p of db.subjects[k].points)items.push({cat:k,index:-1,title:p[0],body:p[1]})}
let debounce;
$('siteSearch').addEventListener('input',e=>{clearTimeout(debounce);debounce=setTimeout(()=>{const q=norm(e.target.value.trim());const results=$('searchResults');if(q.length<2){results.hidden=true;results.innerHTML='';return}const hits=items.filter(x=>norm(x.title+' '+x.body).includes(q)).slice(0,14);results.hidden=false;results.innerHTML=hits.length?hits.map(x=>`<button type="button" class="search-hit" data-searchcat="${x.cat}" data-searchidx="${x.index}"><small>${escape(short[x.cat])} · ${x.index>=0?'capítulo':'conceito-chave'}</small><strong>${escape(x.title)}</strong></button>`).join(''):'<div class="empty-search">Nenhum resultado. Tente outro termo.</div>';results.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{results.hidden=true;$('siteSearch').value='';showSubject(b.dataset.searchcat,true,+b.dataset.searchidx)}))},120)});
window.addEventListener('keydown',e=>{if(e.key==='/'&&!/INPUT|TEXTAREA/.test(document.activeElement.tagName)){e.preventDefault();$('siteSearch').focus()}if(e.key==='Escape'){$('searchResults').hidden=true;$('sidebar').classList.remove('open')}});
document.addEventListener('click',e=>{if(!e.target.closest('.search-wrap'))$('searchResults').hidden=true});
$('mobileMenu').addEventListener('click',()=>{const s=$('sidebar');s.classList.toggle('open');$('mobileMenu').setAttribute('aria-expanded',String(s.classList.contains('open')))});
document.querySelectorAll('.side-nav a').forEach(a=>a.addEventListener('click',()=>{$('sidebar').classList.remove('open');$('mobileMenu').setAttribute('aria-expanded','false')}));
const obs=new IntersectionObserver(entries=>entries.forEach(x=>{if(x.isIntersecting){x.target.classList.add('visible');obs.unobserve(x.target)}}),{threshold:.05,rootMargin:'0px 0px -10px 0px'});document.querySelectorAll('.reveal').forEach(x=>obs.observe(x));
function onScroll(){const doc=document.documentElement;const p=doc.scrollTop/(doc.scrollHeight-doc.clientHeight);$('pageProgress').style.width=(Math.max(0,Math.min(1,p))*100)+'%';let activeId='inicio';for(const section of document.querySelectorAll('main section[id]'))if(section.getBoundingClientRect().top<180)activeId=section.id;document.querySelectorAll('.nav-item').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+activeId))}
window.addEventListener('scroll',onScroll,{passive:true});onScroll();
})();