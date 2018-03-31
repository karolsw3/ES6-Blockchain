import Blockchain from './modules/Blockchain'
import Transaction from './modules/Transaction'

let blockchain = new Blockchain()

let transaction = new Transaction('genesis', '', '10')
let block = blockchain.getNextBlock([transaction])
blockchain.addBlock(block)

blockchain.export('./experimental_blockchains/blockchain.json')
