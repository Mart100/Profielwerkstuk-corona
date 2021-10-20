class Human {
  constructor(x, y) {

    this.pos = new Vector(x, y)
    this.anchor = new Vector(x, y)

    this.radius = 5
    this.immunity = 0
    this.SIRstatus = "s"
    this.nearbyHumans = []
    this.nearbyHumansBig = []
    this.target = null
    this.targetVel = null
    this.othersInfected = 0
    this.infectedDate = 0
    this.noLongerInfectedDate = 0
    this.vaccininProtection = 0
  }
  move() {
    if(this.target == null) {
      // walking
      if(Math.random() < 0.99) {
        if(!options.lockdown) this.findTarget()
        else if(Math.random() > 0.999) this.findTarget()
      } 
      // flight
      else {
        let pos = new Vector(Math.random()*options.size, Math.random()*options.size)
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
    this.SIRstatus = "i"
    this.infectedDate = tickCount
    this.getNearbyHumansBig()
    
  }
  findTarget() {
    if(this.pos.getDistanceTo(this.anchor) < 5) {
      let randomX = ((Math.random()*options.moveRange*2)-options.moveRange)+this.pos.x
      let randomY = ((Math.random()*options.moveRange*2)-options.moveRange)+this.pos.y
      let target = new Vector(randomX, randomY)
      this.target = target
    } else {
      this.target = this.anchor.clone()
    }

    this.targetVel = this.target.clone().minus(this.pos).setMagnitude(options.moveSpeed)
  }
  getNearbyHumans() {
    let radius = 2
    let a = virus.infectionDistance*radius
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
    let a = virus.infectionDistance*radius
    this.nearbyHumansBig = []
    for(let p of humans) {
      if(Math.abs(this.pos.x-p.pos.x) > a) continue
      if(Math.abs(this.pos.y-p.pos.y) > a) continue
      //let vec = {x: this.pos.x-p.pos.x, y: this.pos.y-p.pos.y}
      //if(Math.sqrt(vec.x*vec.x + vec.y*vec.y) < a) 
      this.nearbyHumansBig.push(p)
    }
    return this.nearbyHumansBig
  }
  getWindowLocation() {
    let x = (this.pos.x - camera.x)*camera.zoom
    let y = (this.pos.y - camera.y)*camera.zoom
    return new Vector(x, y)
  }
  draw() {
    
    let pos = this.getWindowLocation()

    if(pos.x > canvas.width) return
    if(pos.x < 0) return
    if(pos.y > canvas.height) return
    if(pos.y < 0) return

    if(camera.zoom < 0.3) {
      if(Math.random() > camera.zoom*1.5) return 
    }

    let color = [0, 0, 0]
    if(this.SIRstatus == "s") color = [0, 255, 0]
    if(this.SIRstatus == "i") color = [0, 0, 255]
    if(this.SIRstatus == "r") color = [0, 0, 0]

    ctx.beginPath()
    ctx.fillStyle = `rgb(${color[0]},${color[1]},${color[2]})`
    let size = this.radius*camera.zoom
    if(camera.zoom < 0.5) size = this.radius*0.5
    ctx.arc(pos.x, pos.y, size, 0, 2*Math.PI)
    ctx.fill()
  }
}