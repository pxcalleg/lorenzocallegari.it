/* lorenzocallegari.it | effetto terminale
   Le etichette con l'attributo data-type vengono "digitate" lettera per lettera,
   poi compaiono uno dopo l'altro i contenuti che le seguono (titolo, testo, card).
   Tutto locale: nessun cookie, nessuna chiamata esterna.
   Con "riduci movimento" attivo nel sistema, il contenuto appare subito. */
(function () {
  var labels = document.querySelectorAll('.lc [data-type]');
  if (!labels.length) return;
  document.documentElement.classList.add('lc-term');
  var calma = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function mostra(el, ritardo) {
    setTimeout(function () { el.classList.add('lc-on'); }, ritardo);
  }

  function riveladopo(label) {
    var t = 0, el = label.nextElementSibling;
    while (el) {
      mostra(el, t);
      if (el.classList.contains('lc-grid')) {
        var figli = el.children;
        for (var i = 0; i < figli.length; i++) { t += 110; mostra(figli[i], t); }
      }
      t += 140;
      el = el.nextElementSibling;
    }
  }

  function digita(label) {
    var testo = label.getAttribute('data-type-text');
    var parti = testo.split(' → ');
    var comando = parti[0], uscita = parti.length > 1 ? ' → ' + parti.slice(1).join(' → ') : '';
    var i = 0;
    label.textContent = '';
    label.classList.add('lc-typing');
    (function passo() {
      if (i < comando.length) {
        label.textContent += comando.charAt(i++);
        setTimeout(passo, 55 + Math.random() * 45);
      } else {
        setTimeout(function () {
          label.textContent = comando + uscita;
          label.classList.remove('lc-typing');
          riveladopo(label);
        }, 280);
      }
    })();
  }

  for (var k = 0; k < labels.length; k++) {
    var l = labels[k];
    l.setAttribute('data-type-text', l.textContent);
    if (calma) { riveladopo(l); }
  }
  if (calma) return;

  if (!('IntersectionObserver' in window)) {
    for (var m = 0; m < labels.length; m++) digita(labels[m]);
    return;
  }
  var io = new IntersectionObserver(function (voci) {
    voci.forEach(function (v) {
      if (v.isIntersecting) { io.unobserve(v.target); setTimeout(function () { digita(v.target); }, 150); }
    });
  }, { threshold: 0.6 });
  for (var n = 0; n < labels.length; n++) io.observe(labels[n]);
})();

/* Numero di telefono "nascosto": si rivela premendo Invio (desktop) o con un tap (mobile).
   Senza JavaScript il numero resta visibile come link normale. */
(function () {
  var pulsanti = document.querySelectorAll('.lc-rivela');
  if (!pulsanti.length) return;
  var calma = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function rivela(btn) {
    if (btn.getAttribute('data-fatto')) return;
    btn.setAttribute('data-fatto', '1');
    var link = btn.parentNode.querySelector('.lc-tel');
    var numero = link.textContent;
    btn.hidden = true;
    link.hidden = false;
    if (calma) { link.textContent = numero; link.focus(); return; }
    link.textContent = '';
    link.classList.add('lc-typing');
    var i = 0;
    (function passo() {
      if (i < numero.length) {
        link.textContent += numero.charAt(i++);
        setTimeout(passo, 45 + Math.random() * 40);
      } else {
        link.classList.remove('lc-typing');
        link.focus();
      }
    })();
  }

  for (var i = 0; i < pulsanti.length; i++) {
    var b = pulsanti[i];
    b.parentNode.querySelector('.lc-tel').hidden = true;
    b.hidden = false;
    b.addEventListener('click', function () { rivela(this); });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    var t = e.target, tag = t && t.tagName;
    if (tag === 'A' || tag === 'BUTTON' || tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
    var b = document.querySelector('.lc-rivela:not([data-fatto])');
    if (b) { e.preventDefault(); rivela(b); }
  });
})();
