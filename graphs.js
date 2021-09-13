function updateGraphs() {
  updateInfectionsGraph()
  updateReproductionGraph()
}


function createInfectionsGraph() {
  let ctx =  $('#graphs > .content > .infections > canvas')[0].getContext('2d')
  infectionsChart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        label: 'Infected',
        data: [],
        backgroundColor: 'red'
      },
      {
        label: 'Deaths',
        data: [],
        backgroundColor: 'black'
      }],
      labels: []
    },
    options: {}
  })
}

function createReprodutionGraph() {
  let ctx =  $('#graphs > .content > .reproduction > canvas')[0].getContext('2d')
  reproductionChart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [{
        label: 'R-number',
        data: [],
        backgroundColor: 'green'
      }],
      labels: []
    },
    options: {}
  })
}

let reproductionChart
function updateReproductionGraph() {
  if(reproductionChart == undefined) createReprodutionGraph()
  for(let datarecord of datarecords) {
    let day = Math.floor(datarecord.time-firstInfection)/20
    if(lastDatarecordUpdated > datarecord.time) continue
    if(firstInfection == 0) continue
    if(day < 0) continue
    if(reproductionChart.data.labels[reproductionChart.data.labels.length-1] == day) continue
    reproductionChart.data.datasets[0].data.push({x:day, y: datarecord.reproduction})
    reproductionChart.data.labels.push(day)
    lastDatarecordUpdated = datarecord.time
  }
  reproductionChart.update()
}


let infectionsChart
let lastDatarecordUpdated = 0
function updateInfectionsGraph() {
  if(infectionsChart == undefined) createInfectionsGraph()
  let lastDataRecord = datarecords[datarecords.length-1]
  let dataInfected = []
  let dataDeaths = []
  for(let datarecord of datarecords) {
    let day = Math.floor(datarecord.time-firstInfection)/20
    if(lastDatarecordUpdated > datarecord.time) continue
    if(firstInfection == 0) continue
    if(day < 0) continue
    if(infectionsChart.data.labels[infectionsChart.data.labels.length-1] == day) continue
    infectionsChart.data.datasets[0].data.push({x:day, y: datarecord.infected})
    infectionsChart.data.datasets[1].data.push({x:day, y: datarecord.dead})
    infectionsChart.data.labels.push(day)
    lastDatarecordUpdated = datarecord.time
  }
  infectionsChart.update()
}