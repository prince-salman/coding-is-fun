export const FLAPPY_BIRD_HTML = String.raw`<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Flappy Bird HTML</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: Arial, sans-serif; user-select: none; }
    body { min-height: 100vh; display: grid; place-items: center; background: #111827; color: white; overflow: hidden; }
    .wrap { display: grid; gap: 12px; justify-items: center; }
    h1 { font-size: 22px; letter-spacing: .3px; }
    canvas { width: min(92vw, 400px); height: min(80vh, 600px); max-height: 600px; border: 3px solid #0f172a; border-radius: 18px; background: linear-gradient(#6ee7ff, #bae6fd); box-shadow: 0 18px 45px rgba(0,0,0,.45); touch-action: manipulation; }
    p { color: #cbd5e1; font-size: 13px; text-align: center; }
    kbd { background: #0f172a; border: 1px solid #475569; border-radius: 5px; padding: 2px 6px; color: #e2e8f0; }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>Flappy Bird HTML</h1>
    <canvas id="gameCanvas" width="400" height="600"></canvas>
    <p>Tekan <kbd>Space</kbd> / klik / tap untuk terbang. Hindari pipa.</p>
  </div>
  <script>
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    const bird = { x: 85, y: 230, r: 17, vy: 0 };
    const pipes = [];
    const gravity = 0.42;
    const flapPower = -7.2;
    const gap = 145;
    let frame = 0;
    let score = 0;
    let bestScore = 0;
    let started = false;
    let gameOver = false;

    function drawBird() {
      ctx.save();
      ctx.translate(bird.x, bird.y);
      ctx.fillStyle = "#facc15";
      ctx.beginPath();
      ctx.arc(0, 0, bird.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#f97316";
      ctx.beginPath();
      ctx.moveTo(14, -2);
      ctx.lineTo(30, 5);
      ctx.lineTo(14, 11);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = "#111827";
      ctx.beginPath();
      ctx.arc(7, -6, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawBackground() {
      const grd = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grd.addColorStop(0, "#38bdf8");
      grd.addColorStop(0.65, "#bae6fd");
      grd.addColorStop(1, "#22c55e");
      ctx.fillStyle = grd;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(255,255,255,.75)";
      for (let i = 0; i < 4; i++) {
        const x = ((frame * -0.35) + i * 140) % 560 - 80;
        ctx.beginPath();
        ctx.ellipse(x, 88 + i * 30, 38, 12, 0, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function createPipe() {
      const top = 80 + Math.random() * 240;
      pipes.push({ x: canvas.width, top, passed: false });
    }

    function drawPipes() {
      ctx.fillStyle = "#16a34a";
      pipes.forEach(pipe => {
        ctx.fillRect(pipe.x, 0, 58, pipe.top);
        ctx.fillRect(pipe.x, pipe.top + gap, 58, canvas.height - pipe.top - gap);
        ctx.fillStyle = "#15803d";
        ctx.fillRect(pipe.x - 5, pipe.top - 22, 68, 22);
        ctx.fillRect(pipe.x - 5, pipe.top + gap, 68, 22);
        ctx.fillStyle = "#16a34a";
      });
    }

    function drawScore() {
      ctx.fillStyle = "#fff";
      ctx.strokeStyle = "rgba(15,23,42,.65)";
      ctx.lineWidth = 5;
      ctx.font = "bold 42px Arial";
      ctx.textAlign = "center";
      ctx.strokeText(score, canvas.width / 2, 62);
      ctx.fillText(score, canvas.width / 2, 62);
    }

    function drawStartScreen() {
      ctx.fillStyle = "rgba(15,23,42,.72)";
      ctx.fillRect(40, 190, 320, 150);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 28px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Flappy Bird HTML", canvas.width / 2, 238);
      ctx.font = "15px Arial";
      ctx.fillText("Klik / Space untuk mulai", canvas.width / 2, 276);
      ctx.fillText("Best: " + bestScore, canvas.width / 2, 306);
    }

    function drawGameOver() {
      ctx.fillStyle = "rgba(15,23,42,.78)";
      ctx.fillRect(48, 190, 304, 175);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 30px Arial";
      ctx.textAlign = "center";
      ctx.fillText("Game Over", canvas.width / 2, 235);
      ctx.font = "17px Arial";
      ctx.fillText("Score: " + score, canvas.width / 2, 275);
      ctx.fillText("Best: " + bestScore, canvas.width / 2, 305);
      ctx.font = "14px Arial";
      ctx.fillText("Klik / Space untuk restart", canvas.width / 2, 335);
    }

    function update() {
      if (!started || gameOver) return;
      frame += 1;
      bird.vy += gravity;
      bird.y += bird.vy;
      if (frame % 92 === 0) createPipe();
      pipes.forEach(pipe => {
        pipe.x -= 2.4;
        if (!pipe.passed && pipe.x + 58 < bird.x) {
          pipe.passed = true;
          score += 1;
          bestScore = Math.max(bestScore, score);
        }
      });
      while (pipes.length && pipes[0].x < -70) pipes.shift();
      if (bird.y - bird.r < 0 || bird.y + bird.r > canvas.height) gameOver = true;
      pipes.forEach(pipe => {
        const insideX = bird.x + bird.r > pipe.x && bird.x - bird.r < pipe.x + 58;
        const hitTop = bird.y - bird.r < pipe.top;
        const hitBottom = bird.y + bird.r > pipe.top + gap;
        if (insideX && (hitTop || hitBottom)) gameOver = true;
      });
    }

    function render() {
      drawBackground();
      drawPipes();
      drawBird();
      drawScore();
      if (!started) drawStartScreen();
      if (gameOver) drawGameOver();
      update();
      requestAnimationFrame(render);
    }

    function reset() {
      bird.y = 230;
      bird.vy = 0;
      pipes.length = 0;
      frame = 0;
      score = 0;
      started = true;
      gameOver = false;
    }

    function flap() {
      if (!started || gameOver) {
        reset();
        return;
      }
      bird.vy = flapPower;
    }

    document.addEventListener("keydown", (event) => {
      if (event.code === "Space") {
        event.preventDefault();
        flap();
      }
    });
    canvas.addEventListener("mousedown", flap);
    canvas.addEventListener("touchstart", (event) => {
      event.preventDefault();
      flap();
    }, { passive: false });
    render();
  </script>
</body>
</html>`;
