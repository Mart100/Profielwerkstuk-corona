let canvas, ctx
let simulation = new Simulation()
let onMobile = false


$(() => {

  canvas = document.getElementById('canvas')
  ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth/2
  canvas.height = window.innerHeight/2

  if($('#controlPanel').css('position') == 'relative') {
    canvas.width = window.innerWidth/2
    canvas.height = (window.innerHeight/2)*0.6
    simulation.camera.zoom = 0.1*(canvas.width/400)
    simulation.camera.x = -600
    simulation.camera.y = -250
    onMobile = true
  }

  frame()
  setInterval(() => { 
    tick()
  }, 5)

  setInterval(() => {
    updateInfoTab()
  }, 1000)

  simulation.start()
})

async function sleep(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 10)
  })
}