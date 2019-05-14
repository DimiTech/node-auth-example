const { expect } = require('chai')

const {
  generateToken,
  verifyToken,
} = require('../../../app/util/jwt')
const ROLES = require('../../../app/constants/roles')

describe('JWT', () => {
  it('Properly generates and validates a JWT', async () => {
    const dummyUser = {
      role: ROLES.USER,
      username: 'test_user',
    }

    const token = await generateToken(dummyUser)
    expect(typeof token).to.equal('string')
    expect(token.match(/\./g).length).to.equal(2)
    expect(token.length).to.be.greaterThan(500)
    const decoded = await verifyToken(token)
    expect(decoded.role).to.deep.equal(dummyUser.role)
    expect(decoded.sub).to.deep.equal(dummyUser.username)
  })
})
