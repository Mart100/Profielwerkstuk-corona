let tickArray = []

function tick() {

  let sim = simulation
  let options = sim.options
  let datarecords = sim.datarecords
  let humans = sim.humans
  let virus = sim.virus
  let tickCount = simulation.tickCount

  if(sim.paused) return
  
  if(tickCount%10 == 0) createDatarecord()

  let lastDatarecord = datarecords[datarecords.length-1]
  if(lastDatarecord && humans.find(h => h.SIRstatus=="i") == undefined && sim.startDate != 0) {
    if(sim.day < 10) sim.start()
    else sim.end()
  }

  sim.tickCount += 1
  tickCount = sim.tickCount
  tickArray.push(Date.now())
  sim.day = Math.floor(tickCount/20)

  // when simulation has started
  if(simulation.startDate !== 0) {


    // apply new vaccinations
    if(tickCount%10 == 0) {
      let newVaccins = (Math.pow(0.09*(0.05*(ticksToDays(tickCount))), 1.8)/100)*sim.humans.length
      let unvaccenatedHumans = sim.humans.filter(h => h.vaccinated == false)
      for(let i=0;i<newVaccins;i++) {
        if(i >= unvaccenatedHumans.length-1) continue
        unvaccenatedHumans[i].vaccinate(options.vaccinEffectivity)
      }
    }
  } 

  if(tickCount % 10 == 0) {
    //console.time('nearbyHumans')
    let i = 0
    for(let human of humans) {
      if(human.SIRstatus != "i") continue
      i++
      human.getNearbyHumans()
    }
    //console.timeEnd('nearbyHumans')
    //console.log('calculated count: ', i)
  }
  for(let human of humans) {
    human.move()
    if(human.immunity > 0) human.immunity -= 0.01
    if(human.immunity < 0) human.immunity = 0
  }

  for(let human of simulation.humanCategories.i) {

    if(tickCount-human.infectedDate > daysToTicks(virus.contagiousLength)) {

      human.noLongerInfectedDate = tickCount
      human.updateSIRstatus('r')
      human.immunity += (100-human.immunity)*(virus.immunityAfterInfection/100)
    }

    // infect others
    for(let human1 of human.nearbyHumans) {
      if(human1.SIRstatus == "i") continue
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
