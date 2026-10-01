(function () {
  var MENU = window.OSH_MENU;

  // --- menu ---
  var body = document.getElementById('menuBody');
  var tabs = document.querySelectorAll('.tab');
  var q = document.getElementById('q');
  var current = 'hot';
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmt(p) { return p.replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' ₽'; }
  function row(it) {
    return '<li><div class="mrow"><span>' + esc(it[0]) + '</span><i aria-hidden="true"></i><b>' + fmt(it[1]) + '</b></div>' +
      (it[2] ? '<small class="mdesc">' + esc(it[2]) + '</small>' : '') + '</li>';
  }
  function group(g) {
    return '<section class="mgroup"><h3>' + esc(g.title) + (g.note ? ' <small>' + esc(g.note) + '</small>' : '') + '</h3><ul>' +
      g.items.map(row).join('') + '</ul></section>';
  }
  function render(key) {
    current = key;
    body.classList.remove('is-search');
    body.innerHTML = MENU[key].map(group).join('');
  }
  function search(text) {
    var t = text.trim().toLowerCase().replace(/ё/g, 'е');
    if (t.length < 2) { render(current); return; }
    var found = [];
    Object.keys(MENU).forEach(function (k) {
      MENU[k].forEach(function (g) {
        var items = g.items.filter(function (it) { return (it[0] + ' ' + it[2]).toLowerCase().replace(/ё/g, 'е').indexOf(t) > -1; });
        if (items.length) found.push({ title: g.title, items: items });
      });
    });
    body.classList.add('is-search');
    body.innerHTML = found.length ? found.map(group).join('') :
      '<p class="nothing">Такого в&nbsp;меню нет, но&nbsp;позвоните: возможно, приготовим.</p>';
  }
  tabs.forEach(function (t) {
    t.addEventListener('click', function () {
      tabs.forEach(function (x) { x.classList.remove('is-active'); x.setAttribute('aria-selected', 'false'); });
      t.classList.add('is-active'); t.setAttribute('aria-selected', 'true');
      q.value = '';
      render(t.dataset.tab);
    });
  });
  q.addEventListener('input', function () { search(q.value); });
  render('hot');

  // --- бегущая строка: время по Москве, мы открыты 24/7 ---
  var track = document.getElementById('ledTrack');
  function phrase() {
    var msk = new Date(Date.now() + (new Date().getTimezoneOffset() + 180) * 60000);
    var h = msk.getHours(), m = msk.getMinutes();
    var time = (h < 10 ? '0' : '') + h + ':' + (m < 10 ? '0' : '') + m;
    var tail = h < 6 ? 'ночью тоже кормим' : h < 11 ? 'завтраки уже готовы' : h < 17 ? 'обед: шурпа и лагман' : 'плов горячий';
    return 'ОТКРЫТО 24/7 ★ СЕЙЧАС ' + time + ' ★ ' + tail.toUpperCase() + ' ★ СЕМЁНОВСКИЙ ПЕР., 21, 3 ЭТАЖ ★ ';
  }
  function fill() {
    var p = esc(phrase());
    track.innerHTML = '<span>' + p + p + '</span><span aria-hidden="true">' + p + p + '</span>';
  }
  fill(); setInterval(fill, 30000);

  // --- header ---
  var top = document.querySelector('.top');
  var onScroll = function () { top.classList.toggle('is-solid', window.scrollY > 30); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var burger = document.getElementById('burger'), nav = document.getElementById('nav');
  burger.addEventListener('click', function () {
    var o = document.body.classList.toggle('nav-open');
    burger.setAttribute('aria-expanded', o);
  });
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') { document.body.classList.remove('nav-open'); burger.setAttribute('aria-expanded', 'false'); }
  });

  // --- reveal ---
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('is-in'); io.unobserve(x.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el) { io.observe(el); });
  } else {
    els.forEach(function (el) { el.classList.add('is-in'); });
  }
})();
