const { expect } = require('chai')

const {
  generateSalt,
  hashPassword,
  passwordHashMatches
} = require('../../../app/util/crypto')


describe('Crypto Utilities', () => {
  const plainTextPassword = 'pass3'
  let salt
  let passwordHash

  describe('generateSalt()', () => {
    it('Generates a "salt" Buffer and returns its Hexadecimal string representation', async () => {
      salt = await generateSalt()
      expect(salt.length).to.equal(64)
    })
  })

  describe('hashPassword()', () => {
    it('Produces "hashedPassword" from a plain-text "password" and a Hexadecimal string "salt"', async () => {
      passwordHash = await hashPassword(plainTextPassword, salt)
      expect(passwordHash.length).to.equal(1024)
    })
  })

  describe('passwordHashMatches()', () => {
    it('Determines if a salted plain-text password hash matches the given hash', async () => {
      const match = await passwordHashMatches(plainTextPassword, salt, passwordHash)
      expect(match).to.be.true
    })
  })
})
