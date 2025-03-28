const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Ajustar el tamaño del canvas dinámicamente
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

class Circle {
    constructor(x, y, radius, color, text, speedX, speedY) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.originalColor = color; // Guardar el color original
        this.color = color;
        this.text = text;
        this.dx = speedX;
        this.dy = speedY;
        this.isColliding = false; // Indica si está en colisión
    }

    draw(context) {
        context.beginPath();
        context.fillStyle = this.color;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.fill();
        context.strokeStyle = "#000"; // Contorno negro
        context.lineWidth = 2;
        context.stroke();
        context.closePath();

        // Dibujar el texto centrado en el círculo
        context.fillStyle = "#fff"; // Color blanco para el texto
        context.font = "16px Arial";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(this.text, this.posX, this.posY);
    }

    update(context) {
        this.posX += this.dx;
        this.posY += this.dy;

        // Rebotar en los bordes
        if (this.posX + this.radius > canvas.width || this.posX - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.posY + this.radius > canvas.height || this.posY - this.radius < 0) {
            this.dy = -this.dy;
        }

        this.draw(context);
    }

    // Método para detectar y manejar colisiones con otro círculo
    checkCollision(otherCircle) {
        let dx = this.posX - otherCircle.posX;
        let dy = this.posY - otherCircle.posY;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let minDistance = this.radius + otherCircle.radius;

        if (distance < minDistance) {
            // "Flashea" en azul durante la colisión
            this.color = "#0000FF";
            otherCircle.color = "#0000FF";

            if (!this.isColliding && !otherCircle.isColliding) {
                this.isColliding = true;
                otherCircle.isColliding = true;

                // Intercambiar velocidades (rebote en dirección opuesta)
                let tempDx = this.dx;
                let tempDy = this.dy;
                this.dx = otherCircle.dx;
                this.dy = otherCircle.dy;
                otherCircle.dx = tempDx;
                otherCircle.dy = tempDy;

                // Pequeño ajuste para evitar que los círculos se superpongan constantemente
                let overlap = minDistance - distance;
                let adjustX = (dx / distance) * overlap / 2;
                let adjustY = (dy / distance) * overlap / 2;
                this.posX += adjustX;
                this.posY += adjustY;
                otherCircle.posX -= adjustX;
                otherCircle.posY -= adjustY;

                // Restaurar el color original después de un corto tiempo
                setTimeout(() => {
                    this.color = this.originalColor;
                    otherCircle.color = otherCircle.originalColor;
                    this.isColliding = false;
                    otherCircle.isColliding = false;
                }, 100);
            }
        }
    }
}

// Crear un array para almacenar los círculos
let circles = [];

// Función para generar círculos aleatorios
function generateCircles(n) {
    circles = []; // Vaciar el array antes de agregar nuevos círculos
    for (let i = 0; i < n; i++) {
        let radius = Math.random() * 30 + 20; // Radio entre 20 y 50
        let x = Math.random() * (canvas.width - radius * 2) + radius;
        let y = Math.random() * (canvas.height - radius * 2) + radius;
        let color = `#${Math.floor(Math.random() * 16777215).toString(16)}`; // Color aleatorio
        let speedX = (Math.random() * 4 + 1) * (Math.random() < 0.5 ? -1 : 1); // Velocidad entre -5 y 5
        let speedY = (Math.random() * 4 + 1) * (Math.random() < 0.5 ? -1 : 1);
        let text = `C${i + 1}`; // Etiqueta del círculo
        circles.push(new Circle(x, y, radius, color, text, speedX, speedY));
    }
}

// Función para animar los círculos
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar el canvas

    // Verificar colisiones entre todos los círculos
    for (let i = 0; i < circles.length; i++) {
        for (let j = i + 1; j < circles.length; j++) {
            circles[i].checkCollision(circles[j]);
        }
    }

    // Actualizar y dibujar los círculos
    circles.forEach(circle => {
        circle.update(ctx);
    });

    requestAnimationFrame(animate); // Repetir la animación
}

// Generar 10 círculos y comenzar la animación
generateCircles(10);
animate();
