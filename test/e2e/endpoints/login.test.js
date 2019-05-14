const request = require('supertest')
const { expect } = require('chai')

const { app } = require('../app.test')

describe('/login', () => {
  describe('POST /login', () => {
    it('Logs you in Given a valid username and password', done => {
      const loginRequest = {
        username: 'test_1',
        password: 'pass1'
      }

      request(app)
        .post('/login')
        .send(loginRequest)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .then(async res => {
          expect(res.status).to.equal(200)
          const response = res.body
          expect(typeof response.jwt).to.equal('string')
          expect(response.jwt.match(/\./g).length).to.equal(2)
          expect(response.jwt.length).to.be.greaterThan(500)
          done()
        })
    })
  })
})
