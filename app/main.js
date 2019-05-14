const express = require('express')
const bodyParser = require('body-parser')

const userController = require('./controllers/userController')

const app = express()
app.set('port', 3000)

app.use(bodyParser.json())

app.get('/users', userController.getAll)
app.get('/users/:id', userController.getOne)
app.post('/users', userController.create)
app.put('/users/:id', userController.update)
app.delete('/users/:id', userController.deleteOne)

app.listen(
  app.get('port'),
  () => console.log(`Example app listening on port ${app.get('port')}!`)
)

module.exports = {
  app
}
