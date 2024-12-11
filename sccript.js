const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startGameButton = document.getElementById("startGameButton");
const restartButton = document.getElementById("restartButton");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("highScore");
const gameContainer = document.getElementById("gameContainer");
const welcomeScreen = document.getElementById("welcomeScreen");

canvas.width = 400;
canvas.height = 600;

// Load Images
let birdImg = new Image();
let pipeTopImg = new Image();
let pipeBottomImg = new Image();

birdImg.src = "https://www.pngall.com/wp-content/uploads/15/Flappy-Bird-Background-PNG.png"; // Replace with your local file
pipeTopImg.src = "https://w7.pngwing.com/pngs/111/173/png-transparent-green-pipe-illustration-new-super-mario-bros-2-pipe-flappy-bird-mario-pipe-thumbnail.png"; // Replace with your local file
pipeBottomImg.src = "https://w7.pngwing.com/pngs/111/173/png-transparent-green-pipe-illustration-new-super-mario-bros-2-pipe-flappy-bird-mario-pipe-thumbnail.png"; // Replace with your local file

// Game Variables
let bird = { x: 50, y: 150, width: 20, height: 20, velocity: 0 };
let pipes = [];
let pipeGap = 150;
let gravity = 0.5;
let jump = -8;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let isGameRunning = false;

startGameButton.addEventListener("click", () => {
    welcomeScreen.style.display = "none";
    gameContainer.style.display = "block";
    const playerName = prompt("Enter your name:");
    alert(`Welcome, ${playerName}!`);
    isGameRunning = true;
    startGame();
});

restartButton.addEventListener("click", () => {
    restartButton.style.display = "none";
    isGameRunning = true;
    resetGame();
    animate();
});

function startGame() {
    resetGame();
    animate();
}

function resetGame() {
    bird.y = 150;
    bird.velocity = 0;
    pipes = [];
    score = 0;
    scoreDisplay.textContent = score;
    createPipe();
}

function createPipe() {
    const pipeHeight = Math.random() * (canvas.height - pipeGap - 200) + 100;
    pipes.push({
        x: canvas.width,
        topHeight: pipeHeight,
        bottomHeight: canvas.height - pipeHeight - pipeGap,
    });
}

function drawBird() {
    ctx.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
}

function drawPipes() {
    pipes.forEach(pipe => {
        ctx.drawImage(pipeTopImg, pipe.x, 0, 50, pipe.topHeight);
        ctx.drawImage(pipeBottomImg, pipe.x, canvas.height - pipe.bottomHeight, 50, pipe.bottomHeight);
    });
}

function updateBird() {
    bird.velocity += gravity;
    bird.y += bird.velocity;

    if (bird.y + bird.height >= canvas.height || bird.y <= 0) {
        gameOver();
    }
}

function updatePipes() {
    pipes.forEach(pipe => {
        pipe.x -= 2;

        if (
            bird.x < pipe.x + 50 &&
            bird.x + bird.width > pipe.x &&
            (bird.y < pipe.topHeight || bird.y + bird.height > canvas.height - pipe.bottomHeight)
        ) {
            gameOver();
        }

        if (pipe.x + 50 === bird.x) {
            score++;
            scoreDisplay.textContent = score;
            if (score > highScore) {
                highScore = score;
                highScoreDisplay.textContent = highScore;
                localStorage.setItem("highScore", highScore);
            }
        }
    });

    pipes = pipes.filter(pipe => pipe.x + 50 > 0);

    if (pipes.length === 0 || pipes[pipes.length - 1].x < canvas.width - 200) {
        createPipe();
    }
}

function gameOver() {
    isGameRunning = false;
    restartButton.style.display = "block";
}

function animate() {
    if (!isGameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateBird();
    updatePipes();
    drawBird();
    drawPipes();

    requestAnimationFrame(animate);
}

document.addEventListener("keydown", e => {
    if (e.code === "Space" && isGameRunning) {
        bird.velocity = jump;
    }
});

canvas.addEventListener("click", () => {
    if (isGameRunning) {
        bird.velocity = jump;
    }
});

window.onload = () => {
    highScoreDisplay.textContent = highScore;
};
