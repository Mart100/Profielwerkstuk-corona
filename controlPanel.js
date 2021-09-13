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
      
      if(elem.hasClass("lockdown")) options.lockdown = toggled
      if(elem.hasClass("pause")) options.paused = toggled
    }
    else {
      if(elem.hasClass("restart")) restart()
    }
  })
}

function sliderListener() {
  $('#controlPanel .slider').on('change', (event) => {
    let elem = $(event.target)
    let pelem = elem.parent()
    let val = Number(elem.val())
    if(pelem.hasClass("mapsize")) {
      options.size = (val*50)+1000
      pelem.find('.value').html(options.size)
      restart()
    }
    if(pelem.hasClass("popdensity")) {
      options.density = (val)
      pelem.find('.value').html(options.density)
      restart()
    }
    if(pelem.hasClass("deathrate")) {
      options.surviveChance = 100-val
      pelem.find('.value').html(val)
    }
  })
}

function createDatarecord() {
  let total = 0
  let dead = 0
  let alife = 0
  let healthy = 0
  let immune = 0
  let infected = 0
  let totalreproduction = 0
  let totalreproductioncount = 0
  
  for(let p of humans) {
    total++
    if(p.health < 0) dead++
    if(p.health > 0) alife++
    if(p.health == 100) healthy++
    if(p.immunity > 0) immune++
    if(p.health < 100 && p.health > 0) infected++

    
    if(p.noLongerInfectedDate != 0 && tickCount-p.noLongerInfectedDate < 100) {
      totalreproductioncount++
      totalreproduction += p.othersInfected
    }
  }

  let datarecord = {
    time: tickCount,
    total,
    dead,
    alife,
    immune,
    infected,
    healthy,
    reproduction: totalreproduction/totalreproductioncount
  }

  datarecords.push(datarecord)
}

let TPS = 0
function updateInfoTab() {
  let lastDataRecord = datarecords[datarecords.length-1]
  $('#info > .content > .total > .value').html(lastDataRecord.total)
  $('#info > .content > .dead > .value').html(lastDataRecord.dead)
  $('#info > .content > .alife > .value').html(lastDataRecord.alife)
  $('#info > .content > .healthy > .value').html(lastDataRecord.healthy)
  $('#info > .content > .immune > .value').html(lastDataRecord.immune)
  $('#info > .content > .infected > .value').html(lastDataRecord.infected)
  $('#info > .content > .reproduction > .value').html(Math.round(lastDataRecord.reproduction*1000)/1000)
  $('#info > .content > .tickcount > .value').html(tickCount)
  let newtps = tickArray.filter(a => a+1000>Date.now()).length
  TPS = Math.round(((newtps+TPS)/2)*100)/100
  $('#info > .content > .tps > .value').html(TPS)
  $('#info > .content > .day > .value').html(day)
  updateGraphs()
}