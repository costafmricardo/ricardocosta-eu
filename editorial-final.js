/* Última actualização: 7 de Outubro de 2026 */
(() => {
  const scene = document.querySelector('.demonstration');
  const field = document.querySelector('#particles');
  const buttons = [...document.querySelectorAll('[data-step]')];
  const replay = document.querySelector('#replay');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const states = [
    {label:'O pedido original', text:'«Podes rever o documento que enviei e dizer-me o que achas?»', comment:'O objectivo é tornar a mensagem mais clara, mantendo os factos.', status:'Um ponto de partida.'},
    {label:'A sugestão da IA · exemplo ilustrativo', text:'«Podes rever o documento e enviar os teus comentários <mark>até amanhã</mark>?»', comment:'O prazo não estava no pedido. Soar melhor não significa estar certo.', status:'Há um compromisso novo.'},
    {label:'Depois da revisão humana', text:'«Podes rever o documento que enviei e partilhar os teus comentários?»', comment:'Pedido mais directo. Sem acrescentar um prazo que não foi combinado.', status:'Revisto antes de enviar.'}
  ];
  const particles = Array.from({length:90},(_,i)=>{
    const p=document.createElementNS('http://www.w3.org/2000/svg','path');
    p.setAttribute('d','M0 -3 L3 3 L-3 3 Z');p.classList.add('particle');field.appendChild(p);
    return p;
  });
  let timers=[],playing=false,stage=0,seen=false;
  function point(i,s){
    if(s===0) return [18+(i*137%520),15+(i*83%390),i*23];
    if(s===1){const edge=i%4,t=Math.floor(i/4)/22;return edge===0?[80+400*t,35,0]:edge===1?[480,35+340*t,90]:edge===2?[480-400*t,375,180]:[80,375-340*t,270]}
    const a=(i/particles.length)*Math.PI*2;return [280+238*Math.cos(a),215+193*Math.sin(a),a*180/Math.PI];
  }
  function render(s,announce=false){stage=s;scene.dataset.stage=String(s);buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===s)));
    document.querySelector('#demo-label').textContent=states[s].label;
    document.querySelector('#demo-text').innerHTML=states[s].text;
    document.querySelector('#demo-comment').textContent=states[s].comment;
    document.querySelector('#demo-state').textContent=states[s].status;
    particles.forEach((p,i)=>{const [x,y,r]=point(i,s);p.style.transform=`translate(${x}px,${y}px) rotate(${r}deg)`;p.style.opacity=s===2?'.35':String(.25+(i%5)*.14)});
    if(announce)document.querySelector('#demo-announcement').textContent=states[s].label+'. '+states[s].comment;
  }
  function stop(){timers.forEach(clearTimeout);timers=[];playing=false;replay.innerHTML='<span aria-hidden="true">↻</span> Reproduzir';}
  function play(){stop();seen=true;if(reduced.matches){render(2,true);return}playing=true;replay.innerHTML='<span aria-hidden="true">Ⅱ</span> Pausar';render(0);timers=[setTimeout(()=>render(1),1450),setTimeout(()=>render(2),2900),setTimeout(stop,4400)];}
  buttons.forEach((b,i)=>b.addEventListener('click',()=>{stop();seen=true;render(i,true)}));
  replay.addEventListener('click',()=>{if(playing){stop()}else{play()}});
  render(0);
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{for(const e of entries){if(e.isIntersecting&&!seen&&!reduced.matches){play()}else if(!e.isIntersecting&&playing){stop()}}},{threshold:.6});observer.observe(scene)}
  reduced.addEventListener('change',()=>{stop();if(reduced.matches)render(stage)});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop()});
})();

// Última actualização: 7 de Outubro de 2026 — movimento apenas em resposta ao rato.
(() => {
  const hero = document.querySelector('.hero');
  const field = hero?.querySelector('.hero-dust');
  const light = hero?.querySelector('.hero-light');
  if (!field || !light) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = matchMedia('(hover: hover) and (pointer: fine) and (min-width: 761px)');
  const dots = [];
  const colours = ['#ff8c32', '#ffa43b', '#ffc04f', '#e97723', '#ffb145'];
  for (let i = 0; i < 58; i++) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    const x = 25 + Math.random() * 595;
    const y = 15 + Math.random() * 670;
    const prominent = Math.random() < .18;
    circle.setAttribute('cx', x); circle.setAttribute('cy', y);
    circle.setAttribute('r', String(prominent ? 2.5 + Math.random() * 1.4 : .8 + Math.random() * 1.3));
    circle.setAttribute('opacity', String(.3 + Math.random() * .5));
    circle.setAttribute('fill', colours[Math.floor(Math.random() * colours.length)]);
    field.append(circle); dots.push({circle, x, y, depth: .25 + Math.random() * 1.15});
  }
  let x = 0, y = 0, tx = 0, ty = 0, frame = 0, visible = true;
  const active = () => !motion.matches && pointer.matches && visible && !document.hidden;
  function draw() {
    frame = 0;
    if (!active()) return;
    x += (tx - x) * .085; y += (ty - y) * .085;
    for (const dot of dots) dot.circle.setAttribute('transform', `translate(${x * dot.depth} ${y * dot.depth})`);
    light.setAttribute('transform', `translate(${x * .75} ${y * .75})`);
    if (Math.abs(tx - x) + Math.abs(ty - y) > .08) frame = requestAnimationFrame(draw);
  }
  function schedule() { if (active() && !frame) frame = requestAnimationFrame(draw); }
  hero.addEventListener('pointermove', event => {
    if (!active() || event.pointerType !== 'mouse') return;
    const rect = hero.getBoundingClientRect();
    tx = ((event.clientX - rect.left) / rect.width - .5) * 48;
    ty = ((event.clientY - rect.top) / rect.height - .5) * 38;
    schedule();
  }, {passive: true});
  hero.addEventListener('pointerleave', () => { tx = ty = 0; schedule(); });
  function reset() {
    cancelAnimationFrame(frame); frame = 0; x = y = tx = ty = 0;
    for (const dot of dots) dot.circle.removeAttribute('transform');
    light.removeAttribute('transform');
  }
  motion.addEventListener('change', reset); pointer.addEventListener('change', reset);
  document.addEventListener('visibilitychange', reset);
  new IntersectionObserver(entries => {visible = entries[0].isIntersecting; if (!visible) reset();}).observe(hero);
})();
