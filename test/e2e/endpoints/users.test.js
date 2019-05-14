const request = require('supertest')
const { expect } = require('chai')

const { app, getUserToken, getAdminToken } = require('../app.test')
const userStorage = require('../../../app/persistence/userStorage')
const { hashPassword } = require('../../../app/util/crypto')

let expectedUserList = [ ...userStorage ] // Copy the userStorage array

let userToken
before(async () => {
  adminToken = getAdminToken()
  userToken  = getUserToken()
})

describe('/users', () => {
  describe('POST /users', () => {
    it('Creates a new user', done => {
      const newUser = {
        id: 4,
        username: 'test_4',
        password: 'pass4'
      }
      request(app)
        .post('/users')
        .send(newUser)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .then(async res => {
          expect(res.status).to.equal(201)
          const insertedUser = res.body
          expect(insertedUser.id).to.equal(newUser.id)
          expect(insertedUser.username).to.equal(newUser.username)
          expect(insertedUser.salt.length).to.equal(64)
          expect(insertedUser.password).to.equal(
            await hashPassword(newUser.password, insertedUser.salt)
          )

          expectedUserList.push(insertedUser)
          done()
        })
    })
  })


  describe('PUT /users', () => {
    const userId = 2
    const updateUserData = {
      city: 'Changed City'
    }

    it('Updates a user', done => {
      request(app)
        .put('/users/' + userId)
        .send(updateUserData)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + userToken)
        .expect('Content-Type', /json/)
        .then(async res => {
          expect(res.status).to.equal(200)
          const updatedUser = res.body
          expect(updatedUser.id).to.equal(userId)
          expect(updatedUser.city).to.equal(updateUserData.city)
          expect(updatedUser.salt.length).to.equal(64)
          expect(updatedUser.password.length).to.equal(1024)

          expectedUserList = expectedUserList.map(u => {
            if (u.id === userId) {
              return { id: userId, ...updatedUser }
            }
            return u
          })
          done()
        })
    })

    it('Returns a 403 if a user with a USER role tries to update users other than itself', done => {
      request(app)
        .put('/users/' + 3)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + userToken)
        .expect(403, {}, done)
    })

    it('Does not allow updating the "password" property', done => {
      request(app)
        .put('/users/' + userId)
        .send({ password: '1234' })
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + userToken)
        .expect('Content-Type', /json/)
        .expect(200, expectedUserList.find(u => u.id === userId), done)
    })

    it('Returns a 404 if user is not found', done => {
      request(app)
        .put('/users/999')
        .send(updateUserData)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + adminToken)
        .then(res => {
          expect(res.status).to.equal(404)
          expect(res.body).to.deep.equal({})
          done()
        })
    })
  })

  describe('GET /users', () => {
    it('Returns all users if authorization level is >= ADMIN', done => {
      request(app)
        .get('/users')
        .set('Authorization', 'Bearer ' + adminToken)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, expectedUserList, done)
    })

    it('Returns 403 if authorization level is < ADMIN', done => {
      request(app)
        .get('/users')
        .set('Authorization', 'Bearer ' + userToken)
        .set('Accept', 'application/json')
        .expect(403, {}, done)
    })
  })

  describe('GET /users/:id', () => {
    it('Returns a single user', done => {
      const userId = 2
      request(app)
        .get('/users/' + userId)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + userToken)
        .expect('Content-Type', /json/)
        .then(res => {
          expect(res.status).to.equal(200)
          expect(res.body).to.deep.equal(expectedUserList.find(u => u.id === userId))
          done()
        })
    })

    it('Returns a 403 if a user with a USER role tries to get users other than itself', done => {
      request(app)
        .get('/users/' + 3)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + userToken)
        .expect(403, {}, done)
    })

    it('Returns a 404 if user is not found', done => {
      request(app)
        .get('/users/999')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + userToken)
        .then(res => {
          expect(res.status).to.equal(404)
          expect(res.body).to.deep.equal({})
          done()
        })
    })
  })

  describe('DELETE /users/:id', () => {
    it('Removes a single user', done => {
      const userId = 4
      expectedUserList = expectedUserList.filter(u => u !== userId)
      request(app)
        .delete('/users/' + userId)
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + adminToken)
        .then(res => {
          expect(res.status).to.equal(200)
          expect(res.body).to.deep.equal({})
          done()
        })
    })

    it('Returns a 404 if user is not found', done => {
      request(app)
        .delete('/users/999')
        .set('Accept', 'application/json')
        .set('Authorization', 'Bearer ' + adminToken)
        .then(res => {
          expect(res.status).to.equal(404)
          expect(res.body).to.deep.equal({})
          done()
        })
    })
  })
})
