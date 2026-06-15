// ============================================
// SIMULATIONS.JS - Menggambar Alat Ukur di Canvas
// ============================================
// Catatan: Logika pembacaan nonius dan skala putar 
// agak membingungkan awalnya, udah ditrial-error berkali-kali.

// Variabel global simulasi
var lagiGeserMistar = false;
var posisiObjekMistar = 40;
var lebarObjekMistar = 85;

var lagiGeserJangka = false;
var posisiRahang = 23.5; // posisi rahang jangka sorong

var lagiGeserMikro = false;
var nilaiPutaran = 0; // nilai skala putar mikrometer

// Helper: Ambil posisi X mouse di canvas (ngitung scaling)
function ambilPosX(e, canvas) {
  var rect = canvas.getBoundingClientRect();
  var scaleX = canvas.width / rect.width;
  var clientX = (e.touches ? e.touches[0].clientX : e.clientX);
  return (clientX - rect.left) * scaleX;
}

/* ============================================
   MISTAR
   ============================================ */
function initMistar() {
  var cv = document.getElementById('ruler-canvas');
  if (!cv) return;
  
  cv.onmousedown = cv.ontouchstart = function(e) {
    e.preventDefault();
    var mx = ambilPosX(e, cv);
    if (mx > posisiObjekMistar && mx < posisiObjekMistar + lebarObjekMistar) {
      lagiGeserMistar = true;
    }
  };
  cv.onmousemove = cv.ontouchmove = function(e) {
    if (!lagiGeserMistar) return;
    e.preventDefault();
    var mx = ambilPosX(e, cv);
    posisiObjekMistar = Math.max(30, Math.min(700 - lebarObjekMistar, mx - lebarObjekMistar / 2));
    gambarMistar();
  };
  cv.onmouseup = cv.ontouchend = function() { lagiGeserMistar = false; };
  
  gambarMistar();
}

function gambarMistar() {
  var cv = document.getElementById('ruler-canvas');
  if (!cv) return;
  var c = cv.getContext('2d'), w = cv.width, h = cv.height;
  c.clearRect(0, 0, w, h); c.fillStyle = '#0A0F1A'; c.fillRect(0, 0, w, h);
  
  var rY = 60, rH = 50, sX = 20;
  
  // Kayu mistar
  c.fillStyle = '#F5E6C8'; c.fillRect(sX, rY, 750, rH);
  c.fillStyle = '#0B1426'; c.font = '10px DM Sans'; c.textAlign = 'center';
  
  // Garis skala mm ke cm
  for (var i = 0; i <= 150; i++) {
    var x = sX + i * 5; if (x > 770) break;
    if (i % 10 === 0) { c.fillRect(x, rY, 1.5, 25); c.fillText((i / 10).toString(), x, rY - 6); }
    else if (i % 5 === 0) { c.fillRect(x, rY, 1, 18); }
    else { c.fillRect(x, rY, 0.5, 12); }
  }
  c.font = '11px DM Sans'; c.fillStyle = '#888'; c.fillText('cm', sX + 760, rY - 6);
  
  // Benda yang diukur (biru)
  c.fillStyle = 'rgba(74,144,200,0.6)'; c.fillRect(posisiObjekMistar, rY + 5, lebarObjekMistar, rH - 10);
  c.strokeStyle = '#4A90C8'; c.lineWidth = 2; c.strokeRect(posisiObjekMistar, rY + 5, lebarObjekMistar, rH - 10);
  
  // Garis panduan putus-putus
  c.setLineDash([4, 4]); c.strokeStyle = '#C8963E'; c.lineWidth = 1;
  [posisiObjekMistar, posisiObjekMistar + lebarObjekMistar].forEach(function(lx) {
    c.beginPath(); c.moveTo(lx, rY + rH + 5); c.lineTo(lx, h - 30); c.stroke();
  });
  c.setLineDash([]);
  
  // Hitung hasil
  // tadinya pake rumus (posisiObjekMistar - sX) * 2 terus langsung dikurangi, tapi sering error
  // dikulitik ternyata musti dihitung start dan endnya dulu baru dikurangin
  var mmAwal = (posisiObjekMistar - sX) * 2;
  var mmAkhir = (posisiObjekMistar + lebarObjekMistar - sX) * 2;
  var panjangMm = mmAkhir - mmAwal;
  var panjangCm = panjangMm / 10;
  
  c.fillStyle = '#C8963E'; c.font = '14px DM Sans'; c.textAlign = 'center';
  c.fillText(panjangMm.toFixed(1) + ' mm = ' + panjangCm.toFixed(2) + ' cm', (posisiObjekMistar * 2 + lebarObjekMistar) / 2, h - 14);
  
  document.getElementById('ruler-reading').innerHTML = panjangMm.toFixed(1) + ' mm <small>= ' + panjangCm.toFixed(2) + ' cm | Hasil Pembacaan Mistar</small>';
}

