let keys = {}
let mouse = {
  pos: new Vector(0, 0)
}
let touch = {
  isDragging: false,
  dragStart: {x: 0, y: 0},
  lastZoom: null,
  initialPinchDistance: null
}

$(() => {
  $('#canvas').on('click', (event) => {

    let posX = event.clientX
    let posY = event.clientY
    let mouse = new Vector(posX, posY)

    for(let human of simulation.humans) {
      let humanv = human.getWindowLocation(human.pos)
      let distance = humanv.clone().minus(mouse).getMagnitude()
      if(distance < human.radius) {
        human.infect()
        if(simulation.datarecords[simulation.datarecords.length-1].infected == 0) simulation.startDate = simulation.tickCount
      }
    }
  })

  // mouse move
  $('#canvas').on('mousemove', (event) => {
    mouse.pos.x = event.clientX
    mouse.pos.y = event.clientY
  })

  // keyboard
  $(document).on('keydown', (event) => { keys[event.keyCode] = true })
  $(document).on('keyup',   (event) => { keys[event.keyCode] = false })

  // listen for zooming
  $('#canvas').on('DOMMouseScroll mousewheel', (event) => {

    let camera = simulation.camera

    let mouseMapPos = {x: 0, y: 0}
    mouseMapPos.x = (((mouse.pos.x/2)/camera.zoom)+camera.x)
    mouseMapPos.y = (((mouse.pos.y/2)/camera.zoom)+camera.y)

    let zoom = camera.zoom*0.1

    // zoom out
    if(event.originalEvent.detail > 0 || event.originalEvent.wheelDelta < 0) {
      camera.zoom -= zoom
      camera.x -= (mouseMapPos.x-camera.x)/10
      camera.y -= (mouseMapPos.y-camera.y)/10
    } else {
      camera.zoom += zoom
      camera.x += (mouseMapPos.x-camera.x)/10
      camera.y += (mouseMapPos.y-camera.y)/10
    }

    if(camera.zoom < 0.3) {
      simulation.options.clearScreen = false
      clearScreen()
    } else {
      simulation.options.clearScreen = true
    }
  })

  $('#canvas').on('touchstart', (e) => {
    if(e.touches.length == 2) {
      touch.isDragging = false
      handlePinch(e)
    }
    else if(e.touches.length == 1) {
      touch.isDragging = true
      touch.dragStart.x = getEventLocation(e).x/simulation.camera.zoom - simulation.camera.x
      touch.dragStart.y = getEventLocation(e).y/simulation.camera.zoom - simulation.camera.y
    }
  })

  $('#canvas').on('touchend', (e) => {
    if(e.touches.length == 2) {
      touch.isDragging = false
      handlePinch(e)
    }
    else if(e.touches.length == 1) {
      touch.isDragging = false
      touch.initialPinchDistance = null
      touch.lastZoom = simulation.camera.zoom
    }
  })

  $('#canvas').on('touchmove', (e) => {
    if(e.touches.length == 2) {
      touch.isDragging = false
      handlePinch(e)
    }
    else if(e.touches.length == 1) {
      if (touch.isDragging) {
        simulation.camera.x = touch.dragStart.x - getEventLocation(e).x/simulation.camera.zoom
        simulation.camera.y = touch.dragStart.y - getEventLocation(e).y/simulation.camera.zoom
      }
    }
  })

  function getEventLocation(e) {
    if (e.touches && e.touches.length == 1) return { x:e.touches[0].clientX, y: e.touches[0].clientY }
    else if (e.clientX && e.clientY) return { x: e.clientX, y: e.clientY }    

}

  function handlePinch(e) {
      e.preventDefault()
      
      let touch1 = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      let touch2 = { x: e.touches[1].clientX, y: e.touches[1].clientY }
      
      // This is distance squared, but no need for an expensive sqrt as it's only used in ratio
      let currentDistance = (touch1.x - touch2.x)**2 + (touch1.y - touch2.y)**2
      
      if (initialPinchDistance == null) touch.initialPinchDistance = currentDistance
      else adjustZoom( null, currentDistance/touch.initialPinchDistance )
  }

  function adjustZoom(zoomAmount, zoomFactor) {
    if (!isDragging) {
      if (zoomAmount) cameraZoom += zoomAmount
      else if (zoomFactor) {
        console.log(zoomFactor)
        camera.zoom = zoomFactor*lastZoom
      }
      
      camera.zoom = Math.min( cameraZoom, 20 )
      camera.zoom = Math.max( cameraZoom, 0.01 )
      
      console.log(zoomAmount)
    }
}
    
  // moving loop
  setInterval(() => {
    moving()
  }, 10)
})

function moving() {
  let moved = false
  let camera = simulation.camera

  let speed = (1/camera.zoom)*10

  if(keys[87] || keys[38]) { // north
    camera.y -= speed
    moved = true
  }
  if(keys[68] || keys[39]) { // east
    camera.x += speed
    moved = true
  }
  if(keys[83] || keys[40]) { // south
    camera.y += speed
    moved = true
  }
  if(keys[65] || keys[37]) { // west
    camera.x -= speed
    moved = true
  }

  if(moved) {
    if(camera.zoom < 0.3) clearScreen()
  }

}