import Block from './Block'
import Transaction from './Transaction'
import sha256 from 'js-sha256'
import jsonfile from 'jsonfile'

class Blockchain {
  constructor () {
    this.blocks = []
    this.unconfirmedTransactions = []
    this.luckyNumber = this._generateLuckyNumber()
    this.blockReward = 1000000
    this.addBlock(new Block())
  }

  addBlock (block) {
    if (this.blocks.length === 0) {
      block.previousHash = '0000000000000000000000000000000000000000000000000000000000000000'
      block.hash = this.generateHash(block)
      block.addTransaction(new Transaction('No input (newly generated coins)', 'EB60c0e43b6c7791bc152e009819bb0ab056', 1000000000))
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

  mineTheBlock () {
    let block = this.getNextBlock(this.unconfirmedTransactions)
    this.blocks.push(block)
    this.unconfirmedTransactions = []
    this.luckyNumber = this._generateLuckyNumber()
  }

  _generateLuckyNumber () {
    return Math.round(Math.random() * 999)
  }

  _import (path, callback) {
    jsonfile.readFile(path, (err, obj) => {
      if (err !== null) {
        console.warn(err)
      }
      this.blocks = obj
      callback()
    })
  }

  _export (path) {
    jsonfile.writeFile(path, this.blocks, {spaces: 2}, (err) => {
      console.warn(err)
    })
  }

  _checkAddressBalance (address) {
    let balance = 0
    this.blocks.map(block => {
      block.transactions.map(transaction => {
        if (transaction.from === address) balance -= transaction.amount
        if (transaction.to === address) balance += transaction.amount
      })
    })
    return balance
  }

  _tryToMineTheBlock (luckyNumber, rewardAddress, callback) {
    let blockMined = false
    if (luckyNumber === this.luckyNumber) {
      let transaction = new Transaction('No input (newly generated coins)', rewardAddress, this.blockReward)
      this.unconfirmedTransactions.push(transaction)
      this.mineTheBlock()
      console.log('Block mined! ' + this.blockReward + ' coins reward sent to ' + rewardAddress)
      blockMined = true
      callback(blockMined)
    }
  }

  _generatePublicAddress (privateKey) {
    let publicAddress = sha256(privateKey)
    publicAddress = '' + parseInt(publicAddress, 16)
    publicAddress = sha256(publicAddress.split('').map((number, i) => number * i))
    return 'EB' + publicAddress.slice(0, 34)
  }

  _generateTransaction ({from, to, amount, privateKey}) {
    if (from !== this._generatePublicAddress(privateKey)) {
      console.log('Invalid private key!')
    } else if (amount < 0 && this._checkAddressBalance(from) >= amount) {
      console.log('Invalid amount!')
    } else {
      let transaction = new Transaction(from, to, amount)
      this.unconfirmedTransactions.push(transaction)
      console.log('Transaction sent! Unconfirmed transactions:' + this.unconfirmedTransactions.length)
    }
  }
}

export default Blockchain
