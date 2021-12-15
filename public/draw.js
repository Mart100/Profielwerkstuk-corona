let frameCount = 0

function frame() {

  frameCount++

  // rerun frame
  window.requestAnimationFrame(frame)

  if(!simulation.options.drawing) return
  
	// clear screen
  if(simulation.options.clearScreen == true) clearScreen()
  else if(frameCount%20 == 0) clearScreen()

  simulation.grid.draw()
  
  // draw humans
  ctx.beginPath()
  for(let human of simulation.humans) human.draw()
  ctx.fill()
  ctx.closePath()

  
}

function clearScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}