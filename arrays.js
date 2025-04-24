// Particles but COOL
// Find a way to shove in minimal requirements
// Rainbow toggle
// Bouncy Toggle
// Size Change
// Speed Change
// Lifespan Change
// Diff Shapes

// Default settings
let particles = [];
let isRunning = false;
let isColorful = false;
let particleVelocity = 1;
let particleSize = 2;
let isBouncing = false;
let isShapeDifferent = false;
let particleInterval;
let particleLifespan = 250;

// RGB
const colors = [
    [255, 0, 0],    
    [0, 255, 0],    
    [0, 0, 255],    
    [255, 255, 0],  
    [255, 0, 255],  
    [0, 255, 255],  
    [255, 165, 0],  
    [128, 0, 128]   
];

const shapes = ['circle', 'square', 'triangle', 'point']; 


const combinedArray = colors.concat(shapes); 
console.log(combinedArray)


const elements = [
    document.getElementById("toggleButton"),
    document.getElementById("velocitySlider"),
    document.getElementById("sizeSlider"),
    document.getElementById("velocityValue"),
    document.getElementById("sizeValue"),
    document.getElementById("colorToggleButton"),
    document.getElementById("bounceToggleButton"),
    document.getElementById("shapeToggleButton")
];

function setup() {
    createCanvas(windowWidth, windowHeight);
}

function draw() {
    background(0, 80); // Trails

    if (isRunning) {
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].show();
            if (particles[i].isFinished()) {
                particles.splice(i, 1); // Remove dead particles using splice https://www.w3schools.com/jsref/jsref_splice.asp
            }
        }
    }
}

class Particle {
    constructor(x, y, colorful, shape) {
        this.position = createVector(x, y);
        this.velocity = createVector(random(-particleVelocity, particleVelocity), random(-particleVelocity, particleVelocity));
        this.lifespan = particleLifespan;

        // color
        if (colorful) {
            const randomColor = random(colors);
            this.color = color(randomColor[0], randomColor[1], randomColor[2]); // RGB
        } else {
            this.color = color(255); // Default
        }

        this.shape = shape;
        this.angle = random(TWO_PI); // "TWO_PI" is just 360 https://p5js.org/reference/p5/TWO_PI/
        this.rotationSpeed = 0.01; // rotation
    }

    update() {
        this.position.add(this.velocity);
        this.angle += this.rotationSpeed;
        if (isBouncing) {
            if (this.position.x > width || this.position.x < 0) {
                this.velocity.x *= -1; 
            }
            if (this.position.y > height || this.position.y < 0) {
                this.velocity.y *= -1;
            }
        }
        this.lifespan -= 2; // Make the particle die
    }

    isFinished() {
        return this.lifespan < 0;
    }

    show() {
        stroke(this.color.levels[0], this.color.levels[1], this.color.levels[2], this.lifespan);
        strokeWeight(particleSize);
        fill(this.color);

        push(); // Save
        translate(this.position.x, this.position.y);
        rotate(this.angle);

        // Shapes
        if (this.shape === 'circle') {
            ellipse(0, 0, particleSize);
        } else if (this.shape === 'square') {
            rectMode(CENTER); 
            rect(0, 0, particleSize, particleSize);
        } else if (this.shape === 'triangle') {
            triangle(0, -particleSize / 2, particleSize / 2, particleSize / 2, -particleSize / 2, particleSize / 2);
        } else {
            point(0, 0);
        }

        pop(); // Restore
    }
}

function updateLifespan() {
    particleLifespan = parseInt(document.getElementById('lifespanSlider').value); // Change Lifespan depending on slider
    document.getElementById('lifespanValue').textContent = particleLifespan;
}

updateLifespan();

function toggleShape() {
    isShapeDifferent = !isShapeDifferent;
    const button = elements[7];

    if (isShapeDifferent) {
        button.textContent = "Shape Off"; // Change Text
    } else {
        button.textContent = "Shape On";
    }
}

function toggleBounce() {
    isBouncing = !isBouncing; 
    const button = elements[6];

    if (isBouncing) {
        button.textContent = "Bounce Off"; 
    } else {
        button.textContent = "Bounce On";
    }
}

function createParticle() {
    if (isRunning) {
        let shape = isShapeDifferent ? random(shapes) : 'point'; // Random shape picker
        particles.push(new Particle(random(width), random(height), isColorful, shape)); // adding new particles into the array https://www.w3schools.com/jsref/jsref_push.asp
    }
}

// Resizer
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// Start generating
function startParticleGeneration() {
    clearInterval(particleInterval); 
    particleInterval = setInterval(createParticle, parseInt(document.getElementById('intervalSlider').value)); // Spawnrate
}

function updateInterval() {
    document.getElementById('intervalValue').textContent = document.getElementById('intervalSlider').value; // Spawnrate
    startParticleGeneration();
}

// Call
updateInterval();

// Toggle particle generation
function toggleParticles() {
    isRunning = !isRunning; // Toggle running state
    const button = document.getElementById('toggleButton');

    if (isRunning) {
        button.textContent = "Stop"; 
        button.style.backgroundColor = "darkgray"; // Color change transition
        startParticleGeneration(); 
    } else {
        button.textContent = "Start"; 
        button.style.backgroundColor = ""; // Reset to default
        clearInterval(particleInterval); // Instantly clears all particles upon stop
    }
}

function toggleColorMode() {
    isColorful = !isColorful; 
    const button = elements[5];

    if (isColorful) {
        button.textContent = "Color Off"; 
    } else {
        button.textContent = "Color On"; 
    }
}

function updateVelocity() {
    particleVelocity = parseFloat(elements[1].value);
    elements[3].textContent = particleVelocity; 
}

function updateSize() {
    particleSize = parseFloat(elements[2].value);
    elements[4].textContent = particleSize; 
}

// I tried to add a clear all button but it broke the whole thing for some reason so im not including it
//function clearParticles() {
//    particles = [];
//}