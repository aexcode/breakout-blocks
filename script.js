const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
let animationFrameId
const colors = ['#a4243b', '#1b805d', '#bd632f', '#427aa1', '#e27396']
let currentColorIdx = 0

const getCurrentColor = () => {
  if (currentColorIdx < colors.length) {
    return colors[currentColorIdx]
  } else {
    currentColorIdx = 0
    return colors[currentColorIdx]
  }
}

// start game button
const startBtn = document.createElement('button')
startBtn.textContent = 'Play Game'
startBtn.classList.add('button')
startBtn.style.display = 'none'
document.getElementsByTagName('body')[0].appendChild(startBtn)

// restart game btn
const restartBtn = document.createElement('button')
restartBtn.textContent = 'Restart'
restartBtn.classList.add('button')
restartBtn.style.display = 'none'
document.getElementsByTagName('body')[0].appendChild(restartBtn)

// set canvas with and height
canvas.width = window.innerWidth < 800 ? window.innerWidth - 50 : 800
canvas.height = window.innerHeight < 700 ? window.innerHeight - 50 : 700

// reset width and heigth on window resize
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth < 900 ? window.innerWidth - 50 : 900
  canvas.height = window.innerHeight < 700 ? window.innerHeight - 50 : 700

  cancelAnimationFrame(animationFrameID)
  draw()
})

// handleKeyDown
function handleKeyDown(e) {
  if (e.key == 'Right' || e.key == 'ArrowRight') {
    button.right = true
  } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
    button.left = true
  }
}

// event listeners
startBtn.addEventListener('click', resetGame, false)
restartBtn.addEventListener('click', resetGame, false)
document.addEventListener('keydown', handleKeyDown, false)
document.addEventListener('keyup', handleKeyUp, false)
document.addEventListener('mousemove', handleMouseMove, false)

// variables
let ball
let paddle
let button
const game = {
  status: 'pre', // 'pre' || 'in-progress'
  previous: false,
}
const blocks = []
const blockColumnCount = 4
const blockRowCount = 4
let hitBlocks = 0
const blockOffset = (canvas.width * 0.25) / (blockColumnCount + 1)
const totalBlockWidth = canvas.width * (1 - 1 / blockColumnCount)
const totalBlockHeight = 40

// Block class
class Block {
  constructor() {
    this.x = 0
    this.y = 0
    this.width = totalBlockWidth / blockColumnCount
    this.height = totalBlockHeight
    this.padding =
      (canvas.width * (1 / blockColumnCount)) / (blockColumnCount + 1)
    this.color = getCurrentColor()
    this.status = true
  }

  draw() {
    ctx.fillStyle = this.color
    ctx.fillRect(this.x, this.y, this.width, this.height)
  }
}

// handleKeyUp
function handleKeyUp(e) {
  if (e.key == 'Right' || e.key == 'ArrowRight') {
    button.right = false
  } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
    button.left = false
  }
}

// handleMouseMove
function handleMouseMove(e) {
  const relativeX = e.clientX - canvas.offsetLeft
  if (relativeX > 0 && relativeX < canvas.width) {
    paddle.x = relativeX - paddle.width / 2
  }
}

// drawBlocks
function drawBlocks() {
  for (let c = 0; c < blockColumnCount; c++) {
    for (let r = 0; r < blockRowCount; r++) {
      const currentBlock = blocks[c][r]
      if (currentBlock.status) {
        currentBlock.x =
          c * (currentBlock.width + currentBlock.padding) + blockOffset
        currentBlock.y =
          r * (currentBlock.height + currentBlock.padding) + blockOffset
        currentBlock.draw()
      }
    }
  }
}

// resetGame - creates a fresh set of blocks
function resetGame() {
  blocks.length = 0

  // push initial set of blocks into blocks array
  for (let c = 0; c < blockColumnCount; c++) {
    blocks.push([])
    for (let r = 0; r < blockRowCount; r++) {
      blocks[c].push(new Block())
    }
  }

  game.status = 'in-progress'
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

  // if ball is touching a block, reverse vertical direction and set block status to false
  for (let c = 0; c < blockColumnCount; c++) {
    for (let r = 0; r < blockRowCount; r++) {
      const currentBlock = blocks[c][r]

      if (currentBlock.status) {
        if (
          ball.x > currentBlock.x &&
          ball.x < currentBlock.x + currentBlock.width &&
          ball.y > currentBlock.y &&
          ball.y < currentBlock.y + currentBlock.height
        ) {
          ball.dy = -ball.dy
          currentBlock.status = false
          hitBlocks++
        }
      }
    }
  }

  // if touching left or right side of canvas, reverse horizontal direction
  if (ball.x < left || ball.x > right) {
    ball.dx = -ball.dx
  }

  // if touching top of canvas, reverse vertical direction
  if (ball.y < top) {
    ball.dy = -ball.dy
  }

  // if touching paddle, reverse vertical direction
  if (
    ballLeft > paddle.x &&
    ballRight < paddle.x + paddle.width &&
    ball.y - ball.radius > paddle.y - ball.radius
  ) {
    checkWin()
    ball.dy = -ball.dy
  }

  // if touching bottom, end game
  if (ball.y > bottom) {
    game.previous = true
    game.status = 'pre'
  }
}

function checkWin() {
  if (blockColumnCount * blockRowCount === hitBlocks) {
    hitBlocks = 0
    currentColorIdx++
    resetGame()
  }
}

function preGame() {
  currentColorIdx = 0
  ball = {
    x: Math.floor(Math.random() * canvas.width),
    y: canvas.height - 30,
    dx: 4,
    dy: 4,
    radius: canvas.height * 0.02,
  }

  paddle = {
    x: (canvas.width - canvas.width / 4) / 2,
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
      drawBlocks()

      updateBall()
      updatePaddle()

      collisionDetection()
      break
  }

  animationFrameID = requestAnimationFrame(draw)
}

draw()
