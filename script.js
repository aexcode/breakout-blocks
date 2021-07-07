const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
let animationFrameId

const startBtn = document.createElement('button')
startBtn.textContent = 'Play Game'
startBtn.classList.add('button')
startBtn.style.display = 'none'
document.getElementsByTagName('body')[0].appendChild(startBtn)

const restartBtn = document.createElement('button')
restartBtn.textContent = 'Restart'
restartBtn.classList.add('button')
restartBtn.style.display = 'none'
document.getElementsByTagName('body')[0].appendChild(restartBtn)

canvas.width = window.innerWidth < 900 ? window.innerWidth - 50 : 900
canvas.height = window.innerHeight < 700 ? window.innerHeight - 50 : 700

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth < 900 ? window.innerWidth - 50 : 900
  canvas.height = window.innerHeight < 700 ? window.innerHeight - 50 : 700
  cancelAnimationFrame(animationFrameID)
  draw()
})

startBtn.addEventListener('click', handleStartGame, false)
restartBtn.addEventListener('click', handleStartGame, false)
document.addEventListener('keydown', handleKeyDown, false)
document.addEventListener('keyup', handleKeyUp, false)
document.addEventListener('mousemove', handleMouseMove, false)

let ball
let paddle
let button
const game = {
  status: 'pre', // 'pre' || 'in-progress' ||'completed'
  previous: false,
}

function handleStartGame() {
  game.status = 'in-progress'
}

function handleKeyDown(e) {
  if (e.key == 'Right' || e.key == 'ArrowRight') {
    button.right = true
  } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
    button.left = true
  }
}

function handleKeyUp(e) {
  if (e.key == 'Right' || e.key == 'ArrowRight') {
    button.right = false
  } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
    button.left = false
  }
}

function handleMouseMove(e) {
  const relativeX = e.clientX - canvas.offsetLeft
  if (relativeX > 0 && relativeX < canvas.width) {
    paddle.x = relativeX - paddle.width / 2
  }
}

function drawBackground() {
  ctx.strokeStyle = '#fffafa'
  ctx.lineWidth = 10
  ctx.strokeRect(0, 0, canvas.width, canvas.height)
}

function drawBall() {
  ctx.fillStyle = '#fffafa'
  ctx.beginPath()
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
  ctx.fill()
}

function updateBall() {
  ball.x += ball.dx
  ball.y -= ball.dy
}

function drawPaddle() {
  ctx.fillStyle = '#fffafa'
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height)
}

function updatePaddle() {
  if (button.right) {
    if (paddle.x >= canvas.width - paddle.width / 2) {
      paddle.x = canvas.width - paddle.width / 2
    } else {
      paddle.x += 7
    }
  } else if (button.left) {
    if (paddle.x <= 0 - paddle.width / 2) {
      paddle.x = 0 - paddle.width / 2
    } else {
      paddle.x -= paddle.dx
    }
  }
}

function collisionDetection() {
  const left = 0 + ball.radius
  const right = canvas.width - ball.radius
  const top = 0 + ball.radius
  const bottom = canvas.height - ball.radius
  const ballLeft = ball.x - ball.radius
  const ballRight = ball.x + ball.radius

  if (ball.x < left || ball.x > right) {
    ball.dx = -ball.dx
  }

  if (ball.y < top) {
    ball.dy = -ball.dy
  }

  if (
    ballLeft > paddle.x &&
    ballRight < paddle.x + paddle.width &&
    ball.y - ball.radius > paddle.y - ball.radius
  ) {
    ball.dy = -ball.dy
  }

  if (ball.y > bottom) {
    game.previous = true
    game.status = 'completed'
  }
}

function preGame() {
  ball = {
    x: canvas.width / 2,
    y: canvas.height - 30,
    dx: 4,
    dy: 4,
    radius: canvas.height * 0.02,
  }

  paddle = {
    x: 0,
    y: canvas.height - 30,
    dx: 7,
    height: 30,
    width: canvas.width / 4,
  }
  button = {
    right: false,
    left: false,
    width: 200,
  }

  if (game.previous) {
    restartBtn.style.display = 'block'
  } else {
    startBtn.style.display = 'block'
  }
}

function endGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawBackground()

  setTimeout(() => (game.status = 'pre'), 2000)
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawBackground()

  switch (game.status) {
    case 'pre':
      preGame()
      break
    case 'in-progress':
      restartBtn.style.display = 'none'
      startBtn.style.display = 'none'

      drawBall()
      drawPaddle()

      updateBall()
      updatePaddle()

      collisionDetection()
      break
    case 'completed':
      endGame()
      break
  }

  animationFrameID = requestAnimationFrame(draw)
}

draw()
