const request = require('supertest')
const { expect } = require('chai')

const { app } = require('../app.test')
const userStorage = require('../../../app/persistence/userStorage')

let expectedUserList = [ ...userStorage ] // Copy the userStorage array

describe('POST /users', () => {
  it('Creates a new user', done => {
    const newUser = {
      id: 4,
      username: 'Test 4',
      password: 'test_4_pass'
    }
    expectedUserList.push(newUser)
    request(app)
      .post('/users')
      .send(newUser)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201, newUser, done)
  })
})


describe('PUT /users', () => {
  const userId = 4
  const updatedUser = {
    username: 'Test 4',
    password: 'test_4_pass'
  }

  it('Updates a user', done => {
    expectedUserList = expectedUserList.map(u => {
      if (u.id === userId) {
        return { id: userId, ...updatedUser }
      }
      return u
    })
    request(app)
      .put('/users/' + userId)
      .send(updatedUser)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, { id: userId, ...updatedUser }, done)
  })

  it('Returns a 404 if user is not found', done => {
    request(app)
      .put('/users/999')
      .send(updatedUser)
      .set('Accept', 'application/json')
      .then(res => {
        expect(res.status).to.equal(404)
        expect(res.body).to.deep.equal({})
        done()
      })
  })
})

describe('GET /users', () => {
  it('Returns all users', done => {
    request(app)
      .get('/users')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, expectedUserList, done)
  })
})

describe('GET /users/:id', () => {
  it('Returns a single user', done => {
    const userId = 4
    request(app)
      .get('/users/' + userId)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .then(res => {
        expect(res.status).to.equal(200)
        expect(res.body).to.deep.equal(expectedUserList.find(u => u.id === userId))
        done()
      })
  })

  it('Returns a 404 if user is not found', done => {
    request(app)
      .get('/users/999')
      .set('Accept', 'application/json')
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
      .then(res => {
        expect(res.status).to.equal(404)
        expect(res.body).to.deep.equal({})
        done()
      })
  })
})
