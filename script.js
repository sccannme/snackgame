const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const box = 25; // размер блока
const canvasSize = 500;

let snake = [{ x: 10 * box, y: 10 * box }];
let food = { x: Math.floor(Math.random() * (canvasSize/box)) * box,
             y: Math.floor(Math.random() * (canvasSize/box)) * box };

let direction;
let score = 0;

// управление стрелками
document.addEventListener("keydown", changeDirection);
function changeDirection(e) {
  if (e.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (e.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (e.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  else if (e.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
}

// отрисовка
function draw() {
  // фон с плавным градиентом
  ctx.fillStyle = "#1e293b";
  ctx.fillRect(0, 0, canvasSize, canvasSize);

  // еда
  ctx.fillStyle = "#f59e0b";
  ctx.beginPath();
  ctx.arc(food.x + box/2, food.y + box/2, box/2, 0, Math.PI*2);
  ctx.fill();

  // змейка с градиентом
  for (let i = 0; i < snake.length; i++) {
    const grad = ctx.createLinearGradient(snake[i].x, snake[i].y, snake[i].x+box, snake[i].y+box);
    grad.addColorStop(0, "#7c3aed");
    grad.addColorStop(1, "#06b6d4");
    ctx.fillStyle = grad;
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // движение змейки
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === "LEFT") snakeX -= box;
  if (direction === "UP") snakeY -= box;
  if (direction === "RIGHT") snakeX += box;
  if (direction === "DOWN") snakeY += box;

  // съела еду
  if (snakeX === food.x && snakeY === food.y) {
    score++;
    document.getElementById("score").textContent = score;
    food = { 
      x: Math.floor(Math.random() * (canvasSize/box)) * box,
      y: Math.floor(Math.random() * (canvasSize/box)) * box
    };
  } else {
    snake.pop();
  }

  const newHead = { x: snakeX, y: snakeY };

  // столкновение со стеной
  if (snakeX < 0 || snakeX >= canvasSize || snakeY < 0 || snakeY >= canvasSize || collision(newHead, snake)) {
    clearInterval(game);
    alert("Game Over 😢 Score: " + score);
    return;
  }

  snake.unshift(newHead);
}

// проверка столкновения с самой собой
function collision(head, array) {
  for (let i = 1; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) return true;
  }
  return false;
}

const game = setInterval(draw, 120);