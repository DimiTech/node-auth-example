const { expect } = require('chai')

const {
  generateToken,
  verifyToken,
} = require('../../../app/util/jwt')

describe('JWT', () => {
  it('Properly generates and validates a JWT', async () => {
    const dummyPayload = {
      data1: 'Test 1',
      data2: 'Test 2',
      data3: 'Test 3',
      data4: 'Test 4',
    }

    const token = await generateToken(dummyPayload)
    expect(typeof token).to.equal('string')
    expect(token.match(/\./g).length).to.equal(2)
    expect(token.length).to.be.greaterThan(500)
    const decoded = await verifyToken(token)
    const tokenPayload = {
      data1: decoded.data1,
      data2: decoded.data2,
      data3: decoded.data3,
      data4: decoded.data4,
    }
    expect(tokenPayload).to.deep.equal(dummyPayload)
  })
})
