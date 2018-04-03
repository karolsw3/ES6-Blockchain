import Express from 'express'
import Blockchain from './modules/Blockchain'
import path from 'path'

var app = Express()
var blockchain = new Blockchain()

/**
* BLOCKCHAIN EXPLORER
*/
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/public/explorer/build/index.html'))
})

/**
* BLOCKCHAIN API
*/
app.get('/api/blocks', (req, res) => {
  res.setHeader('Content-type', 'application/json')
  res.send(JSON.stringify(blockchain.blocks))
})

app.use(Express.static('public'))

app.listen(3000, () => {
  console.log('Server listening on port 3000')
})
