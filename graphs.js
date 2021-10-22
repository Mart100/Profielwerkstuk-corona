function updateGraphs() {
  updateInfectionsGraph()
  updateReproductionGraph()
  updateVaccinationsGraph()
  updateImmunityGraph()
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
        yAxes: [{
          stacked: true,
          display: true,
          text: 'Count'
        }],
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

function createVaccinationsGraph() {
  let ctx =  $('#graphs > .content > .vaccinations > canvas')[0].getContext('2d')
  vaccinationsChart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [
      {
        label: 'Vaccinated',
        data: [],
        backgroundColor: 'blue'
      },
      {
        label: 'Unvaccinated',
        data: [],
        backgroundColor: 'black'
      }
    ],
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
        yAxes: [{
          stacked: true,
          display: true,
          text: 'Count'
        }],
      },
      elements: {
        point:{
          radius: 0
        }
      }
    }
  })
}

function createImmunityGraph() {
  let ctx =  $('#graphs > .content > .immunity > canvas')[0].getContext('2d')
  immunityChart = new Chart(ctx, {
    type: 'line',
    data: {
      datasets: [
        {
          label: 'immunity',
          data: [],
          backgroundColor: 'blue'
        }
      ],
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
          title: {
            display: true,
            text: 'Percentage'
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

let reproductionChart
function updateReproductionGraph() {
  if(reproductionChart == undefined) createReprodutionGraph()
  for(let datarecord of simulation.datarecords) {
    let day = Math.floor((datarecord.time-simulation.startDate)/20)
    if(lastDatarecordUpdated > datarecord.time) continue
    if(simulation.startDate == 0) continue
    if(day < 0) continue
    if(reproductionChart.data.labels[reproductionChart.data.labels.length-1] == day) continue
    reproductionChart.data.datasets[0].data.push({x:day, y: datarecord.reproduction})
    reproductionChart.data.datasets[1].data.push({x:day, y: datarecord.averageReproduction})
    reproductionChart.data.labels.push(day)
    lastDatarecordUpdated = datarecord.time
  }
  reproductionChart.update()
}

let vaccinationsChart
function updateVaccinationsGraph() {
  if(vaccinationsChart == undefined) createVaccinationsGraph()
  for(let datarecord of simulation.datarecords) {
    let day = Math.floor((datarecord.time-simulation.startDate)/20)
    if(lastDatarecordUpdated > datarecord.time) continue
    if(simulation.startDate == 0) continue
    if(day < 0) continue
    if(vaccinationsChart.data.labels[vaccinationsChart.data.labels.length-1] == day) continue
    vaccinationsChart.data.datasets[0].data.push({x:day, y: datarecord.vaccinations})
    vaccinationsChart.data.datasets[1].data.push({x:day, y: simulation.humans.length-datarecord.vaccinations})
    vaccinationsChart.data.labels.push(day)
    lastDatarecordUpdated = datarecord.time
  }
  vaccinationsChart.update()
}

let immunityChart
function updateImmunityGraph() {
  if(immunityChart == undefined) createImmunityGraph()
  for(let datarecord of simulation.datarecords) {
    let day = Math.floor((datarecord.time-simulation.startDate)/20)
    if(lastDatarecordUpdated > datarecord.time) continue
    if(simulation.startDate == 0) continue
    if(day < 0) continue
    if(immunityChart.data.labels[immunityChart.data.labels.length-1] == day) continue
    immunityChart.data.datasets[0].data.push({x:day, y: datarecord.avgImmunity})
    immunityChart.data.labels.push(day)
    lastDatarecordUpdated = datarecord.time
  }
  immunityChart.update()
}

let infectionsChart
let lastDatarecordUpdated = 0
function updateInfectionsGraph() {
  if(infectionsChart == undefined) createInfectionsGraph()
  for(let datarecord of simulation.datarecords) {
    let day = Math.floor((datarecord.time-simulation.startDate)/20)
    if(lastDatarecordUpdated > datarecord.time) continue
    if(simulation.startDate == 0) continue
    if(day < 0) continue
    if(infectionsChart.data.labels[infectionsChart.data.labels.length-1] == day) continue
    infectionsChart.data.datasets[2].data.push({x:day, y: datarecord.susceptible})
    infectionsChart.data.datasets[1].data.push({x:day, y: datarecord.infected})
    infectionsChart.data.datasets[0].data.push({x:day, y: datarecord.removed})
    infectionsChart.data.labels.push(day)
    lastDatarecordUpdated = datarecord.time
  }
  infectionsChart.update()
}