let score = 0;
let lives = 3;
let gridSize = 9;
let gameSpeed = 1000; // Initial game speed
let fadeDuration = 800;
let gameLoop;
let isGameActive = false;

const grid = document.getElementById('grid');
const scoreElement = document.getElementById('score');
const livesElements = [document.getElementById('life1'), document.getElementById('life2'), document.getElementById('life3')];
const overlay = document.getElementById('overlay');
const startBtn = document.getElementById('startBtn');
const finalScore = document.getElementById('finalScore');

// Create grid cells
for (let i = 0; i < gridSize; i++) {
    const cell = document.createElement('div');
    cell.classList.add('grid-cell');
    grid.appendChild(cell);
}

// Get all the grid cells
const cells = document.querySelectorAll('.grid-cell');

function randomHue() {
    return `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`;
}

function showHue() {
    if (!isGameActive) return;

    const randomCellIndex = Math.floor(Math.random() * gridSize);
    const hue = document.createElement('div');
    hue.classList.add('hue');
    hue.style.backgroundColor = randomHue();

    const selectedCell = cells[randomCellIndex];
    selectedCell.appendChild(hue);
    selectedCell.classList.add('active');

    // Show and fade the hue
    setTimeout(() => {
        hue.style.opacity = 1;
    }, 10);

    setTimeout(() => {
        hue.style.opacity = 0;
        setTimeout(() => {
            if (hue.parentElement) {
                hue.parentElement.removeChild(hue);
                selectedCell.classList.remove('active');
                loseLife(); // If not clicked in time
            }
        }, fadeDuration);
    }, fadeDuration);

    hue.addEventListener('click', () => {
        score++;
        scoreElement.textContent = score;
        hue.parentElement.removeChild(hue);
        selectedCell.classList.remove('active');
    });
}

function loseLife() {
    if (lives > 0) {
        lives--;
        livesElements[lives].classList.add('lost');
    }

    if (lives === 0) {
        endGame();
    }
}

function reduceScore() {
    score--;
    scoreElement.textContent = score;
    scoreElement.style.color = 'red';

    setTimeout(() => {
        scoreElement.style.color = '';
    }, 300);

    if (score < 0) {
        endGame();
    }
}

function endGame() {
    isGameActive = false;
    clearInterval(gameLoop);
    finalScore.textContent = `Final Score: ${score}`;
    finalScore.style.display = 'block';
    overlay.style.display = 'flex';
    document.querySelector('.game-container').style.display = 'none';
}

function resetGame() {
    score = 0;
    lives = 3;
    gameSpeed = 1000;
    fadeDuration = 800;
    isGameActive = true;
    
    scoreElement.textContent = score;
    livesElements.forEach(life => life.classList.remove('lost'));
    finalScore.style.display = 'none';

    overlay.style.display = 'none';
    document.querySelector('.game-container').style.display = 'block';

    startGameLoop();
}

function startGameLoop() {
    gameLoop = setInterval(() => {
        showHue();
        gameSpeed *= 0.97; // Speed up over time
        fadeDuration *= 0.97;
        clearInterval(gameLoop);
        startGameLoop();
    }, gameSpeed);
}

// Start button click handler
startBtn.addEventListener('click', () => {
    resetGame();
});

// Handle incorrect clicks (reduce score)
grid.addEventListener('click', (e) => {
    if (!isGameActive || e.target.classList.contains('hue')) return;

    // If the player clicks on an empty tile (no hue present)
    if (!e.target.classList.contains('active')) {
        reduceScore();
    }
});
