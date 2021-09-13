let frameCount = 0

function frame() {

  frameCount++

  // rerun frame
  window.requestAnimationFrame(frame)

  if(!options.drawing) return
  
	// clear screen
  if(options.clearScreen == true) clearScreen()
  
  // draw humans
  for(let human of humans) human.draw()
}

function clearScreen() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}