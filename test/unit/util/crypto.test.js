const { expect } = require('chai')

const {
  generateSalt,
  hashPassword,
  passwordMatches
} = require('../../../app/util/crypto')


describe('Hashing / Password Matching', () => {
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

  describe('passwordMatches()', () => {
    it('Determines if a salted plain-text password hash matches the given hash', async () => {
      const match = await passwordMatches(plainTextPassword, salt, passwordHash)
      expect(match).to.be.true
    })
  })
})
