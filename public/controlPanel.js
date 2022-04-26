$(() => {
  $('#controlPanel div .title').on('click', (event) => {
    let id = $(event.target).parent().attr('id')
    let elem = $(event.target).parent()

    $('#controlPanel div .content').hide()
    elem.find('.content').show()
  })

  buttonListener()
  sliderListener()
  graphListener()
})

function graphListener() {
  $('#controlPanel > div > .content > .graph').on('click', (event) => {
    if($('#controlPanel > div > .content > .graph').hasClass('expanded')) return
    let elem = $(event.currentTarget)
    elem.addClass('expanded')
    $('#controlPanel').css('overflow-y', 'visible')

  })
  $('#canvas').on('click', () => {
    $('#controlPanel').css('overflow-y', 'auto')
    $('#controlPanel > div > .content > .graph').removeClass('expanded')
  })
  $('#controlPanel').on('click', (event) => {
    if($(event.target).is("canvas")) return
    $('#controlPanel').css('overflow-y', 'auto')
    $('#controlPanel > div > .content > .graph').removeClass('expanded')
  })
}
function buttonListener() {
  $('#controlPanel .button').on('click', (event) => {
    let elem = $(event.target)
    if(elem.hasClass("toggle")) {
      elem.toggleClass("toggled")
      let toggled = elem.hasClass("toggled")
      
      if(elem.hasClass("lockdown")) simulation.options.lockdown = toggled
      if(elem.hasClass("pause"))  simulation.paused = toggled
    }
    else {
      if(elem.hasClass("restart")) simulation.start()
    }
  })
}

function sliderListener() {
  $('#controlPanel .slider').on('change', (event) => {
    let elem = $(event.target)
    let pelem = elem.parent()
    let val = Number(elem.val())
    if(pelem.hasClass("mapsize")) {
      simulation.options.size = (val*50)+1000
      pelem.find('.value').html( simulation.options.size)
      start()
    }
    if(pelem.hasClass("popdensity")) {
      simulation.options.density = (val)
      pelem.find('.value').html(simulation.options.density)
      start()
    }
    if(pelem.hasClass("deathrate")) {
      simulation.options.surviveChance = 100-val
      pelem.find('.value').html(val)
    }
  })
}

function createDatarecord() {
  let total = 0
  let susceptible = 0
  let removed = 0
  let infected = 0
  let vaccinations = 0
  let totalreproductionnumber = 0
  let totalreproductionnumbersize = 0
  let averagereproductionnumbertotal = 0
  let totalImmunity = 0
  
  for(let human of simulation.humans) {
    total++
    if(human.SIRstatus == "s") susceptible++
    if(human.SIRstatus == "i") infected++
    if(human.SIRstatus == "r") removed++
    
    if(human.SIRstatus == "i") {
      let infectedLength = (simulation.tickCount-human.infectedDate)
      if(infectedLength > daysToTicks(simulation.virus.contagiousLength)/2) {
        totalreproductionnumber += human.othersInfected * (daysToTicks(simulation.virus.contagiousLength)/infectedLength)
        totalreproductionnumbersize++
      }

    }

    if(human.vaccinated) vaccinations++
    totalImmunity += human.immunity

    if(human.SIRstatus == "r") averagereproductionnumbertotal += human.othersInfected

  }

  //console.log('r: ', totalreproductionnumber + " - " + totalreproductionnumbersize + " - " + totalreproductionnumber/totalreproductionnumbersize)

  let datarecord = {
    time: simulation.tickCount,
    total,
    susceptible,
    infected,
    removed,
    vaccinations,
    avgImmunity: totalImmunity/total,
    reproduction: totalreproductionnumber/totalreproductionnumbersize,
    averageReproduction: averagereproductionnumbertotal/removed
  }

  simulation.datarecords.push(datarecord)
}

let TPS = 0
function updateInfoTab() {
  let lastDataRecord = simulation.datarecords[simulation.datarecords.length-1]
  if(lastDataRecord == undefined) return

  $('#info > .content > .total > .value').html(lastDataRecord.total)
  $('#info > .content > .susceptible > .value').html(lastDataRecord.susceptible)  
  $('#info > .content > .infected > .value').html(lastDataRecord.infected)
  $('#info > .content > .removed > .value').html(lastDataRecord.removed)
  $('#info > .content > .reproduction > .value').html(Math.round(lastDataRecord.reproduction*100)/100)
  $('#info > .content > .averageReproduction > .value').html(Math.round(lastDataRecord.averageReproduction*100)/100)

  $('#info > .content > .tickcount > .value').html(simulation.tickCount)
  $('#info > .content > .framecount > .value').html(frameCount)
  let newtps = tickArray.filter(a => a+1000>Date.now()).length
  TPS = Math.round(((newtps+TPS)/2)*100)/100
  $('#info > .content > .tps > .value').html(TPS)
  $('#info > .content > .day > .value').html(simulation.day)
  updateGraphs()
}