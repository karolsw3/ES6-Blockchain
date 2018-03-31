import sha256 from 'js-sha256'

class Transaction {
  constructor (from, to, amount) {
    this.from = from
    this.to = to
    this.amount = amount
    this.timestamp = new Date()
  }

  get hash () {
    return sha256(this.from + this.to + this.amount + this.timestamp)
  }
}

export default Transaction
