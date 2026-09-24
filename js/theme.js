// Tema: guarda a escolha, aplica antes da pintura para não haver flash.
// O script inline no <head> faz a aplicação; este trata do botão.
(function () {
  var root = document.documentElement;
  var btn = document.querySelector('.theme-toggle');
  if (!btn) return;

  function actual() {
    var guardado = root.getAttribute('data-theme');
    if (guardado) return guardado;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function rotular() {
    var t = actual();
    btn.setAttribute('aria-label', t === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro');
    btn.setAttribute('aria-pressed', String(t === 'light'));
  }

  rotular();

  btn.addEventListener('click', function () {
    var novo = actual() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', novo);
    try { localStorage.setItem('tema', novo); } catch (e) {}
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', novo === 'dark' ? '#171411' : '#F7F3EC');
    rotular();
  });
})();
