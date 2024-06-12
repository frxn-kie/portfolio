const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const particlesArray = [];

window.addEventListener('resize', function(){
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    });

// Set particles size, colour, speed and screen-wrap
class Particle {
    constructor(){
        this.size = Math.random() * 60 + 30;
        this.x = Math.random() * (canvas.width-this.size*4) + this.size*2;
        this.y = Math.random() * (canvas.height-this.size*4) + this.size*2;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = 'hsl(' + 360 * Math.random() + ',' +
        (25 + 70 * Math.random()) + '%,' + 
        (85 + 10 * Math.random()) + '%)';
    }
    update(){
        this.x += this.speedX;
        this.y += this.speedY;
        // if (this.x > canvas.width - this.size || this.x < this.size) {
        //     this.speedX = -this.speedX;
        //   }
        //  if (this.y > canvas.height - this.size || this.y < this.size) {
        //     this.speedY = -this.speedY;
        //   }
        if (this.x > canvas.width + this.size) {
            this.x = -this.size;
          }
          if (this.x < -this.size) {
            this.x = canvas.width+this.size;
          }
          if (this.y > canvas.height + this.size) {
            this.y = -this.size;
          }
          if (this.y < -this.size) {
            this.y = canvas.height+this.size;
          }
    }
    draw(){
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Reduce number of particles for smaller screens
const numParticles = window.innerWidth < 600 ? 20 : 50;

// Creates particles, ensuring they do not overlap with each other
function init(){
    particlesArray.length = 0;

    for (let i = 0; i < numParticles; i++){
        let particle;
        let overlapping;
        do {
            overlapping = false;
            particle = new Particle();
            for (let j = 0; j < particlesArray.length; j++) {
                const dx = particle.x - particlesArray[j].x;
                const dy = particle.y - particlesArray[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < particle.size + particlesArray[j].size) {
                    overlapping = true;
                    break;
                }
            }
        } while (overlapping);
        particlesArray.push(particle);
    }
}

init();

// Handle collision between particles
function handleParticles(){
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        for (let j=i+1; j < particlesArray.length; j++) {
            const dx = particlesArray[i].x - particlesArray[j].x;
            const dy = particlesArray[i].y - particlesArray[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < particlesArray[i].size + particlesArray[j].size) {
                // Calculate unit normal and unit tangent vectors
                const nx = dx / distance;
                const ny = dy / distance;
                
                // Calculate overlap distance
                const overlap = (particlesArray[i].size + particlesArray[j].size) - distance;
                
                // Move particles apart along the collision normal
                particlesArray[i].x += overlap * nx * 0.5;
                particlesArray[i].y += overlap * ny * 0.5;
                particlesArray[j].x -= overlap * nx * 0.5;
                particlesArray[j].y -= overlap * ny * 0.5;
                
                // Reverse velocities
                const dp1 = particlesArray[i].speedX * nx + particlesArray[i].speedY * ny;
                const dp2 = particlesArray[j].speedX * nx + particlesArray[j].speedY * ny;
                particlesArray[i].speedX -= 2 * dp1 * nx;
                particlesArray[i].speedY -= 2 * dp1 * ny;
                particlesArray[j].speedX -= 2 * dp2 * nx;
                particlesArray[j].speedY -= 2 * dp2 * ny;
            }
        }
    }
}

function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleParticles();
    requestAnimationFrame(animate);
}
animate();