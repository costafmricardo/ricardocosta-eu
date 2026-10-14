/* Última actualização: 6 de Outubro de 2026 */
(() => {
 const input=document.getElementById('dic-q'), clear=document.getElementById('clear-search'), count=document.getElementById('dic-count'), empty=document.getElementById('empty-results');
 const entries=[...document.querySelectorAll('.dic__e')], groups=[...document.querySelectorAll('.dic__g')], buttons=[...document.querySelectorAll('[data-group]')];
 const norm=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim();
 const texts=new Map(entries.map(e=>[e,norm(e.dataset.t+' '+e.textContent)]));
 let selected='all';
 function filter(){const query=norm(input.value);let total=0;entries.forEach(e=>{const visible=(selected==='all'||e.closest('.dic__g').id===selected)&&(!query||texts.get(e).includes(query));e.hidden=!visible;if(visible)total++});groups.forEach(g=>g.hidden=!g.querySelector('.dic__e:not([hidden])'));buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.group===selected)));clear.hidden=!input.value;empty.hidden=total!==0;count.textContent=total===entries.length?'35 palavras':total+' '+(total===1?'palavra encontrada':'palavras encontradas');}
 function reset(){input.value='';selected='all';filter();}
 input.addEventListener('input',filter);clear.addEventListener('click',()=>{input.value='';filter();input.focus()});document.getElementById('reset-filters').addEventListener('click',()=>{reset();input.focus()});buttons.forEach(b=>b.addEventListener('click',()=>{selected=b.dataset.group;filter()}));
 function revealHash(){let id;try{id=decodeURIComponent(location.hash.slice(1))}catch{return}const target=document.getElementById(id);if(target&&(target.matches('.dic__e')||target.matches('.dic__g'))){reset();target.scrollIntoView({block:'start'});const link=target.querySelector('.dic__anc');if(link)link.focus({preventScroll:true})}}
 document.addEventListener('click',event=>{const link=event.target.closest('a[href^="#"]');if(!link)return;const id=link.getAttribute('href').slice(1),target=document.getElementById(id);if(target?.matches('.dic__e,.dic__g')){reset();if(location.hash==='#'+id)revealHash()}});
 window.addEventListener('hashchange',revealHash);filter();if(location.hash)revealHash();
})();
