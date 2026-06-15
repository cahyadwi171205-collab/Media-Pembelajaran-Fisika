// ============================================
// APP.JS - Navigasi & Background
// Cahya Dwi Nurika
// ============================================

// Catatan: bikin transisi slide-nya agak lama dikit (300ms) 
// biar nggak keliatan glitching pas pindah halaman

var TOTAL_SLIDES = 21;
var slideSekarang = 1;
var lagiTransisi = false;

var progressBar = document.getElementById('progress-bar');
var slideCounter = document.getElementById('slide-counter');
var btnPrev = document.getElementById('btn-prev');
var btnNext = document.getElementById('btn-next');
var sidebar = document.getElementById('sidebar');
var sidebarOverlay = document.getElementById('sidebar-overlay');
var menuToggle = document.getElementById('menu-toggle');
var navItems = document.querySelectorAll('.nav-item');

function goToSlide(n) {
  // Jangan pindah kalau lagi transisi atau halaman sama
  if (lagiTransisi || n === slideSekarang || n < 1 || n > TOTAL_SLIDES) return;
  lagiTransisi = true;
  
  var arah = n > slideSekarang ? 'up' : 'down';
  var slideLama = document.getElementById('slide-' + slideSekarang);
  var slideBaru = document.getElementById('slide-' + n);
  
  // Efek exit slide lama
  slideLama.classList.remove('active');
  slideLama.classList.add(arah === 'up' ? 'exit-up' : 'exit-down');
  
  setTimeout(function() {
    // Munculin slide baru
    slideBaru.classList.add('active');
    slideLama.classList.remove('exit-up', 'exit-down');
    slideSekarang = n;
    updateTampilanNav();
    
    // Inisialisasi canvas kalau ada di slide itu
    if (typeof initKontenSlide === 'function') {
      initKontenSlide(n);
    }
    
    setTimeout(function() { lagiTransisi = false; }, 100);
  }, 300);
  
  tutupSidebar();
}

function nextSlide() { goToSlide(slideSekarang + 1); }
function prevSlide() { goToSlide(slideSekarang - 1); }

function updateTampilanNav() {
  progressBar.style.width = (slideSekarang / TOTAL_SLIDES * 100) + '%';
  slideCounter.innerHTML = '<span>' + slideSekarang + '</span> / ' + TOTAL_SLIDES;
  btnPrev.disabled = slideSekarang === 1;
  btnNext.disabled = slideSekarang === TOTAL_SLIDES;
  
  navItems.forEach(function(item) {
    var s = parseInt(item.dataset.slide);
    item.classList.toggle('active', s === slideSekarang);
  });
}

// Event listener sidebar
navItems.forEach(function(item) {
  item.addEventListener('click', function() { goToSlide(parseInt(item.dataset.slide)); });
});

menuToggle.addEventListener('click', function() {
  sidebar.classList.toggle('open');
  sidebarOverlay.classList.toggle('show');
});
sidebarOverlay.addEventListener('click', tutupSidebar);

function tutupSidebar() {
  sidebar.classList.remove('open');
  sidebarOverlay.classList.remove('show');
}

// Keyboard shortcut (panah kiri/kanan)
document.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); nextSlide(); }
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); prevSlide(); }
  if (e.key === 'Escape') tutupSidebar();
});


/* ============================================
   PARTIKEL BACKGROUND (Kertas Milimeter Block)
   ============================================ */
var bgCanvas = document.getElementById('bg-canvas');
var bgCtx = bgCanvas.getContext('2d');
var titikPartikel = [];

function resizeBackground() { 
  bgCanvas.width = window.innerWidth; 
  bgCanvas.height = window.innerHeight; 
}
resizeBackground();
window.addEventListener('resize', resizeBackground);

function Partikel() {
  this.x = Math.random() * bgCanvas.width;
  this.y = Math.random() * bgCanvas.height;
  this.ukuran = Math.random() * 2 + 0.5;
  this.kecepatanX = (Math.random() - 0.5) * 0.3;
  this.kecepatanY = (Math.random() - 0.5) * 0.3;
  this.opacity = Math.random() * 0.3 + 0.05;
}
Partikel.prototype.update = function() {
  this.x += this.kecepatanX; 
  this.y += this.kecepatanY;
  if (this.x < 0 || this.x > bgCanvas.width) this.kecepatanX *= -1;
  if (this.y < 0 || this.y > bgCanvas.height) this.kecepatanY *= -1;
};
Partikel.prototype.gambar = function() {
  bgCtx.beginPath();
  bgCtx.arc(this.x, this.y, Math.max(0.5, this.ukuran), 0, Math.PI * 2);
  bgCtx.fillStyle = 'rgba(200,150,62,' + this.opacity + ')';
  bgCtx.fill();
};

// Bikin 60 titik partikel
for (var i = 0; i < 60; i++) titikPartikel.push(new Partikel());

function animasiBackground() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  
  // Gambar grid milimeter block
  bgCtx.strokeStyle = 'rgba(26,46,80,0.15)'; bgCtx.lineWidth = 0.5;
  for (var x = 0; x < bgCanvas.width; x += 40) { bgCtx.beginPath(); bgCtx.moveTo(x, 0); bgCtx.lineTo(x, bgCanvas.height); bgCtx.stroke(); }
  for (var y = 0; y < bgCanvas.height; y += 40) { bgCtx.beginPath(); bgCtx.moveTo(0, y); bgCtx.lineTo(bgCanvas.width, y); bgCtx.stroke(); }
  
  // Gambar & update partikel
  titikPartikel.forEach(function(p) { p.update(); p.gambar(); });
  
  // Garis penghubung antar partikel yang dekat
  for (var i = 0; i < titikPartikel.length; i++) {
    for (var j = i + 1; j < titikPartikel.length; j++) {
      var dx = titikPartikel[i].x - titikPartikel[j].x, dy = titikPartikel[i].y - titikPartikel[j].y;
      var jarak = Math.sqrt(dx * dx + dy * dy);
      if (jarak < 120) {
        bgCtx.beginPath(); 
        bgCtx.moveTo(titikPartikel[i].x, titikPartikel[i].y); 
        bgCtx.lineTo(titikPartikel[j].x, titikPartikel[j].y);
        bgCtx.strokeStyle = 'rgba(200,150,62,' + (0.06 * (1 - jarak / 120)) + ')';
        bgCtx.stroke();
      }
    }
  }
  requestAnimationFrame(animasiBackground);
}
animasiBackground();

// Update nav pas pertama kali buka
updateTampilanNav();