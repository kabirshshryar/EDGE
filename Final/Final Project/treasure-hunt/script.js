const levels = [
  {
    hotspots: [
      { top: 150, left: 300, width: 50, height: 50 },
      { top: 400, left: 600, width: 50, height: 50 },
      { top: 200, left: 100, width: 50, height: 50 },
      { top: 350, left: 250, width: 50, height: 50 },
      { top: 100, left: 500, width: 50, height: 50 }
    ]
  },
  {
    hotspots: [
      { top: 100, left: 200, width: 40, height: 40 },
      { top: 300, left: 400, width: 40, height: 40 },
      { top: 250, left: 100, width: 40, height: 40 },
      { top: 150, left: 500, width: 40, height: 40 },
      { top: 400, left: 300, width: 40, height: 40 }
    ]
  },
  {
    hotspots: [
      { top: 200, left: 400, width: 40, height: 40 },
      { top: 350, left: 150, width: 40, height: 40 },
      { top: 100, left: 300, width: 40, height: 40 },
      { top: 250, left: 500, width: 40, height: 40 },
      { top: 400, left: 100, width: 40, height: 40 }
    ]
  },
  {
    hotspots: [
      { top: 150, left: 150, width: 50, height: 50 },
      { top: 300, left: 500, width: 50, height: 50 },
      { top: 100, left: 600, width: 50, height: 50 },
      { top: 200, left: 400, width: 50, height: 50 },
      { top: 350, left: 250, width: 50, height: 50 }
    ]
  }
];

let currentLevel = 0;
let currentScore = 0;
const pointsPerTreasure = 10;
const pointsToUnlock = 50;
const highScoreBoard = document.getElementById('high-score');
let highScore = localStorage.getItem('cryptoHighScore') || 0;
highScore = parseInt(highScore);

const container = document.getElementById('game-container');
const img = document.getElementById('game-image');
const message = document.getElementById('message');
const scoreBoard = document.getElementById('score');
const progressBar = document.getElementById('progress-bar');
const coinSound = document.getElementById('coin-sound');

let coinImages = []; // Array for different coins

// Load cryptos.json to get coin images
fetch('cryptos.json')
  .then(response => response.json())
  .then(data => {
    coinImages = data.coins; // assuming JSON structure: { "coins": ["bitcoin.png", "eth.png", ...] }
    loadLevel(currentLevel);
  })
  .catch(error => {
    console.error('Failed to load cryptos.json:', error);
    coinImages = ["coin.png"]; // fallback
    loadLevel(currentLevel);
  });

function loadLevel(levelIndex) {
  clearHotspots();

  // Set background image
  if (levelIndex < 3) {
    img.src = "level1.jpg"; // Level 1-3 same background
  } else {
    img.src = "level2.jpg"; // Level 4 new background
  }

  // Update Level Badge
  document.getElementById('level-badge').textContent = "Level " + (levelIndex + 1);

  const level = levels[levelIndex];
  
  level.hotspots.forEach(hs => {
    const coin = document.createElement('img');
    coin.src = getRandomCoin();
    coin.classList.add('coin');

    // Screen scaling factors
    const screenRatioW = window.innerWidth / 800;  // Base design width
    const screenRatioH = window.innerHeight / 600; // Base design height

    let width = hs.width;
    let height = hs.height;

    if (levelIndex === 1 || levelIndex === 2) { // Smaller coins in Level 2 & 3
      width *= 0.6;
      height *= 0.6;
    }

    coin.style.width = (width * screenRatioW) + 'px';
    coin.style.height = (height * screenRatioW) + 'px'; // Use width ratio for both
    coin.style.left = (hs.left * screenRatioW) + 'px';
    coin.style.top = (hs.top * screenRatioH) + 'px';

    coin.addEventListener('click', foundTreasure);
    container.appendChild(coin);
  });

  message.textContent = "Collect the crypto coins!";
}

function clearHotspots() {
  const oldCoins = document.querySelectorAll('.coin');
  oldCoins.forEach(coin => coin.remove());
}

function foundTreasure(event) {
  event.target.remove();

  // Play coin sound
  if (coinSound) {
    coinSound.currentTime = 0;
    coinSound.play();
  }

  currentScore += pointsPerTreasure;
  updateScore();

  if (currentScore % pointsToUnlock === 0) {
    message.textContent = "🎉 Level Complete! Loading next level...";
    setTimeout(() => {
      currentLevel++;
      if (currentLevel < levels.length) {
        loadLevel(currentLevel);
      } else {
        message.textContent = "🏆 You finished all levels!";
        clearHotspots();
        img.style.display = 'none';
      }
    }, 1000);
  } else {
    message.textContent = "✅ Coin collected! Keep going!";
  }
}

function updateScore() {
  scoreBoard.textContent = "Score: " + currentScore;

  // Update progress bar
  const levelProgress = (currentScore % pointsToUnlock) / pointsToUnlock;
  progressBar.style.width = (levelProgress * 100) + "%";

  // Check and update high score
  if (currentScore > highScore) {
    highScore = currentScore;
    localStorage.setItem('cryptoHighScore', highScore);
  }

  // Update high score display
  highScoreBoard.textContent = "High Score: " + highScore;
}


function getRandomCoin() {
  if (coinImages.length === 0) return "coin.png"; // fallback
  const randomIndex = Math.floor(Math.random() * coinImages.length);
  return coinImages[randomIndex];
}
