import Block from './Block'
import sha256 from 'js-sha256'
import jsonfile from 'jsonfile'

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
    return hash
  }

  getPreviousBlock () {
    return this.blocks[this.blocks.length - 1]
  }

  import (path) {
    jsonfile.readFile(path, (err, obj) => {
      if (err !== null) {
        console.warn(err)
      }
      this.blocks = obj
    })
  }

  export (path) {
    jsonfile.writeFile(path, this.blocks, {spaces: 2}, (err) => {
      console.warn(err)
    })
  }
}

export default Blockchain
