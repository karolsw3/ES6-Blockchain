import Block from './Block'
import sha256 from 'js-sha256'

class Blockchain {
  constructor (genesisBlock) {
    this.blocks = []
    this.addBlock(genesisBlock)
  }

  addBlock (block) {
    if (this.blocks.length === 0) {
      block.previousHash = '0000000000000000'
      block.hash = this.generateHash(block)
    }
    this.blocks.push(block)
  }

  getNextBlock (transactions) {
    let block = new Block()

    transactions.map(transaction => {
      block.addTransaction(transaction)
    })

    let previousBlock = this.getPreviousBlock()
    block.index = this.blocks.length
    block.previousHash = previousBlock.hash
    block.hash = this.generateHash(block)
    return block
  }

  generateHash (block) {
    let hash = sha256(block.key)
    while (!hash.startsWith('0000')) {
      block.nonce += 1
      hash = sha256(block.key)
    }
  }
}

export default Blockchain
