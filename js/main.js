/* SOGASUR-MALI — scripts du site (menu mobile, visionneuse, galerie, formulaire) */
(function () {
  'use strict';
  document.documentElement.classList.remove('no-js');

  var WA_NUMBER = '22391621502';
  var EMAIL = 'sogasurmalisecurite@gmail.com';

  /* ---------- Menu mobile ---------- */
  var drawer = document.getElementById('drawer');
  var openBtn = document.querySelector('.menu-toggle');
  var closeBtn = document.querySelector('.drawer-close');
  function setDrawer(open) {
    if (!drawer) return;
    drawer.classList.toggle('open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    if (openBtn) openBtn.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('no-scroll', open);
    if (open) { closeBtn && closeBtn.focus(); } else { openBtn && openBtn.focus(); }
  }
  openBtn && openBtn.addEventListener('click', function () { setDrawer(true); });
  closeBtn && closeBtn.addEventListener('click', function () { setDrawer(false); });
  drawer && drawer.addEventListener('click', function (e) { if (e.target.closest('a')) setDrawer(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) setDrawer(false);
  });

  /* ---------- Apparition au défilement ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else { reveals.forEach(function (el) { el.classList.add('in'); }); }

  /* ---------- Galerie : filtres ---------- */
  var gallery = document.querySelector('[data-gallery]');
  var filterBar = document.querySelector('[data-filters]');
  if (gallery && filterBar) {
    var labels = { agents: 'Agents', equipes: 'Équipes', activites: 'Activités', vehicules: 'Véhicules', sites: 'Sites', agrements: 'Agréments' };
    var order = ['agents', 'equipes', 'activites', 'vehicules', 'sites', 'agrements'];
    var items = Array.prototype.slice.call(gallery.querySelectorAll('.g-item'));
    var present = order.filter(function (c) { return items.some(function (i) { return i.dataset.cat === c; }); });
    var cats = ['all'].concat(present);
    cats.forEach(function (c, idx) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'filter'; b.dataset.filter = c;
      b.textContent = c === 'all' ? 'Tout' : (labels[c] || c);
      b.setAttribute('aria-pressed', idx === 0 ? 'true' : 'false');
      filterBar.appendChild(b);
    });
    filterBar.addEventListener('click', function (e) {
      var b = e.target.closest('.filter'); if (!b) return;
      filterBar.querySelectorAll('.filter').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      var f = b.dataset.filter;
      items.forEach(function (i) { i.hidden = !(f === 'all' || i.dataset.cat === f); });
    });
  }

  /* ---------- Visionneuse (photos et documents) ---------- */
  var lb = document.getElementById('lightbox');
  if (lb) {
    var img = lb.querySelector('.lb-img');
    var cap = lb.querySelector('.lb-caption');
    var count = lb.querySelector('.lb-count');
    var prevB = lb.querySelector('.lb-prev');
    var nextB = lb.querySelector('.lb-next');
    var list = [], idx = 0, scale = 1, tx = 0, ty = 0, lastFocus = null;

    function collect(trigger) {
      var group = trigger.dataset.group;
      var nodes = group
        ? document.querySelectorAll('[data-lb][data-group="' + group + '"]')
        : [trigger];
      var out = [], seen = {};
      Array.prototype.forEach.call(nodes, function (n) {
        if (n.hidden || n.closest('[hidden]')) return;
        var pages = (n.dataset.pages || n.dataset.src || '').split('|').filter(Boolean);
        pages.forEach(function (src, p) {
          if (seen[src]) return; seen[src] = 1;
          out.push({ src: src, caption: n.dataset.caption + (pages.length > 1 ? ' — page ' + (p + 1) + '/' + pages.length : ''), doc: n.dataset.kind === 'doc', owner: n, page: p });
        });
      });
      return out;
    }
    function apply() { img.style.transform = 'translate(' + tx + 'px,' + ty + 'px) scale(' + scale + ')'; }
    function reset() { scale = 1; tx = 0; ty = 0; apply(); }
    function show(i) {
      idx = (i + list.length) % list.length;
      var it = list[idx];
      reset();
      img.src = it.src; img.alt = it.caption;
      img.classList.toggle('photo', !it.doc);
      cap.textContent = it.caption;
      count.textContent = (idx + 1) + ' / ' + list.length;
      var multi = list.length > 1;
      prevB.hidden = !multi; nextB.hidden = !multi;
    }
    function open(trigger) {
      list = collect(trigger);
      var start = 0;
      var first = (trigger.dataset.pages || trigger.dataset.src || '').split('|')[0];
      list.some(function (it, k) { if (it.src === first) { start = k; return true; } return false; });
      lastFocus = document.activeElement;
      lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false');
      document.body.classList.add('no-scroll');
      show(start);
      lb.querySelector('.lb-close').focus();
    }
    function close() {
      lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('no-scroll'); img.removeAttribute('src');
      lastFocus && lastFocus.focus();
    }
    function zoom(f) { scale = Math.min(5, Math.max(1, scale * f)); if (scale === 1) { tx = 0; ty = 0; } apply(); }

    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-lb]');
      if (t) { e.preventDefault(); open(t); }
    });
    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.lb-zin').addEventListener('click', function () { zoom(1.4); });
    lb.querySelector('.lb-zout').addEventListener('click', function () { zoom(1 / 1.4); });
    lb.querySelector('.lb-reset').addEventListener('click', reset);
    prevB.addEventListener('click', function () { show(idx - 1); });
    nextB.addEventListener('click', function () { show(idx + 1); });
    lb.querySelector('.lb-stage').addEventListener('click', function (e) { if (e.target === e.currentTarget) close(); });
    img.addEventListener('dblclick', function () { if (scale > 1) reset(); else zoom(2.2); });
    lb.addEventListener('wheel', function (e) { e.preventDefault(); zoom(e.deltaY < 0 ? 1.15 : 1 / 1.15); }, { passive: false });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') show(idx + 1);
      else if (e.key === 'ArrowLeft') show(idx - 1);
      else if (e.key === '+' || e.key === '=') zoom(1.4);
      else if (e.key === '-') zoom(1 / 1.4);
      else if (e.key === 'Tab') {
        var f = lb.querySelectorAll('button:not([hidden])');
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    /* Glisser, pincer, balayer */
    var pts = new Map(), startDist = 0, startScale = 1, sx = 0, sy = 0, stx = 0, sty = 0, swipeX = null;
    img.addEventListener('pointerdown', function (e) {
      img.setPointerCapture(e.pointerId);
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      img.classList.add('dragging');
      if (pts.size === 1) { sx = e.clientX; sy = e.clientY; stx = tx; sty = ty; swipeX = e.clientX; }
      if (pts.size === 2) { var a = Array.from(pts.values()); startDist = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y); startScale = scale; swipeX = null; }
    });
    img.addEventListener('pointermove', function (e) {
      if (!pts.has(e.pointerId)) return;
      pts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pts.size === 2) {
        var a = Array.from(pts.values());
        var d = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y);
        scale = Math.min(5, Math.max(1, startScale * d / startDist)); apply();
      } else if (pts.size === 1 && scale > 1) {
        tx = stx + (e.clientX - sx); ty = sty + (e.clientY - sy); apply();
      }
    });
    function up(e) {
      if (!pts.has(e.pointerId)) return;
      pts.delete(e.pointerId);
      if (pts.size === 0) {
        img.classList.remove('dragging');
        if (scale === 1 && swipeX !== null && list.length > 1) {
          var dx = e.clientX - swipeX;
          if (Math.abs(dx) > 60) show(idx + (dx < 0 ? 1 : -1));
        }
        if (scale === 1) { tx = 0; ty = 0; apply(); }
      }
    }
    img.addEventListener('pointerup', up);
    img.addEventListener('pointercancel', up);
  }

  /* ---------- Formulaire de devis ---------- */
  var form = document.getElementById('devis-form');
  if (form) {
    var fields = ['nom', 'telephone', 'email', 'organisation', 'service', 'lieu', 'localisation', 'horaires', 'message'];
    var labelsF = { nom: 'Nom', telephone: 'Téléphone', email: 'Email', organisation: 'Entreprise / organisation', service: 'Type de service', lieu: 'Type de lieu', localisation: 'Localisation', horaires: 'Horaires souhaités', message: 'Message' };
    function validate() {
      var ok = true;
      ['nom', 'telephone', 'service'].forEach(function (n) {
        var el = form.elements[n], wrap = el.closest('.field');
        var bad = !el.value.trim();
        if (n === 'telephone' && !bad) bad = el.value.replace(/[^0-9]/g, '').length < 8;
        wrap.classList.toggle('invalid', bad);
        if (bad && ok) { el.focus(); ok = false; }
      });
      var em = form.elements.email;
      if (em.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em.value.trim())) {
        em.closest('.field').classList.add('invalid'); if (ok) em.focus(); ok = false;
      } else { em.closest('.field').classList.remove('invalid'); }
      return ok;
    }
    function build() {
      var lines = ['Bonjour SOGASUR-MALI, je souhaite demander un devis pour un service de gardiennage/surveillance.', ''];
      fields.forEach(function (n) {
        var el = form.elements[n];
        var v = el.tagName === 'SELECT' ? (el.value ? el.options[el.selectedIndex].text : '') : el.value.trim();
        if (v) lines.push(labelsF[n] + ' : ' + v);
      });
      return lines.join('\n');
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validate()) return;
      window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(build()), '_blank', 'noopener');
    });
    var mailBtn = document.getElementById('devis-mail');
    mailBtn && mailBtn.addEventListener('click', function () {
      if (!validate()) return;
      window.location.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Demande de devis — gardiennage / surveillance') + '&body=' + encodeURIComponent(build());
    });
    form.addEventListener('input', function (e) { var w = e.target.closest('.field'); w && w.classList.remove('invalid'); });

    /* Pré-remplissage depuis un lien : contact.html?offre=... */
    var params = new URLSearchParams(location.search);
    var offre = params.get('offre');
    if (offre) {
      var sel = form.elements.service;
      Array.prototype.forEach.call(sel.options, function (o) { if (o.value === offre) sel.value = offre; });
    }
  }

  /* Année du copyright */
  var y = document.querySelector('[data-year]');
  if (y) y.textContent = new Date().getFullYear();
})();
