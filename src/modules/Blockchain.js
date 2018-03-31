import Block from './Block'
import Transaction from './Transaction'
import sha256 from 'js-sha256'
import jsonfile from 'jsonfile'

class Blockchain {
  constructor () {
    this.blocks = []
    this.addBlock(new Block())
  }

  addBlock (block) {
    if (this.blocks.length === 0) {
      block.previousHash = '0000000000000000000000000000000000000000000000000000000000000000'
      block.hash = this.generateHash(block)
      block.addTransaction(new Transaction('', 'EB60c0e43b6c7791bc152e009819bb0ab056', 1000000000))
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

  generatePublicAddress (privateKey) {
    let publicAddress = sha256(privateKey)
    publicAddress = '' + parseInt(publicAddress, 16)
    publicAddress = sha256(publicAddress.split('').map((number, i) => number * i))
    return 'EB' + publicAddress.slice(0, 34)
  }
}

export default Blockchain
