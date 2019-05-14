const { promisify } = require('util')
const crypto = require('crypto')

const randomBytesAsync = promisify(crypto.randomBytes)
const pbkdf2Async = promisify(crypto.pbkdf2)

async function generateSalt() {
  const saltBuffer = await randomBytesAsync(32)
  return saltBuffer.toString('hex')
}

async function hashPassword(password, salt) {
  const derivedKey = await pbkdf2Async(password, salt, 10000, 512, 'sha512')
  return derivedKey.toString('hex')
}

async function passwordMatches(password, salt, hashedPassword) {
  const derivedKey = await hashPassword(password, salt)
  return derivedKey.toString('hex') === hashedPassword
}

module.exports = {
  generateSalt,
  hashPassword,
  passwordMatches,
}
