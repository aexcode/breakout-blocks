const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

canvas.width = window.innerWidth
canvas.height = window.innerHeight

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
})

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  requestAnimationFrame(draw)
}

draw()
