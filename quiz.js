// ============================================
// QUIZ.JS - Logika Penilaian & Game
// ============================================

var jawabanBenar = { 
  'quiz-1': 'B', 'quiz-2': 'B', 'quiz-3': 'A', 'quiz-4': 'B',
  'eval-1': 'B', 'eval-2': 'B', 'eval-3': 'C'
};
var penjelasanQuiz = {
  'quiz-1': 'Skala utama = 23 mm, nonius ke-5 = 0,5 mm. Total = 23,5 mm.',
  'quiz-2': 'Skala utama = 3,5 mm, putar ke-27 = 0,27 mm. Total = 3,77 mm.',
  'quiz-3': 'Mistar ketelitian 0,05 cm. Hasil = (14,70 ± 0,05) cm.',
  'quiz-4': 'Skala utama 47 mm, nonius ke-8 = 0,8 mm. Total = 47,8 mm = 4,78 cm.'
};
var pilihanUser = {};
var pilihanEvaluasi = {};

// Fungsi dipanggil saat klik opsi
function pilihOpsi(el, idSoal) {
  var parent = document.getElementById(idSoal);
  parent.querySelectorAll('.quiz-option').forEach(function(o) { o.classList.remove('selected'); });
  el.classList.add('selected');
  
  // Simpen jawaban user
  if (idSoal.startsWith('eval-')) {
    pilihanEvaluasi[idSoal] = el.dataset.answer;
  } else {
    pilihanUser[idSoal] = el.dataset.answer;
  }
}

// Fungsi cek jawaban untuk Latihan 1 & 2
function cekJawabanKuis(daftarIdSoal) {
  daftarIdSoal.forEach(function(idSoal) {
    var fb = document.getElementById('fb-' + idSoal);
    var opsi = document.getElementById(idSoal).querySelectorAll('.quiz-option');
    
    opsi.forEach(function(o) {
      o.classList.remove('correct', 'wrong');
      if (o.dataset.answer === jawabanBenar[idSoal]) o.classList.add('correct');
      else if (o.classList.contains('selected') && o.dataset.answer !== jawabanBenar[idSoal]) o.classList.add('wrong');
    });
    
    if (fb) {
      if (pilihanUser[idSoal] === jawabanBenar[idSoal]) {
        fb.className = 'quiz-feedback show correct-fb';
        fb.textContent = 'Benar! ' + penjelasanQuiz[idSoal];
      } else {
        fb.className = 'quiz-feedback show wrong-fb';
        fb.textContent = 'Kurang tepat. ' + penjelasanQuiz[idSoal];
      }
    }
  });
}

function cekQuiz12() { cekJawabanKuis(['quiz-1', 'quiz-2']); }
function cekQuiz13() { cekJawabanKuis(['quiz-3', 'quiz-4']); }

// Fungsi Evaluasi Akhir
function cekEvaluasi() {
  var skor = 0;
  Object.keys(pilihanEvaluasi).forEach(function(idSoal) {
    var opsi = document.getElementById(idSoal).querySelectorAll('.quiz-option');
    opsi.forEach(function(o) {
      o.classList.remove('correct', 'wrong');
      if (o.dataset.answer === jawabanBenar[idSoal]) o.classList.add('correct');
      else if (o.dataset.answer === pilihanEvaluasi[idSoal] && o.dataset.answer !== jawabanBenar[idSoal]) o.classList.add('wrong');
    });
    if (pilihanEvaluasi[idSoal] === jawabanBenar[idSoal]) skor++;
  });
  
  var hasil = document.getElementById('eval-result');
  hasil.classList.add('show');
  document.getElementById('eval-score').textContent = skor;
}


/* ============================================
   GAMBAR QUIZ CANVAS (Soal Slide 12)
   ============================================ */
