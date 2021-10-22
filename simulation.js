class Simulation {

	constructor() {

		this.humans = []
		this.virus = new Virus()
		this.seed = Math.random()
		this.day = 0
		this.startDate = 0
		this.datarecords = []
		this.tickCount = 0
		this.paused = false
		this.camera = {
			x: 0,
			y: 0,
			zoom: 1
		}

		this.options = {
			population: 10000,
			size: 2500,
			density: 40,
			noisePopulation: true,
			clearScreen: true,
			moveRange: 200,
			moveSpeed: 4,
			lockdown: false,
			drawing: true,
			dayLength: 20,
			vaccinEffectivity: 90
		}

		let searchParams = new URLSearchParams(window.location.search)
		if(searchParams.has("ve")) this.options.vaccinEffectivity = Number(searchParams.get("ve"))

		if(searchParams.has("drw") && searchParams.get("drw") == "false") this.options.drawing = false 

	}


	startInfection() {
		this.humans[0].infect()
		this.startDate = this.tickCount
	}

	spawnRandomHumans(amount) {
		let currentHumanAmount = this.humans.length
		while(currentHumanAmount+amount > this.humans.length) {
	
			let randomX = Math.random()*this.options.size
			let randomY = Math.random()*this.options.size
			let human = new Human(randomX, randomY)
	
			if(this.options.noisePopulation) {
				noise.seed(this.seed*1.1)
				let noiseSize = 200
				let noiseVal = noise.perlin2(randomX/noiseSize, randomY/noiseSize)
				noiseVal += 0.1
				if(Math.random() > noiseVal) continue
			}
	
			this.humans.push(human)
			
		}
	}

	start() {
	
		this.humans = []
		this.datarecords = []
		this.day = 0
	
		let size = this.options.size
		let density = this.options.density
		this.options.population = (size*size) * (density/(300*100))
		clearScreen()
		this.spawnRandomHumans(this.options.population)

		setTimeout(() => {
			simulation.startInfection()
		}, 2000)
	}


	end() {
		this.paused = true

		let searchParams = new URLSearchParams(window.location.search)
		if(searchParams.has("automated")) {

			$.ajax({
				url: "log",
				type: 'POST',
				contentType: 'application/json',
				data: JSON.stringify({
					datarecords: this.datarecords,
					vaccinEffectivity: this.options.vaccinEffectivity
				}),
				success: function(response) {
					if(typeof response === 'string') response = JSON.parse(response)
					console.log('log response:', response)
					searchParams.set("ve", response.ve)
					window.location.href = "http://localhost:3000?"+searchParams.toString()
				}
			})
		}
	}
}