import Block from './Block'
import Transaction from './Transaction'
import sha256 from 'js-sha256'
import jsonfile from 'jsonfile'

/**
 * Blockchain consists all blocks and basic methods to operate on them
 * @constructor Blockchain
 */
class Blockchain {
  constructor () {
    this.blocks = []
    this.unconfirmedTransactions = []
    this.luckyNumber = this._generateLuckyNumber()
    this.blockReward = 50
    this.addBlock(new Block())
  }

  /**
   * Hardness of mining the block depends on the hardness level.
   * It's calculated using basic algorithm
   */
  get hardnessLevel () {
    return (this.blocks.length + 1) * 10 + 8000
  }

  /**
   * Returns basic statistics and data about the current blockchain
   */
  get stats () {
    return [
      {title: 'Unconfirmed transactions', content: this.unconfirmedTransactions.length},
      {title: 'Overall blocks', content: this.blocks.length},
      {title: 'Overall transactions', content: this.blocks.map(block => { return block.transactions.length }).reduce((a, b) => a + b, 0)}
    ]
  }

  /**
   * Returns specified quantity of recent mined blocks
   */
  getRecentBlocks (quantity) {
    let recentBlocks = []
    for (let i = this.blocks.length - 1; (i > this.blocks.length - (quantity + 1)) && (i >= 0); i--) {
      recentBlocks.push(this.blocks[i])
    }
    return recentBlocks
  }

  /**
   * Get specified block data searching by its hash
   * @param {string} hash - Hash of the block which data is requested
   */
  getSpecifiedBlock (hash) {
    for (let i = 0; i < this.blocks.length; i++) {
      if (this.blocks[i].hash === hash) return this.blocks[i]
    }
    return false
  }

  /**
   * Returns specified quantity of recent transactions
   */
  getRecentTransactions (quantity) {
    let recentTransactions = []
    for (let i = this.blocks.length - 1; (i >= 0) && (recentTransactions.length < quantity); i--) {
      let transactions = this.blocks[i].transactions.reverse()
      recentTransactions = recentTransactions.concat(transactions)
    }
    return recentTransactions
  }

  /**
   * Adds block to the blockchain
   * @param {object} block - Block to be added to the blockchain
   */
  addBlock (block) {
    if (this.blocks.length === 0) {
      block.previousHash = '0000000000000000000000000000000000000000000000000000000000000000'
      block.hash = this.generateHash(block)
    }
    this.blocks.push(block)
  }

  /**
   * Returns raw block containing specified transactions which can be later added to the blockchain
   * @param {object} transactions - Transactions which will be included in the block
   * @returns {object} Raw block
   */
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

  /**
   * Return unique hash which should be later assigned to the specified block
   * @param {object} block - Block of which hash will be generated
   * @returns {string} - Hash
   */
  generateHash (block) {
    let hash = sha256(block.key)
    while (!hash.startsWith('0000')) {
      block.nonce += 1
      hash = sha256(block.key)
    }
    return hash
  }

  /**
   * @returns {object} - Last generated block of the blockchain
   */
  getPreviousBlock () {
    return this.blocks[this.blocks.length - 1]
  }

  /**
   * Puts all unconfirmed transactions into new block and pushes it into the blockchain and
   * generates new lucky number needed to be guessed by the miners to mine the new block
   */
  mineTheBlock () {
    let block = this.getNextBlock(this.unconfirmedTransactions)
    this.blocks.push(block)
    this.unconfirmedTransactions = []
    this.luckyNumber = this._generateLuckyNumber()
  }

  /**
   * Consist algorithm used to mine new blocks
   * @returns {number} - Special number used to encipher the blockchain or to decipher it by trying to mine the block
   */
  _generateLuckyNumber () {
    return Math.round(Math.random() * this.hardnessLevel)
  }

  /**
   * Import blockchain from the specified path
   * @param {string} path - Path where the blockchain .json file is located
   * @param {function} callback - Callback fired when the action is done
   */
  _import (path, callback) {
    jsonfile.readFile(path, (err, obj) => {
      if (err !== null) {
        console.warn(err)
      }
      this.blocks = obj
      callback()
    })
  }

  /**
   * Save the blockchain to .json file in specified path
   * @param {string} path - Path where to save the actual blockchain
   */
  _export (path) {
    jsonfile.writeFile(path, this.blocks, {spaces: 2}, (err) => {
      console.warn(err)
    })
  }

  /**
   * Check balance of the specified address
   * @param {string} address - The address whose balance is to be checked
   */
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

  /**
   * Basic function used to mine new blocks. If the miner guesses the lucky blockchain number - he gets the block reward.
   * @param {number} luckyNumber - Number guessed by the miner to compare with actual blockchain lucky number
   * @param {string} rewardAddress - The address to whose the reward should be sent to
   * @param {function} callback - Callback function fired when the block has been mined
   */
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

  /**
   * Returns public address generated based on private key
   * Public addresses can be shared and used to receive transactions
   * @param {string} privateKey - The key used to secure the public address
   * @returns {string} - Public address
   */
  _generatePublicAddress (privateKey) {
    let publicAddress = sha256(privateKey)
    publicAddress = '' + parseInt(publicAddress, 16)
    publicAddress = sha256(publicAddress.split('').map((number, i) => number * i))
    return 'EB' + publicAddress.slice(0, 34)
  }

  /**
   * Send coins to specified address using public addresses and private key to the address from whom the coins will be sent from
   * @param {object} transaction - Mandatory data required to process the transacion
   *  @param {string} transaction.from - The address from whom the coins will be sent from
   *  @param {string} transaction.to - The address to whom the coins will be sent to
   *  @param {number} transaction.amount - Amount of coins wanted to be sent
   *  @param {string} transaction.privateKey - Private key of the 'from' address needed to process the transaction
   */
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
