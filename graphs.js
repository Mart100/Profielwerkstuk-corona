function updateGraphs() {
  updateInfectionsGraph()
  updateReproductionGraph()
}


function createInfectionsGraph() {
  let ctx =  $('#graphs > .content > .infections > canvas')[0].getContext('2d')
  infectionsChart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [      {
        label: 'removed',
        data: [],
        backgroundColor: 'black'
      },
      {
        label: 'infected',
        data: [],
        backgroundColor: 'red'
      },
      {
        label: 'susceptible',
        data: [],
        backgroundColor: 'green'
      }],
      labels: []
    },
    options: {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Day'
          }
        },
        y: {
          stacked: true,
          title: {
            display: true,
            text: 'Count'
          }
        }
      },
      elements: {
        point:{
          radius: 0
        }
      }
    }
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
      },
      {
        label: 'avg R-number',
        data: [],
        fill: false,
        borderColor: "blue",
      }],
      labels: []
    },
    options: {
      elements: {
        point:{
          radius: 0
        }
      }
    }
  })
}

let reproductionChart
function updateReproductionGraph() {
  if(reproductionChart == undefined) createReprodutionGraph()
  for(let datarecord of datarecords) {
    let day = Math.floor((datarecord.time-firstInfection)/20)
    if(lastDatarecordUpdated > datarecord.time) continue
    if(firstInfection == 0) continue
    if(day < 0) continue
    if(reproductionChart.data.labels[reproductionChart.data.labels.length-1] == day) continue
    reproductionChart.data.datasets[0].data.push({x:day, y: datarecord.reproduction})
    reproductionChart.data.datasets[1].data.push({x:day, y: datarecord.averageReproduction})
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
    let day = Math.floor((datarecord.time-firstInfection)/20)
    if(lastDatarecordUpdated > datarecord.time) continue
    if(firstInfection == 0) continue
    if(day < 0) continue
    if(infectionsChart.data.labels[infectionsChart.data.labels.length-1] == day) continue
    infectionsChart.data.datasets[2].data.push({x:day, y: datarecord.susceptible+datarecord.infected+datarecord.removed})
    infectionsChart.data.datasets[1].data.push({x:day, y: datarecord.infected+datarecord.removed})
    infectionsChart.data.datasets[0].data.push({x:day, y: datarecord.removed})
    infectionsChart.data.labels.push(day)
    lastDatarecordUpdated = datarecord.time
  }
  infectionsChart.update()
}