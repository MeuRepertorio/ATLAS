/* Abalion Bridge v1 — adds real pages stored in the project's Git repository.
 * Public content only. No secrets, remote writes, or personal data.
 */
(()=>{'use strict';
const url='./abalion/sections.json?v='+Date.now();
const css=`
#abalion-materiais{max-width:1120px;margin:64px auto;padding:32px clamp(18px,4vw,48px);border:1px solid rgba(140,145,150,.25);border-radius:24px;background:linear-gradient(140deg,rgba(116,130,140,.09),rgba(116,130,140,.025));font-family:inherit;color:inherit}
#abalion-materiais h2{font-size:clamp(24px,3vw,38px);margin:8px 0}#abalion-materiais p{line-height:1.65;opacity:.8}
#abalion-materiais .ab-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin-top:20px}
#abalion-materiais .ab-card{display:block;text-decoration:none!important;border:1px solid rgba(140,145,150,.3);border-radius:16px;padding:22px;color:inherit!important;background:rgba(127,127,127,.06);transition:transform .2s,box-shadow .2s}
#abalion-materiais .ab-card:hover{transform:translateY(-3px);box-shadow:0 10px 40px #0001}
#abalion-materiais .ab-tag{display:block;font-size:11px;letter-spacing:.12em;text-transform:uppercase;opacity:.65;margin-bottom:9px}
#abalion-materiais .ab-card b{display:block;font-size:18px;margin-bottom:9px}
#abalion-materiais .ab-card span:last-child{font-size:13px;opacity:.78;line-height:1.5}
#ab-nav-link{border-radius:99px;padding:8px 12px;border:1px solid currentColor;opacity:.9;font-size:12px;color:inherit;text-decoration:none;margin:8px 0;display:inline-block}
@media(prefers-reduced-motion:reduce){#abalion-materiais .ab-card{transition:none}}`;
function render(data){
 if(!data||!Array.isArray(data.sections)||!data.sections.length)return;
 const items=data.sections.filter(x=>x&&typeof x.title==='string'&&/^abalion\/pages\/[a-z0-9-]+\.html$/.test(x.path));
 if(!items.length)return;
 const sty=document.createElement('style');sty.textContent=css;document.head.appendChild(sty);
 const section=document.createElement('section');section.id='abalion-materiais';section.setAttribute('aria-label','Conteúdos adicionais conectados');
 const eyebrow=document.createElement('small');eyebrow.textContent='CONTEÚDO ADICIONADO PELO ABALION';eyebrow.style.letterSpacing='.16em';section.appendChild(eyebrow);
 const title=document.createElement('h2');title.textContent='Novos espaços para explorar.';section.appendChild(title);
 const p=document.createElement('p');p.textContent='Estas páginas foram criadas no repositório deste projeto e aparecem aqui automaticamente após a publicação.';section.appendChild(p);
 const grid=document.createElement('div');grid.className='ab-grid';
 items.forEach(s=>{const a=document.createElement('a');a.className='ab-card';a.href='./'+s.path;
 const label=document.createElement('span');label.className='ab-tag';label.textContent='PÁGINA CONECTADA';
 const b=document.createElement('b');b.textContent=s.title.slice(0,90);
 const summary=document.createElement('span');summary.textContent=String(s.summary||'Abrir novo conteúdo').slice(0,180);
 a.append(label,b,summary);grid.appendChild(a);});
 section.appendChild(grid);const main=document.querySelector('main');const footer=document.querySelector('main footer,footer');
 if(footer&&footer.parentNode)footer.parentNode.insertBefore(section,footer);else if(main)main.appendChild(section);else document.body.appendChild(section);
 const nav=document.querySelector('.side-nav,.navlinks,nav[aria-label="Navegação principal"],.top-links,.topnav');
 if(nav){const link=document.createElement('a');link.id='ab-nav-link';link.href='#abalion-materiais';link.textContent='✦ Novidades';nav.appendChild(link);}
}
fetch(url,{cache:'no-store'}).then(r=>r.ok?r.json():null).then(render).catch(()=>{});
})();