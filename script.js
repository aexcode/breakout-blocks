const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth < 900 ? window.innerWidth - 50 : 900
canvas.height = window.innerHeight < 700 ? window.innerHeight - 50 : 700

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth < 900 ? window.innerWidth - 50 : 900
  canvas.height = window.innerHeight < 700 ? window.innerHeight - 50 : 700
})

const ball = {
  x: canvas.width / 2,
  y: canvas.height - 30,
  dx: 2,
  dy: 2,
  radius: canvas.height * 0.02,
}

const paddle = {
  height: 30,
  width: 200,
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

  updateBall()

  collisionDetection()
  requestAnimationFrame(draw)
}

draw()
