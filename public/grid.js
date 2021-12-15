class Grid {
    constructor(size) {
        this.size = size
        this.data = []
    }

    create() {
        for(let x=0;x<this.size;x++) {
            this.data[x] = []
            for(let y=0;y<this.size;y++) {
                this.data[x][y] = []
            }
        }
    }

    getWindowLocation(pos) {
        let camera = simulation.camera
        let x = (pos.x - camera.x)*camera.zoom
        let y = (pos.y - camera.y)*camera.zoom
        return new Vector(x, y)
    }



    draw() {

        ctx.strokeStyle = "rgb(0,0,0)"

        let tileSize = simulation.options.size/this.size
        ctx.beginPath()
        
        for(let x=0;x<=this.size;x++) {
            let a = this.getWindowLocation(new Vector(x*tileSize, 0))
            ctx.moveTo(a.x, 0)
            ctx.lineTo(a.x, canvas.height)
        }

        for(let y=0;y<=this.size;y++) {
            let a = this.getWindowLocation(new Vector(0, y*tileSize))
            ctx.moveTo(0, a.y)
            ctx.lineTo(canvas.width, a.y)
        }

        ctx.stroke()
        
    }
}