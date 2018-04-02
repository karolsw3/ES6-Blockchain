class Miner {
  constructor (blockchain, rewardAddress) {
    this.blockchain = blockchain
    this.rewardAddress = rewardAddress
  }

  startMining () {
    let miningComplete = false
    while (!miningComplete) {
      let luckyNumber = this.blockchain._generateLuckyNumber()
      console.log('Mining... Num: ' + luckyNumber)
      this.blockchain._tryToMineTheBlock(luckyNumber, 'EB60c0e43b6c7791bc152e009819bb0ab056', (blockMined) => {
        if (blockMined) {
          this.blockchain._export('./experimental_blockchains/blockchain.json')
          miningComplete = true
        }
      })
    }
  }
}

export default Miner
