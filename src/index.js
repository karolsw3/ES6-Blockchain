import Blockchain from './modules/Blockchain'
import Transaction from './modules/Transaction'
import Block from './modules/Block'

let genesisBlock = new Block()
let blockchain = new Blockchain(genesisBlock)

let transaction = new Transaction('0xf43', '0x3aaf', '10')
let block = blockchain.getNextBlock([transaction])
blockchain.addBlock(block)
blockchain.export('./blockchains/blockchain.json')
