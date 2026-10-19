(function () {
  // theme: dark default, saved choice wins
  var root = document.documentElement;
  var toggle = document.getElementById('themeToggle');
  function setTheme(t) {
    root.setAttribute('data-theme', t);
    toggle.textContent = t === 'dark' ? '☀️' : '🌙';
    try { localStorage.setItem('djp-theme', t); } catch (e) {}
  }
  var saved = null;
  try { saved = localStorage.getItem('djp-theme'); } catch (e) {}
  setTheme(saved === 'light' ? 'light' : 'dark');
  toggle.addEventListener('click', function () {
    setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });

  // reveal on scroll
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  // ambient canvas: floating light beams / particles
  var cv = document.getElementById('bgfx');
  var ctx = cv.getContext('2d');
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var W, H, dots = [];
  function size() {
    W = cv.width = window.innerWidth;
    H = cv.height = window.innerHeight;
  }
  size();
  window.addEventListener('resize', size);
  var N = Math.min(46, Math.floor(window.innerWidth / 26));
  var COLORS = ['255,59,48', '255,122,24', '255,176,32'];
  for (var i = 0; i < N; i++) {
    dots.push({
      x: Math.random(), y: Math.random(),
      r: 1 + Math.random() * 2.6,
      c: COLORS[i % COLORS.length],
      vx: (Math.random() - 0.5) * 0.00045,
      vy: -0.0002 - Math.random() * 0.0006,
      a: 0.12 + Math.random() * 0.3
    });
  }
  function frame() {
    ctx.clearRect(0, 0, W, H);
    var dark = root.getAttribute('data-theme') === 'dark';
    for (var i = 0; i < dots.length; i++) {
      var d = dots[i];
      d.x += d.vx; d.y += d.vy;
      if (d.y < -0.05) { d.y = 1.05; d.x = Math.random(); }
      if (d.x < -0.05) d.x = 1.05;
      if (d.x > 1.05) d.x = -0.05;
      ctx.beginPath();
      ctx.arc(d.x * W, d.y * H, d.r, 0, 6.2832);
      ctx.fillStyle = 'rgba(' + d.c + ',' + (d.a * (dark ? 1 : 0.55)) + ')';
      ctx.fill();
    }
    if (!reduced) requestAnimationFrame(frame);
  }
  frame();

  // WhatsApp booking form
  var form = document.getElementById('waForm');
  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var name = document.getElementById('fName').value.trim();
    var date = document.getElementById('fDate').value;
    var type = document.getElementById('fType').value;
    var num = document.getElementById('fNum').value;
    var venue = document.getElementById('fVenue').value.trim();
    var lines = ['Namaste! DJ POWER booking chahiye.'];
    if (name) lines.push('Naam: ' + name);
    if (date) lines.push('Date: ' + date);
    lines.push('Function: ' + type);
    if (venue) lines.push('Venue: ' + venue);
    var url = 'https://wa.me/' + num + '?text=' + encodeURIComponent(lines.join('\n'));
    window.open(url, '_blank', 'noopener');
  });

  // ---- v7 interactions ----
  var topbar = document.getElementById('topbar');
  var progress = document.getElementById('progress');
  var links = [].slice.call(document.querySelectorAll('.topnav a'));
  var secs = links.map(function (l) { return document.querySelector(l.getAttribute('href')); });
  function onScroll() {
    var y = window.scrollY, max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    topbar.classList.toggle('scrolled', y > 40);
    var cur = -1;
    secs.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < window.innerHeight * 0.4) cur = i; });
    links.forEach(function (l, i) { l.classList.toggle('active', i === cur); });
  }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  var menuBtn = document.getElementById('menuBtn'), nav = document.getElementById('topnav');
  menuBtn.addEventListener('click', function () {
    var o = nav.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', o);
  });
  links.forEach(function (l) { l.addEventListener('click', function () { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', false); }); });

  // cursor spotlight
  var spot = document.getElementById('spot');
  window.addEventListener('pointermove', function (e) { spot.style.left = e.clientX + 'px'; spot.style.top = e.clientY + 'px'; }, { passive: true });

  // hero rotor
  var rotor = document.getElementById('rotor');
  var words = ['Shaadi', 'Barat ka Rath', 'Navratri & Puja', 'Diwali', 'Visarjan', 'Birthday', 'Ramayan', 'Patakhe', 'Pickup Gadi'];
  var wi = 0;
  if (!reduced) setInterval(function () {
    rotor.classList.add('out');
    setTimeout(function () { wi = (wi + 1) % words.length; rotor.textContent = words[wi]; rotor.classList.remove('out'); }, 350);
  }, 2000);

  // services explorer
  var SERV = [
    { k: 'Shaadi & Barat', type: 'Shaadi', img: 'umbrellas', tag: 'SHAADI', t: 'Shaadi & Barat', d: 'Shaadi ka sabse bada celebration — dhamakedar sound aur lights ke saath, ekdam yaadgar.' },
    { k: 'Barat ka Rath', type: 'Barat / Rath', img: 'rath', tag: 'ROAD RATH', t: 'Barat ka Rath', d: 'Road rath jispar dulha baithta hai — barat ka full shaan wala look.' },
    { k: 'Patakhe', type: 'Patakhe (order par)', img: '', tag: 'ORDER PAR', t: 'Patakhe', d: 'Barat me jo patakhe phutte hain, wo bhi order par manage karwa diye jate hain.' },
    { k: 'Navratri · Puja · Diwali · Visarjan', type: 'Navratri / Lakshmi Puja / Diwali / Visarjan', img: 'pandal-idol', tag: 'FESTIVALS', t: 'Navratri, Lakshmi Puja, Diwali, Visarjan', d: 'Puja, jagran aur visarjan — sound aur lights ka poora intezaam.' },
    { k: 'Birthday · Ramayan', type: 'Birthday / Ramayan / Other program', img: 'hero-night', tag: 'PROGRAMS', t: 'Birthday, Ramayan aur baaki programs', d: 'Birthday ho ya Ramayan path, koi bhi program — jahan DJ chahiye, DJ POWER wahan.' },
    { k: 'Pickup Gadi', type: 'Pickup gadi (bhade ke liye)', img: 'front-lights', tag: 'BHADE PE', t: 'Pickup gadi bhade ke liye', d: 'Pickup gadi bhade ke liye bhi book hoti hai.' }
  ];
  var chips = document.getElementById('chips'), exImg = document.getElementById('exImg'), exMedia = document.getElementById('exMedia');
  var cur = 0;
  function show(i) {
    cur = i; var s = SERV[i];
    [].forEach.call(chips.children, function (c, j) { c.classList.toggle('on', j === i); c.setAttribute('aria-selected', j === i); });
    document.getElementById('exTag').textContent = s.tag;
    document.getElementById('exTitle').textContent = s.t;
    document.getElementById('exText').textContent = s.d;
    document.getElementById('exWa').href = 'https://wa.me/919648924137?text=' + encodeURIComponent('Namaste! DJ POWER, ' + s.t + ' ke liye booking chahiye.');
    if (s.img) {
      exMedia.classList.remove('noimg'); exImg.classList.add('swap');
      setTimeout(function () { exImg.src = 'img/' + s.img + '.jpg'; exImg.alt = s.t; exImg.classList.remove('swap'); }, 180);
    } else { exMedia.classList.add('noimg'); }
  }
  SERV.forEach(function (s, i) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.setAttribute('role', 'tab'); b.textContent = s.k;
    b.addEventListener('click', function () { show(i); b.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' }); });
    chips.appendChild(b);
  });
  show(0);
  document.getElementById('exBook').addEventListener('click', function () {
    document.getElementById('fType').value = SERV[cur].type;
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
    setTimeout(function () { document.getElementById('fName').focus({ preventScroll: true }); }, 700);
  });

  // gallery lightbox
  var gal = [].slice.call(document.querySelectorAll('.gallery img'));
  var lb = document.getElementById('lb'), lbImg = document.getElementById('lbImg'), li = 0;
  function openLb(i) { li = (i + gal.length) % gal.length; lbImg.src = gal[li].src; lbImg.alt = gal[li].alt; lb.hidden = false; document.body.style.overflow = 'hidden'; }
  function closeLb() { lb.hidden = true; document.body.style.overflow = ''; }
  gal.forEach(function (im, i) { im.addEventListener('click', function () { openLb(i); }); });
  document.getElementById('lbX').addEventListener('click', closeLb);
  document.getElementById('lbPrev').addEventListener('click', function () { openLb(li - 1); });
  document.getElementById('lbNext').addEventListener('click', function () { openLb(li + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') closeLb(); if (e.key === 'ArrowLeft') openLb(li - 1); if (e.key === 'ArrowRight') openLb(li + 1);
  });
  var tx = null;
  lb.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) { if (tx === null) return; var d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 50) openLb(li + (d < 0 ? 1 : -1)); tx = null; });
})();
