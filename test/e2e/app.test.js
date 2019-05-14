const request = require('supertest')

const { app } = require('../../app/main')
const ROLES = require('../../app/constants/roles')

let userToken
let adminToken

function getToken(role) {
  const users = {
    [ROLES.ADMIN]: {
      username: 'test_1',
      password: 'pass1'
    },
    [ROLES.USER]: {
      username: 'test_2',
      password: 'pass2'
    },
  }
  return new Promise((resolve, reject) => {
    request(app)
      .post('/login')
      .send(users[role])
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then(res => {
        const { jwt } = res.body
        resolve(jwt)
      })
  })
}

before(async () => {
  userToken  = await getToken(ROLES.USER)
  adminToken = await getToken(ROLES.ADMIN)
})

module.exports = {
  app,
  getUserToken() {
    return userToken
  },
  getAdminToken() {
    return adminToken
  }
}
