let tickCount = 0
let tickArray = []

function tick() {

  let lastDatarecord = datarecords[datarecords.length-1]
  if(lastDatarecord.removed > 0 && lastDatarecord.infected == 0) options.paused = true

  if(options.paused) return

  tickCount += 1
  tickArray.push(Date.now())
  day = Math.floor(tickCount/20)

  
  if(tickCount % 10 == 0) {
    console.time('nearbyHumans')
    let i = 0
    for(let human of humans) {
      if(human.SIRstatus != "i") continue
      i++
      human.getNearbyHumans()
    }
    console.timeEnd('nearbyHumans')
    console.log('calculated count: ', i)
  }
  for(let human of humans) {
    if(human.SIRstatus == "r") continue
    human.move()
  }

  for(let human of humans.filter(human => human.SIRstatus == "i")) {

    if(tickCount-human.infectedDate > daysToTicks(virus.contagiousLength)) {

      human.noLongerInfectedDate = tickCount
      human.SIRstatus = "r"
    }

    // infect others
    for(let human1 of human.nearbyHumans) {
      if(human1.SIRstatus != "s") continue
      if(human1.pos.x == human.pos.x && human1.pos.y == human.pos.y) continue
      let human1v = new Vector(human.pos.x, human.pos.y)
      let human2v = new Vector(human1.pos.x, human1.pos.y)
      let distance = human1v.clone().minus(human2v).getMagnitude()
      let infectDist = virus.infectionDistance
      if(distance > infectDist) continue
      let probability = 1 - ((1/infectDist) * distance)
      probability /= 1000
      probability *= virus.infectionChance
      if(Math.random() < probability) {
        if(Math.random()*100 > human1.immunity) {
          human1.infect()
          human.othersInfected += 1
        }
      }
      }
  }
}
