// O único elemento animado do site: a barra do sábado à segunda enche e o
// número conta até 47, uma vez, quando entra no ecrã. Sem JS ou com
// prefers-reduced-motion, o HTML já mostra 47 e o CSS já mostra a barra cheia.
(function () {
  var el = document.querySelector('[data-momento]');
  if (!el) return;

  var num = el.querySelector('.momento__num');
  var alvo = parseInt(num && num.textContent, 10) || 47;
  var reduzir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function correr() {
    el.classList.add('is-on');
    if (reduzir || !num) return;
    var inicio = null, duracao = 1600;
    num.textContent = '0';
    function passo(ts) {
      if (!inicio) inicio = ts;
      var p = Math.min((ts - inicio) / duracao, 1);
      var e = 1 - Math.pow(1 - p, 3);
      num.textContent = String(Math.round(e * alvo));
      if (p < 1) requestAnimationFrame(passo); else num.textContent = String(alvo);
    }
    requestAnimationFrame(passo);
  }

  if (!('IntersectionObserver' in window)) { correr(); return; }
  var io = new IntersectionObserver(function (entradas) {
    entradas.forEach(function (en) {
      if (en.isIntersecting) { correr(); io.disconnect(); }
    });
  }, { threshold: 0.35 });
  io.observe(el);
})();