function resetRuler() { posisiObjekMistar = 40; lebarObjekMistar = 85; gambarMistar(); }
function acakMistar() { posisiObjekMistar = 80 + Math.random() * 400; lebarObjekMistar = 40 + Math.random() * 120; gambarMistar(); }


/* ============================================
   JANGKA SORONG
   ============================================ */
function initJangkaSorong() {
  var cv = document.getElementById('caliper-canvas');
  if (!cv) return;
  
  cv.onmousedown = cv.ontouchstart = function(e) {
    e.preventDefault();
    var mx = ambilPosX(e, cv);
    var jawPx = 80 + posisiRahang * 13;
    if (mx > jawPx - 30 && mx < jawPx + 60) lagiGeserJangka = true;
  };
  cv.onmousemove = cv.ontouchmove = function(e) {
    if (!lagiGeserJangka) return;
    e.preventDefault();
    var mx = ambilPosX(e, cv);
    posisiRahang = Math.max(0, Math.min(50, (mx - 80) / 13));
    gambarJangka();
  };
  cv.onmouseup = cv.ontouchend = function() { lagiGeserJangka = false; };
  
  gambarJangka();
}

function gambarJangka() {
  var cv = document.getElementById('caliper-canvas');
  if (!cv) return;
  var c = cv.getContext('2d'), w = cv.width, h = cv.height;
  c.clearRect(0, 0, w, h); c.fillStyle = '#0A0F1A'; c.fillRect(0, 0, w, h);
  
  var mY = 90, mH = 26, sX = 60;
  
  // Skala utama (kayu)
  c.fillStyle = '#D4C9A8'; c.fillRect(sX, mY, 650, mH);
  c.fillStyle = '#0B1426'; c.font = '10px DM Sans'; c.textAlign = 'center';
  for (var i = 0; i <= 50; i++) {
    var x = sX + i * 13; if (x > 710) break;
    if (i % 10 === 0) { c.fillRect(x, mY, 1.5, 22); c.fillText((i / 10).toString(), x, mY - 5); }
    else if (i % 5 === 0) { c.fillRect(x, mY, 1, 16); }
    else { c.fillRect(x, mY, 0.5, 10); }
  }
  c.fillText('cm', sX + 660, mY - 5);
  
  // Rahang tetap kiri
  c.fillStyle = '#8B7D5E'; c.fillRect(sX, mY - 20, 6, 66); c.fillRect(sX, mY - 20, 40, 6);
  
  // Rahang geser kanan
  var jawX = sX + posisiRahang * 13;
  c.fillStyle = '#8B7D5E'; c.fillRect(jawX, mY - 20, 6, 66); c.fillRect(jawX, mY + mH, 6, 60);
  
  // Benda diukur
  c.fillStyle = 'rgba(74,144,200,0.35)'; c.fillRect(sX + 6, mY + 2, jawX - sX - 6, mH - 4);
  
  // Skala nonius
  var vY = mY + mH + 8, vH = 22;
  c.fillStyle = '#C8B896'; c.fillRect(jawX, vY, 125, vH);
  c.fillStyle = '#0B1426'; c.font = '8px DM Sans';
  for (var i = 0; i <= 10; i++) {
    var vx = jawX + i * 11.7;
    c.fillRect(vx, vY, 1, i % 5 === 0 ? 16 : 10);
    if (i % 5 === 0) c.fillText(i.toString(), vx, vY + vH + 12);
  }
  
  // Hitung hasil baca jangka sorong
  var skalaUtamaMm = Math.floor(posisiRahang);
  var sisaDesimal = posisiRahang - skalaUtamaMm;
  
  // Cari garis nonius yang paling segaris
  // tadinya pake math round biasa tapi overflow, musti dibatasin
  var garisNonius = Math.round(sisaDesimal * 10);
  if (garisNonius >= 10) {
      garisNonius = 0;
  }
  
  var totalMm = (skalaUtamaMm + garisNonius * 0.1).toFixed(1);
  var totalCm = (totalMm / 10).toFixed(2);
  
  c.fillStyle = '#C8963E'; c.font = 'bold 12px DM Sans'; c.textAlign = 'left';
  c.fillText('Skala Utama: ' + skalaUtamaMm + ' mm', sX, h - 40);
  c.fillText('Skala Nonius: ' + garisNonius + ' x 0,1 = ' + (garisNonius * 0.1).toFixed(1) + ' mm', sX, h - 20);
  
  document.getElementById('caliper-reading').innerHTML = totalMm + ' mm <small>= ' + totalCm + ' cm | Skala Utama + Nonius</small>';
}