function gambarQuizCanvas() {
  // Jangka sorong statis
  var cv1 = document.getElementById('quiz-canvas-1'); 
  if (cv1) {
    var c1 = cv1.getContext('2d'); var w = 700, h = 180;
    c1.clearRect(0, 0, w, h); c1.fillStyle = '#0A0F1A'; c1.fillRect(0, 0, w, h);
    var mY = 50, mH = 24, sX = 60;
    c1.fillStyle = '#D4C9A8'; c1.fillRect(sX, mY, 550, mH);
    c1.fillStyle = '#0B1426'; c1.font = '10px DM Sans'; c1.textAlign = 'center';
    for (var i = 0; i <= 40; i++) { var x = sX + i * 13; if (x > 610) break; if (i % 10 === 0) { c1.fillRect(x, mY, 1.5, 22); c1.fillText((i / 10).toString(), x, mY - 5); } else if (i % 5 === 0) { c1.fillRect(x, mY, 1, 16); } else { c1.fillRect(x, mY, 0.5, 10); } }
    c1.fillStyle = '#8B7D5E'; c1.fillRect(sX, mY - 16, 6, 56);
    var jawX = sX + 23.5 * 13;
    c1.fillStyle = '#8B7D5E'; c1.fillRect(jawX, mY - 16, 6, 56);
    c1.fillStyle = 'rgba(74,144,200,0.35)'; c1.fillRect(sX + 6, mY + 2, jawX - sX - 6, mH - 4);
    var vY = mY + mH + 6;
    c1.fillStyle = '#C8B896'; c1.fillRect(jawX, vY, 125, 20);
    c1.fillStyle = '#0B1426'; c1.font = '8px DM Sans';
    for (var i = 0; i <= 10; i++) { var vx = jawX + i * 11.7; c1.fillRect(vx, vY, 1, i % 5 === 0 ? 14 : 9); if (i % 5 === 0) c1.fillText(i.toString(), vx, vY + 30); }
    c1.strokeStyle = '#C8963E'; c1.lineWidth = 1.5; c1.setLineDash([3, 3]);
    c1.beginPath(); c1.moveTo(jawX + 5 * 11.7, vY); c1.lineTo(jawX + 5 * 11.7, vY + 20); c1.stroke(); c1.setLineDash([]);
    c1.fillStyle = '#C8963E'; c1.font = '12px DM Sans'; c1.textAlign = 'left'; c1.fillText('Nonius ke-5 segaris', jawX + 70, vY + 14);
  }
  
  // Mikrometer statis
  var cv2 = document.getElementById('quiz-canvas-2'); 
  if (cv2) {
    var c2 = cv2.getContext('2d'); var w = 500, h = 180;
    c2.clearRect(0, 0, w, h); c2.fillStyle = '#0A0F1A'; c2.fillRect(0, 0, w, h);
    var cy = 70;
    c2.fillStyle = '#D0C8B8'; c2.fillRect(60, cy - 28, 120, 56); c2.strokeStyle = '#888'; c2.lineWidth = 1; c2.strokeRect(60, cy - 28, 120, 56);
    c2.strokeStyle = '#333'; c2.lineWidth = 1.5; c2.beginPath(); c2.moveTo(60, cy); c2.lineTo(180, cy); c2.stroke();
    c2.fillStyle = '#222'; c2.font = '9px DM Sans'; c2.textAlign = 'center';
    for (var i = 0; i <= 8; i++) { var sx = 70 + i * 12; c2.fillRect(sx, cy - 2, 1, -12); c2.fillText(i.toString(), sx, cy - 16); }
    for (var i = 0; i <= 8; i++) { var sx = 76 + i * 12; c2.fillRect(sx, cy + 2, 0.7, 12); }
    c2.fillStyle = '#8A8070'; c2.fillRect(180, cy - 45, 60, 90); c2.strokeStyle = '#6A6050'; c2.strokeRect(180, cy - 45, 60, 90);
    c2.fillStyle = '#222'; c2.font = '8px DM Sans';
    for (var i = -3; i <= 3; i++) { var num = (27 + i + 50) % 50; var y = cy + i * 10; c2.fillRect(185, y, 25, 0.5); c2.fillText(num.toString(), 198, y + 3); }
    c2.strokeStyle = '#C8963E'; c2.lineWidth = 2; c2.beginPath(); c2.moveTo(65, cy); c2.lineTo(180, cy); c2.stroke();
    c2.fillStyle = '#C8963E'; c2.font = '11px DM Sans'; c2.textAlign = 'left';
    c2.fillText('Skala utama: 3 + 0,5 = 3,5 mm', 60, h - 25); c2.fillText('Skala putar: 27', 300, h - 25);
  }
}


