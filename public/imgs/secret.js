const text = document.getElementById("secret");
const canvas = document.getElementById("mask");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = text.offsetWidth;
  canvas.height = text.offsetHeight;
}
resize();
window.addEventListener("resize", resize);

function drawGlitch() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const rectCount = Math.floor(Math.random() * 8) + 5;

  for (let i = 0; i < rectCount; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const w = Math.random() * 80;
    const h = Math.random() * 30;

    ctx.fillStyle = "black";
    ctx.fillRect(x, y, w, h);
  }

  requestAnimationFrame(drawGlitch);
}

drawGlitch();