function resetJangka() { posisiRahang = 0; gambarJangka(); }
function acakJangka() { posisiRahang = Math.round((5 + Math.random() * 40) * 10) / 10; gambarJangka(); }


/* ============================================
   MIKROMETER SEKRUP
   ============================================ */
function initMikrometer() {
  var cv = document.getElementById('micrometer-canvas');
  if (!cv) return;
  
  cv.onmousedown = cv.ontouchstart = function(e) {
    e.preventDefault();
    var mx = ambilPosX(e, cv);
    if (mx > 350) lagiGeserMikro = true;
  };
  cv.onmousemove = cv.ontouchmove = function(e) {
    if (!lagiGeserMikro) return;
    e.preventDefault();
    var mx = ambilPosX(e, cv);
    nilaiPutaran = Math.max(0, Math.min(15, (mx - 350) / 23));
    gambarMikrometer();
  };
  cv.onmouseup = cv.ontouchend = function() { lagiGeserMikro = false; };
  
  gambarMikrometer();
}

function gambarMikrometer() {
  var cv = document.getElementById('micrometer-canvas');
  if (!cv) return;
  var c = cv.getContext('2d'), w = cv.width, h = cv.height;
  c.clearRect(0, 0, w, h); c.fillStyle = '#0A0F1A'; c.fillRect(0, 0, w, h);
  
  var cy = 140;
  
  // Frame C
  c.fillStyle = '#5A5040'; c.strokeStyle = '#7A7060'; c.lineWidth = 2;
  c.beginPath();
  c.moveTo(80, cy - 60); c.lineTo(80, cy + 80); c.lineTo(200, cy + 80);
  c.lineTo(200, cy + 40); c.lineTo(140, cy + 40); c.lineTo(140, cy - 20);
  c.lineTo(200, cy - 20); c.lineTo(200, cy - 60); c.closePath();
  c.fill(); c.stroke();
  
  // Anvil (landasan)
  c.fillStyle = '#A09080'; c.fillRect(140, cy - 8, 80, 16);
  
  // Spindle (poros bergerak)
  var spindleEnd = 220 + nilaiPutaran * 13;
  c.fillStyle = '#B0A090'; c.fillRect(spindleEnd, cy - 7, 130 - nilaiPutaran * 13, 14);
  
  // Sleeve (selubung tetap)
  c.fillStyle = '#D0C8B8'; c.fillRect(340, cy - 30, 80, 60);
  c.strokeStyle = '#888'; c.lineWidth = 1; c.strokeRect(340, cy - 30, 80, 60);
  c.strokeStyle = '#333'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(340, cy); c.lineTo(420, cy); c.stroke();
  
  // Skala utama di atas garis (mm)
  c.fillStyle = '#222'; c.font = '9px DM Sans'; c.textAlign = 'center';
  var mmKelihatan = Math.floor(nilaiPutaran);
  for (var i = 0; i <= 15; i++) {
    var sx = 345 + i * 5; if (sx > 415) break;
    if (i <= mmKelihatan) {
      c.fillRect(sx, cy - 2, 1, -14);
      if (i % 5 === 0) c.fillText(i.toString(), sx, cy - 18);
    } else {
      c.globalAlpha = 0.3; // Tampil redup kalau ketutup
      c.fillRect(sx, cy - 2, 1, -14);
      if (i % 5 === 0) c.fillText(i.toString(), sx, cy - 18);
      c.globalAlpha = 1;
    }
  }
  
  // Skala bawah garis (0.5 mm)
  for (var i = 0; i <= 15; i++) {
    var sx = 347.5 + i * 5; if (sx > 415) break;
    var kelihatan = (i + 0.5) <= nilaiPutaran;
    if (kelihatan == false) { c.globalAlpha = 0.3; }
    c.fillRect(sx, cy + 2, 0.7, 14);
    if (kelihatan == false) { c.globalAlpha = 1; } // jangan lupa balikin
  }
  
  // Thimble (selongsong berputar)
  c.fillStyle = '#8A8070'; c.beginPath(); c.arc(420, cy, 50, -Math.PI / 2, Math.PI / 2); c.fill();
  c.fillStyle = '#9A9080'; c.fillRect(420, cy - 50, 70, 100);
  c.strokeStyle = '#6A6050'; c.lineWidth = 1; c.strokeRect(420, cy - 50, 70, 100);
  
  // Angka di thimble
  var angkaThimble = Math.round((nilaiPutaran - Math.floor(nilaiPutaran)) * 50);
  c.fillStyle = '#222'; c.font = '8px DM Sans'; c.textAlign = 'center';
  for (var i = -5; i <= 5; i++) {
    var num = (angkaThimble + i + 50) % 50;
    var y = cy + i * 9;
    if (y > cy - 45 && y < cy + 45) {
      c.fillRect(425, y, 30, 0.5);
      c.fillText(num.toString(), 442, y + 3);
    }
  }
  
  // Garis pembacaan horizontal
  c.strokeStyle = '#C8963E'; c.lineWidth = 2;
  c.beginPath(); c.moveTo(345, cy); c.lineTo(424, cy); c.stroke();
  
  // Benda diukur
  if (nilaiPutaran > 0.5) {
    c.fillStyle = 'rgba(74,144,200,0.4)'; c.fillRect(220, cy - 6, spindleEnd - 220, 12);
  }
  
  // Perhitungan hasil mikrometer
  var utamaBulat = Math.floor(nilaiPutaran);
  var adaSetengah = (nilaiPutaran - utamaBulat) >= 0.5;
  var nilaiSleeve = utamaBulat + (adaSetengah ? 0.5 : 0);
  
  var skalaPutar = Math.round((nilaiPutaran - nilaiSleeve) * 100);
  if (skalaPutar < 0) skalaPutar = 0;
  if (skalaPutar > 49) skalaPutar = 49;
  
  // tadinya (nilaiSleeve + (skalaPutar * 0.01)), tapi dibikin gini biar jelas
  var hasilAkhir = nilaiSleeve + (skalaPutar * 0.01);
  
  c.fillStyle = '#C8963E'; c.font = 'bold 13px DM Sans'; c.textAlign = 'left';
  c.fillText('Skala Utama: ' + nilaiSleeve.toFixed(1) + ' mm', 60, h - 60);
  c.fillText('Skala Putar: ' + skalaPutar + ' x 0,01 = ' + (skalaPutar * 0.01).toFixed(2) + ' mm', 60, h - 40);
  c.fillText('Hasil: ' + nilaiSleeve.toFixed(1) + ' + ' + (skalaPutar * 0.01).toFixed(2) + ' = ' + hasilAkhir.toFixed(2) + ' mm', 60, h - 18);
  
  document.getElementById('micrometer-reading').innerHTML = hasilAkhir.toFixed(2) + ' mm <small>Skala Utama + Skala Putar</small>';
}

function resetMikro() { nilaiPutaran = 0; gambarMikrometer(); }
function acakMikro() { nilaiPutaran = Math.round((1 + Math.random() * 12) * 100) / 100; gambarMikrometer(); }


/* ============================================
   INISIALISASI SLIDE SAAT DIKUNJUNGI
   Dipanggil dari app.js
   ============================================ */
function initKontenSlide(n) {
  if (n === 7) initMistar();
  if (n === 8) initJangkaSorong();
  if (n === 9) initMikrometer();
  if (n === 12 && typeof gambarQuizCanvas === 'function') {
    setTimeout(gambarQuizCanvas, 100);
  }
  if (n === 19 && typeof mulaiGame === 'function') {
    mulaiGame();
  }
}