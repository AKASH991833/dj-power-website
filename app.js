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
    var venue = document.getElementById('fVenue').value.trim();
    var lines = ['Namaste! DJ POWER booking chahiye.'];
    if (name) lines.push('Naam: ' + name);
    if (date) lines.push('Date: ' + date);
    lines.push('Function: ' + type);
    if (venue) lines.push('Venue: ' + venue);
    var url = 'https://wa.me/919648924137?text=' + encodeURIComponent(lines.join('\n'));
    window.open(url, '_blank', 'noopener');
  });
})();
