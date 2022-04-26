let frameCount = 0
let fpsController = {
  fpsInterval: 50,
  previousTick: Date.now()
}

function frame() {

  // rerun frame
  window.requestAnimationFrame(frame)

  if(!simulation.options.drawing) return

  let elapsed = Date.now() - fpsController.previousTick
  if(elapsed < fpsController.fpsInterval) return
  fpsController.previousTick = Date.now() - (elapsed%fpsController.fpsInterval)

  frameCount++

  clearScreen()

  //simulation.grid.draw()
  
  // draw humans
  ctx.beginPath()
  ctx.fillStyle = `rgb(0,255,0)`
  for(let human of simulation.humanCategories.s) human.draw()
  ctx.fill()
  ctx.closePath()

  ctx.fillStyle = `rgb(255,0,0)`
  ctx.beginPath()
  for(let human of simulation.humanCategories.i) human.draw()
  ctx.fill()
  ctx.closePath()
  
  ctx.fillStyle = `rgb(0,0,0)`
  ctx.beginPath()  
  for(let human of simulation.humanCategories.r) human.draw()
  ctx.fill()
  ctx.closePath()
}

function clearScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}