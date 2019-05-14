const { expect } = require('chai')

const {
  generateSalt,
  hashPassword,
  passwordMatches
} = require('../../../app/util/crypto')


describe('Hashing / Password Matching', () => {
  const plainTextPassword = 'pass3'
  let savedSalt 
  let savedPasswordHash

  it('Generates a "salt" Buffer and returns its Hexadecimal string representation', async () => {
    const salt = await generateSalt()
    expect(salt.length).to.equal(64)
    savedSalt = salt
  })

  it('Produces a "salt" and a "hashedPassword" from a plain-text "password"', async () => {
    const passwordHash = await hashPassword(plainTextPassword, savedSalt)
    expect(passwordHash.length).to.equal(1024)
    savedPasswordHash = passwordHash
  })

  it('Confirms that a plain-text password hash matches', async () => {
    const match = await passwordMatches(plainTextPassword, savedSalt, savedPasswordHash)
    expect(match).to.be.true
  })
})
