import Blockchain from './modules/Blockchain'
import Transaction from './modules/Transaction'

let blockchain = new Blockchain()

let transaction = new Transaction('EB60c0e43b6c7791bc152e009819bb0ab056', blockchain.generatePublicAddress('eureka'), '10')
let block = blockchain.getNextBlock([transaction])
blockchain.addBlock(block)

blockchain.export('./experimental_blockchains/blockchain.json')
