/* Última actualização: 6 de Outubro de 2026 */
(() => {
  const fields = ['task','repeat','human','context'].map(id => document.getElementById(id));
  const status = document.getElementById('worksheet-status');
  const labels = ['Tarefa','Parte que se repete','Parte que precisa de mim','Informação e passos necessários'];
  document.getElementById('copy-worksheet').addEventListener('click',async()=>{
    if(!fields.some(f=>f.value.trim())){status.textContent='Escreve primeiro uma resposta para copiar.';fields[0].focus();return;}
    const v=i=>fields[i].value.trim()||'Por preencher';
    const text='Tenho uma tarefa que quero perceber como tratar com IA.\n\nTarefa: '+v(0)+'\nParte que se repete: '+v(1)+'\nParte que precisa de mim: '+v(2)+'\nInformação e passos necessários: '+v(3)+'\n\nQuero pensar antes de executar. Diz-me: 1) o que faz sentido automatizar; 2) o que devo manter comigo; 3) o que preciso de preparar primeiro. Para cada parte, diz em qual destes modos fica: deixar correr com limites; a IA prepara e eu reviso; parceiro de rascunho; não delegar a decisão. Não executes nada. Se faltar informação, pergunta-me primeiro.';
    try{await navigator.clipboard.writeText(text);status.textContent='Pedido copiado. Cola-o na ferramenta de IA que usas.';}
    catch{status.textContent='Não foi possível copiar automaticamente. Selecciona o texto nas caixas e copia-o à mão.';}
  });
  fields.forEach(f=>{
    const printed=document.createElement('div');printed.className='print-value';printed.setAttribute('aria-hidden','true');f.insertAdjacentElement('afterend',printed);
    const update=()=>printed.textContent=f.value;f.addEventListener('input',update);update();
  });
  document.querySelectorAll('[data-print]').forEach(b=>b.addEventListener('click',()=>window.print()));
  window.addEventListener('beforeprint',()=>fields.forEach(f=>f.nextElementSibling.textContent=f.value));
  if('IntersectionObserver' in window){const links=[...document.querySelectorAll('.guide-index a[href^="#"]')];const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){links.forEach(a=>{if(a.hash==='#'+entry.target.id)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current')})}})},{rootMargin:'-10% 0px -65% 0px'});links.forEach(a=>observer.observe(document.querySelector(a.hash)));}
})();
