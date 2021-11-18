let canvas, ctx
let simulation = new Simulation()


$(() => {

  canvas = document.getElementById('canvas')
  ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
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