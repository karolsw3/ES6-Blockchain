import Blockchain from './modules/Blockchain'
import Miner from './Miner'

let blockchain = new Blockchain()
let miner = new Miner(blockchain, 'EB60c0e43b6c7791bc152e009819bb0ab056')

blockchain._import('./experimental_blockchains/blockchain.json', () => {
  miner.startMining()
})

// console.log(blockchain._checkAddressBalance('EB60c0e43b6c7791bc152e009819bb0ab056'))
