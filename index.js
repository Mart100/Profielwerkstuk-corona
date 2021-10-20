let canvas, ctx
let humans = []
let datarecords = []
let camera = {
  x: 0,
  y: 0,
  zoom: 1
}
let day = 0
let firstInfection = 0
let options = {
  amount: 10000,
  checkOverlap: false,
  size: 2500,
  density: 50,
  noisePopulation: true,
  clearScreen: true,
  moveRange: 200,
  moveSpeed: 4,
  lockdown: false,
  paused: false,
  drawing: true,
  dayLength: 20
}
let virus = new Virus()
let seed = Math.random()


$(() => {
  canvas = document.getElementById('canvas')
  ctx = canvas.getContext('2d')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  frame()
  setInterval(() => { 
    tick()
  }, 50)

  setInterval(() => { 
    createDatarecord()
  }, 500)

  setInterval(() => {
    updateInfoTab()
  }, 1000)

  restart()
})

function restart() {
  humans = []
  datarecords = []
  day = 0
  options.amount = (options.size*options.size) * (options.density/(300*100))
  clearScreen()
  createRandomHumans(options.amount)
}

function ptest() {
  options.size = 10000
  options.density = 50
  restart()
}


function createRandomHumans(amount) {
  let currentHumanAmount = humans.length
  while(currentHumanAmount+amount > humans.length) {

    let randomX = Math.random()*options.size
    let randomY = Math.random()*options.size
    let human = new Human(randomX, randomY)

    if(options.noisePopulation) {
      noise.seed(this.seed*1.1)
      let noiseSize = 200
      let noiseVal = noise.perlin2(randomX/noiseSize, randomY/noiseSize)
      noiseVal += 0.1
      if(Math.random() > noiseVal) continue
    }

    if(options.checkOverlap) {
      let overlap = false
      for(let humanL of humans) {
        let human1v = new Vector(randomX, randomY)
        let human2v = new Vector(humanL.pos.x, humanL.pos.y)
        let distance = human1v.clone().minus(human2v).getMagnitude()
        if(distance < human.radius+humanL.radius) overlap = true
  
      }
  
      if(!overlap) humans.push(human)
    } else {
      humans.push(human)
    }

    
  }
}

async function sleep(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, 10)
  })
}