/* Medição do site (desde 27 Nov 2026): PostHog, região UE, modo sem cookies.
   Não grava cookies nem nada no browser, por isso não precisa de banner.
   Só corre em ricardocosta.eu (ou noutro endereço com ?medir=1, para testar). */
(function () {
  var producao = location.hostname === 'ricardocosta.eu';
  if (!producao && !/[?&]medir=1\b/.test(location.search)) return;

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://eu-assets.i.posthog.com/static/array.js';
  s.onload = function () {
    if (!window.posthog || !window.posthog.init) return;
    window.posthog.init('phc_BcfnQuSYYRoXqP5RTrMM2ovGwsSkijKWKRjNnwUdQAMR', {
      api_host: 'https://eu.i.posthog.com',
      defaults: '2026-08-30',
      cookieless_mode: 'always',
      disable_session_recording: true,
      capture_pageleave: true
    });
  };
  document.head.appendChild(s);

  /* Cliques que contam para o negócio, com nome claro: o autocapture apanha o resto */
  function destino(href) {
    if (/^mailto:|email-protection/.test(href)) return 'email';
    if (/\/guia\/?(#.*)?$/.test(href)) return 'guia';
    if (/\/dicionario\/?(#.*)?$/.test(href)) return 'dicionario';
    if (/beehiiv\.com/.test(href)) return 'newsletter';
    if (/linkedin\.com/.test(href)) return 'linkedin';
    if (/youtube\.com/.test(href)) return 'youtube';
    if (/^#(fecho|contacto)$|\/conversa\/?$/.test(href)) return 'falar_comigo';
    return null;
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || !window.posthog || !window.posthog.capture) return;
    var d = destino(a.getAttribute('href'));
    if (!d) return;
    var zona = a.closest('section[id], nav, footer, .pilula');
    window.posthog.capture('clique_importante', {
      destino: d,
      texto: (a.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60),
      zona: zona ? (zona.id || zona.className || zona.tagName.toLowerCase()) : 'pagina'
    });
  }, true);
})();
