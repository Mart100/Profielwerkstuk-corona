class Human {
  constructor(x, y) {

    this.pos = new Vector(x, y)
    this.anchor = new Vector(x, y)

    this.radius = 5
    this.immunity = 0
    this.vaccinated = false
    this.SIRstatus = "s"
    this.nearbyHumans = []
    this.nearbyHumansBig = []
    this.target = null
    this.targetVel = null
    this.othersInfected = 0
    this.infectedDate = 0
    this.noLongerInfectedDate = 0
  }
  move() {
    if(this.target == null) {
      // walking
      if(Math.random() < 0.99) {
        if(!simulation.options.lockdown) this.findTarget()
        else if(Math.random() > 0.999) this.findTarget()
      } 
      // flight
      else {
        let pos = new Vector(Math.random()*simulation.options.size, Math.random()*simulation.options.size)
        this.pos = pos.clone()
        this.anchor = pos.clone()
        this.getNearbyHumansBig()
      }


      return
    }

    if(this.pos.getDistanceTo(this.target) < 5) this.target = null

    this.pos.x += this.targetVel.x
    this.pos.y += this.targetVel.y
  }
  infect() {
    this.updateSIRstatus('i')
    this.infectedDate = simulation.tickCount
    this.othersInfected = 0
    this.getNearbyHumansBig()
  }
  updateSIRstatus(newStatus) {
    let idx = simulation.humanCategories[this.SIRstatus].indexOf(this)
    if(idx > -1) simulation.humanCategories[this.SIRstatus].splice(idx, 1)

    this.SIRstatus = newStatus
    simulation.humanCategories[newStatus].push(this)
  }
  vaccinate(immunity) {
    this.vaccinated = true
    //this.SIRstatus = "r"
    this.immunity += (100-this.immunity)*(immunity/100)
  }
  findTarget() {
    if(this.pos.getDistanceTo(this.anchor) < 5) {
      let moveRange = simulation.options.moveRange
      let randomX = ((Math.random()*moveRange*2)-moveRange)+this.pos.x
      let randomY = ((Math.random()*moveRange*2)-moveRange)+this.pos.y
      let target = new Vector(randomX, randomY)
      this.target = target
    } else {
      this.target = this.anchor.clone()
    }

    this.targetVel = this.target.clone().minus(this.pos).setMagnitude(simulation.options.moveSpeed)
  }
  getNearbyHumans() {
    let radius = 2
    let a = simulation.virus.infectionDistance*radius
    this.nearbyHumans = []
    for(let p of this.nearbyHumansBig) {
      if(Math.abs(this.pos.x-p.pos.x) > a) continue
      if(Math.abs(this.pos.y-p.pos.y) > a) continue
      let vec = {x: this.pos.x-p.pos.x, y: this.pos.y-p.pos.y}
      if(Math.sqrt(vec.x*vec.x + vec.y*vec.y) < a) this.nearbyHumans.push(p)
    }
    return this.nearbyHumans
  }
  getNearbyHumansBig() {
    let radius = 50
    let a = simulation.virus.infectionDistance*radius
    this.nearbyHumansBig = []
    for(let p of simulation.humans) {
      if(Math.abs(this.pos.x-p.pos.x) > a) continue
      if(Math.abs(this.pos.y-p.pos.y) > a) continue
      //let vec = {x: this.pos.x-p.pos.x, y: this.pos.y-p.pos.y}
      //if(Math.sqrt(vec.x*vec.x + vec.y*vec.y) < a) 
      this.nearbyHumansBig.push(p)
    }
    return this.nearbyHumansBig
  }
  getWindowLocation(pos) {
    let camera = simulation.camera
    let x = (pos.x - camera.x)*camera.zoom
    let y = (pos.y - camera.y)*camera.zoom
    return new Vector(x, y)
  }
  draw() {

    let camera = simulation.camera

    let xPos = this.pos.x%simulation.options.size
    let yPos = this.pos.y%simulation.options.size

    if(xPos < 0) xPos += simulation.options.size
    if(yPos < 0) yPos += simulation.options.size
    
    let pos = this.getWindowLocation(new Vector(xPos, yPos))

    let size = this.radius*camera.zoom
    if(camera.zoom < 0.1) size = this.radius*0.1
    ctx.moveTo(pos.x, pos.y)
    ctx.arc(pos.x, pos.y, size, 0, 2*Math.PI)
  }
}