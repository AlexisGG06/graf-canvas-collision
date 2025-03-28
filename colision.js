const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");

// Ajustar el tamaño del canvas dinámicamente
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let score = 0;

class Circle {
    constructor(x, y, radius, color, speedY) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.color = color;
        this.dy = speedY;
    }

    draw(context) {
        context.beginPath();
        context.fillStyle = this.color;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.fill();
        context.closePath();
    }

    update() {
        this.posY += this.dy;
        if (this.posY - this.radius > canvas.height) {
            this.posY = -this.radius;
        }
        this.draw(ctx);
    }

    isClicked(mouseX, mouseY) {
        const dx = mouseX - this.posX;
        const dy = mouseY - this.posY;
        return Math.sqrt(dx * dx + dy * dy) < this.radius;
    }
}

let circles = [];
function generateCircles(n) {
    circles = [];
    for (let i = 0; i < n; i++) {
        let radius = Math.random() * 30 + 20;
        let x = Math.random() * (canvas.width - radius * 2) + radius;
        let y = -radius; // Inicia fuera del canvas
        let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        let speedY = Math.random() * 3 + 1; // Velocidad aleatoria entre 1 y 4
        circles.push(new Circle(x, y, radius, color, speedY));
    }
}

canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    circles = circles.filter(circle => {
        if (circle.isClicked(mouseX, mouseY)) {
            score++;
            scoreDisplay.innerText = `Círculos eliminados: ${score}`;
            return false; // Elimina el círculo
        }
        return true;
    });
});

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    circles.forEach(circle => circle.update());
    requestAnimationFrame(animate);
}

generateCircles(10);
animate();
