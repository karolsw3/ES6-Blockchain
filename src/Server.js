import Express from 'express'
import Blockchain from './modules/Blockchain'
import path from 'path'

class Server {
  constructor () {
    this.app = Express()
    this.blockchain = new Blockchain()
  }

  init () {
    /**
     * BLOCKCHAIN EXPLORER
     */
    this.app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname + '/explorer/index.html'))
    })
    /**
     * BLOCKCHAIN API
     */
    this.app.get('/api/blocks', (req, res) => {
      res.setHeader('Content-type', 'application/json')
      res.send(JSON.stringify(this.blockchain.blocks))
    })

    this.app.listen(3000, () => {
      console.log('Server listening on port 3000')
    })
  }
}

export default Server
