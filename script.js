const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth < 900 ? window.innerWidth - 50 : 900
canvas.height = window.innerHeight < 700 ? window.innerHeight - 50 : 700

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth < 900 ? window.innerWidth - 50 : 900
  canvas.height = window.innerHeight < 700 ? window.innerHeight - 50 : 700
})

document.addEventListener('keydown', handleKeyDown, false)
document.addEventListener('keyup', handleKeyUp, false)
document.addEventListener('mousemove', handleMouseMove, false)

const ball = {
  x: canvas.width / 2,
  y: canvas.height - 30,
  dx: 4,
  dy: 4,
  radius: canvas.height * 0.02,
}

const paddle = {
  x: 0,
  y: canvas.height - 30,
  dx: 7,
  height: 30,
  width: canvas.width / 4,
}

const buttons = {
  right: false,
  left: false,
}

function handleKeyDown(e) {
  if (e.key == 'Right' || e.key == 'ArrowRight') {
    buttons.right = true
  } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
    buttons.left = true
  }
}

function handleKeyUp(e) {
  if (e.key == 'Right' || e.key == 'ArrowRight') {
    buttons.right = false
  } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
    buttons.left = false
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
  if (buttons.right) {
    if (paddle.x >= canvas.width - paddle.width / 2) {
      paddle.x = canvas.width - paddle.width / 2
    } else {
      paddle.x += 7
    }
  } else if (buttons.left) {
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
  // if ball is touching left or right, reverse horizontal direction
  if (ball.x < left || ball.x > right) {
    ball.dx = -ball.dx
  }

  const top = 0 + ball.radius
  const bottom = canvas.height - ball.radius
  // if ball is touching top or bottom, reverse vertical direction
  if (ball.y < top || ball.y > bottom) {
    ball.dy = -ball.dy
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  drawBackground()
  drawBall()
  drawPaddle()

  updateBall()
  updatePaddle()

  collisionDetection()
  requestAnimationFrame(draw)
}

draw()
