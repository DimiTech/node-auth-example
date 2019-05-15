const express = require('express')
const bodyParser = require('body-parser')

const userController = require('./controllers/userController')
const { authorize } = require('./middleware/auth')
const ROLES = require('./constants/roles')

const app = express()
app.set('port', 3000)

app.use(bodyParser.json())

app.post('/login', userController.logIn)

app.post(  '/users', userController.create)
app.get(   '/users',     authorize(ROLES.ADMIN), userController.getAll)
app.get(   '/users/:id', authorize(ROLES.USER),  userController.getOne)
app.put(   '/users/:id', authorize(ROLES.USER),  userController.update)
app.delete('/users/:id', authorize(ROLES.USER),  userController.deleteOne)

app.listen(
  app.get('port'),
  () => process.stdout.write(`Example app listening on port ${app.get('port')}!\n`)
)

module.exports = {
  app
}
