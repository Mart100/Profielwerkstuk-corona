const fs = require('fs')
const express = require('express')
const app = express()
const port = 3000

let resultsFile = '../results.json'

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended:true, limit: '50mb'}));


app.use(express.static('../'))


app.post('/log', (req, res) => {

	let newResults = req.body
	let vaccinEffectivity = Number(newResults.vaccinEffectivity)
	console.log('new simulation results!')
	console.log('Vaccin Effectivity: ', vaccinEffectivity)
	console.log('Data records: ', newResults.datarecords.length)
	console.log('\n')

	fs.readFile(resultsFile, (err, rawData) => {
    if (err) throw err
    let data = JSON.parse(rawData)
    
		data.push(newResults)

		fs.writeFile(resultsFile, JSON.stringify(data), (err) => {
			if (err) throw err
			console.log('New data was added to the results file!')

			res.status(200).send(JSON.stringify({ve: vaccinEffectivity+1}))
		})
	})
})

app.listen(port, () => {
  console.log(`Profielwerkstuk automated logging at http://localhost:${port}`)
})