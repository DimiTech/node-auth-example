const fs  = require('fs')
const jwt = require('jsonwebtoken')

const privateKey = fs.readFileSync('./secrets/privkey.pem.enc', 'utf8')
const publicKey  = fs.readFileSync('./secrets/pubkey.pem', 'utf8')

// All of this data is public
const baseSignOptions = {
  issuer    : 'Test Company',             // Software organization who issues the token
  // subject   : 'user@test.com',            // Intended user of the token
  audience  : 'https://test-company.com', // Basically identity of the intended recipient of the token
  expiresIn : '12h',
  algorithm : 'RS256'
}

// TODO: Store this securely - In an ENV variable
const PRIVATE_KEY_PASSPHRASE = 'secret'

function generateToken(user) {
  return new Promise((resolve, reject) => {
    const payload = {
      role: user.role
    }
    const privateKeyWithPassphrase = { passphrase: PRIVATE_KEY_PASSPHRASE, key: privateKey }
    const signOptions = { ...baseSignOptions, ...{ subject: user.username }}
    jwt.sign(payload, privateKeyWithPassphrase, signOptions, (err, token) => {
      if (err) return reject(err)
      return resolve(token)
    })
  })
}

function verifyToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, publicKey, baseSignOptions, (err, decoded) => {
      if (err) return reject(err)
      return resolve(decoded)
    })
  })
}

module.exports = {
  generateToken,
  verifyToken,
}