/* ============================================
   GAME (Slide 19)
   ============================================ */
var soalGame = [
  { q: 'Mengukur diameter luar pipa PVC 3 cm', opts: ['Mistar', 'Jangka Sorong', 'Mikrometer', 'Neraca'], ans: 1 },
  { q: 'Mengukur diameter kawat tembaga halus', opts: ['Mistar', 'Jangka Sorong', 'Mikrometer', 'Termometer'], ans: 2 },
  { q: 'Mengukur panjang meja kelas', opts: ['Mistar', 'Jangka Sorong', 'Mikrometer', 'Neraca'], ans: 0 },
  { q: 'Mengukur kedalaman lubang di kayu', opts: ['Mistar', 'Jangka Sorong', 'Mikrometer', 'Stopwatch'], ans: 1 },
  { q: 'Mengukur massa 250 gram gula', opts: ['Mistar', 'Jangka Sorong', 'Mikrometer', 'Neraca'], ans: 3 }
];
var indexGame = 0, skorGame = 0, sudahJawab = false;

function mulaiGame() {
  indexGame = 0; skorGame = 0; sudahJawab = false;
  document.getElementById('game-score').textContent = '0';
  document.getElementById('game-next-btn').style.display = 'none';
  document.getElementById('game-feedback').textContent = '';
  tampilSoalGame();
}

function tampilSoalGame() {
  if (indexGame >= soalGame.length) {
    document.getElementById('game-scenario').textContent = 'Game selesai! Skor: ' + skorGame + '/' + soalGame.length;
    document.getElementById('game-choices').innerHTML = '';
    document.getElementById('game-next-btn').style.display = 'none';
    document.getElementById('game-feedback').textContent = skorGame >= 4 ? 'Luar biasa!' : 'Terus belajar ya!';
    return;
  }
  sudahJawab = false;
  var soal = soalGame[indexGame];
  document.getElementById('game-current').textContent = indexGame + 1;
  document.getElementById('game-scenario').textContent = soal.q;
  document.getElementById('game-feedback').textContent = '';
  document.getElementById('game-next-btn').style.display = 'none';
  
  var html = '';
  soal.opts.forEach(function(opt, i) {
    html += '<div class="game-choice" onclick="jawabGame(' + i + ', this)">' + opt + '</div>';
  });
  document.getElementById('game-choices').innerHTML = html;
  document.getElementById('game-timer-fill').style.width = '100%';
}

function jawabGame(idx, el) {
  if (sudahJawab) return;
  sudahJawab = true;
  var soal = soalGame[indexGame];
  var pilihan = document.querySelectorAll('.game-choice');
  
  pilihan.forEach(function(ch, i) {
    if (i === soal.ans) ch.classList.add('correct');
    else if (i === idx && idx !== soal.ans) ch.classList.add('wrong');
  });
  
  if (idx === soal.ans) {
    skorGame++;
    document.getElementById('game-feedback').innerHTML = '<span style="color:var(--success)">Benar!</span> ' + soal.opts[soal.ans] + ' paling tepat.';
  } else {
    document.getElementById('game-feedback').innerHTML = '<span style="color:var(--error)">Kurang tepat.</span> Jawaban: ' + soal.opts[soal.ans] + '.';
  }
  document.getElementById('game-score').textContent = skorGame;
  document.getElementById('game-next-btn').style.display = 'inline-block';
}

function soalBerikutnya() { indexGame++; tampilSoalGame(); }