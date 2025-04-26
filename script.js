const dino = document.getElementById("dino");
const cactus = document.getElementById("cactus");
const bird = document.getElementById("bird");
const scoreDisplay = document.getElementById("score");
const jumpSound = document.getElementById("jumpSound");
const gameOverSound = document.getElementById("gameOverSound");

let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let gameOver = false;
let isJumping = false;
let speed = 5;

function jump() {
  if (isJumping || gameOver) return;
  dino.classList.add("jump");
  isJumping = true;
  jumpSound.play();
  setTimeout(() => {
    dino.classList.remove("jump");
    isJumping = false;
  }, 500);
}

document.addEventListener("keydown", function (e) {
  if (e.code === "Space" || e.code === "ArrowUp") {
    jump();
  }
});

function moveObstacle(obstacle, intervalName, speedMultiplier) {
  let left = 800;
  window[intervalName] = setInterval(() => {
    if (gameOver) return;

    left -= speed;
    obstacle.style.left = left + "px";

    if (left < -40) {
      left = 800 + Math.random() * 400;
    }

    // Collision detection (bounding box)
    const dinoRect = dino.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();

    if (
    dinoRect.left < obstacleRect.right &&
    dinoRect.right > obstacleRect.left &&
    dinoRect.top < obstacleRect.bottom &&
    dinoRect.bottom > obstacleRect.top
    ) {
    gameOverSound.play();
    gameOver = true;
    clearInterval(scoreInterval);
    clearInterval(window[intervalName]);
    localStorage.setItem("lastScore", score); // luôn ghi điểm vòng chơi trước

    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
    }
    
    alert("Game Over! Your score: " + score);
    location.reload();
    }
  }, 20);
}

let scoreInterval;

function startGame() {
  moveObstacle(cactus, "cactusMove", 1);
  setTimeout(() => moveObstacle(bird, "birdMove", 1.5), 10000);
    // Day-Night cycle logic
    const gameContainer = document.querySelector('.game');
    const dayStates = ['day', 'sunset', 'night'];
    let currentState = 0;

    function changeDayCycle() {
        gameContainer.classList.remove(...dayStates);
        currentState = (currentState + 1) % dayStates.length;
        const state = dayStates[currentState];
        gameContainer.classList.add(state);

        // Cập nhật màu nhân vật và vật cản
        dino.className = `dino-${state}`;
    }


    // Bắt đầu là ban ngày
    gameContainer.classList.add('day');
    dino.classList.add('dino-day');
    cactus.classList.add('cactus-day');
    bird.classList.add('bird-day');

    // Chuyển trạng thái mỗi 25 giây
    setInterval(changeDayCycle, 10000);
  scoreInterval = setInterval(() => {
    if (!gameOver) {
      score++;
      scoreDisplay.innerText = `Score: ${score} | High Score: ${highScore}`;
      if (score % 150 === 0) speed += 0.3;
    }
  }, 100);
}


// === MENU CHỌN NHÂN VẬT ===
const characterMenu = document.getElementById("character-menu");
const characterOptions = document.querySelectorAll(".character-option");
const startGameBtn = document.getElementById("start-game");

let selectedSkin = "/images/green-dino.png"; // mặc định

// Unlock logic và chọn skin
characterOptions.forEach(option => {
  const skin = option.dataset.skin;
  const requiredScore = parseInt(option.dataset.required);
  const lastScore = parseInt(localStorage.getItem("lastScore")) || 0;
  
  if (requiredScore && lastScore < requiredScore) {
    option.classList.add("locked");
  } else {
    option.classList.remove("locked");
  
    // Xóa phần tử lock-text nếu có
    const lockText = option.querySelector(".lock-text");
    if (lockText) {
      lockText.remove();
    }
  
    // Cho phép chọn
    option.addEventListener("click", () => {
      characterOptions.forEach(opt => opt.classList.remove("selected"));
      option.classList.add("selected");
      selectedSkin = skin;
    });
  }
  
});

startGameBtn.addEventListener("click", () => {
  localStorage.setItem("selectedSkin", selectedSkin);
  dino.style.backgroundImage = `url(${selectedSkin})`;
  dino.style.backgroundSize = "cover";
  dino.style.backgroundColor = "transparent";
  characterMenu.style.display = "none";
  startGame();
});

// Dùng skin đã lưu
const savedSkin = localStorage.getItem("selectedSkin");
if (savedSkin) {
  dino.style.backgroundImage = `url(${savedSkin})`;
  dino.style.backgroundSize = "cover";
  dino.style.backgroundColor = "transparent";
}

