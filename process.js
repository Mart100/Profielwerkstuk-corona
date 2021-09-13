let tickCount = 0
let tickArray = []
let infectedHumans = []

function tick() {

  if(options.paused) return

  tickCount += 1
  tickArray.push(Date.now())
  day = Math.floor(tickCount/20)

  
  if(tickCount % 10 == 0) {
    console.time('nearbyHumans')
    let i = 0
    for(let human of humans) {
      if(human.health < 0 || human.health == 100) continue
      i++
      human.getNearbyHumans()
    }
    console.timeEnd('nearbyHumans')
    console.log('calculated count: ', i)
  }
  for(let human of humans) {
    if(human.health < 0) continue
    human.move()
  }

  if(tickCount % 10 == 0) {
    infectedHumans = []
    for(let human of humans) {

      if(human.health < 0) continue
      if(human.health == 100) continue
      infectedHumans.push(human)
    }
  }

  for(let human of infectedHumans) {

    if(human.health == 100) continue
    human.health--
    
    if(human.health < 50) {

      if(human.health == 0) {

        human.noLongerInfectedDate = tickCount

        // heal
        if(Math.random()*100 < options.surviveChance) {
          human.health = 100
          human.immunity += 100
          continue
        }

      }

      // infect others
      for(let human1 of human.nearbyHumans) {
        if(human1.health != 100) continue
        if(human1.pos.x == human.pos.x && human1.pos.y == human.pos.y) continue
        let human1v = new Vector(human.pos.x, human.pos.y)
        let human2v = new Vector(human1.pos.x, human1.pos.y)
        let distance = human1v.clone().minus(human2v).getMagnitude()
        let infectDist = options.infectDistance
        if(distance > infectDist) continue
        let probability = 1 - ((1/infectDist) * distance)
        probability /= 1000
        probability *= options.infectChance
        if(Math.random() < probability) {
          if(Math.random()*100 > human1.immunity) {
            human1.infect()
            human.othersInfected += 1
          }
        }
      }
    }
  }
}
