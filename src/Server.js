import Express from 'express'
import Blockchain from './modules/Blockchain'

class Server {
  constructor () {
    this.app = Express()
    this.blockchain = new Blockchain()
  }

  init () {
    this.app.get('/blocks', (req, res) => {
      res.setHeader('Content-type', 'application/json')
      res.send(JSON.stringify(this.blockchain.blocks))
    })
    this.app.listen(3000, () => {
      console.log('Server listening on port 3000')
    })
  }
}

export default Server
