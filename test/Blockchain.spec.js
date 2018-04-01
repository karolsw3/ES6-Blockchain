import chai from 'chai'
import Blockchain from '../src/modules/Blockchain'

chai.should()

describe('Blockchain', () => {
  let blockchain
  describe('Increase cookie amount by cookiesPerClick', () => {
    beforeEach(() => {
      blockchain = new Blockchain()
    })
    
    it('adds one cookie', () => {
      game.cookieClick()
      game.cookies.should.equal(1)
    })

    it('adds twelve cookies', () => {
      game.cookiesPerClick = 12
      game.cookieClick()
      game.cookies.should.equal(12)
    })
  })

})
