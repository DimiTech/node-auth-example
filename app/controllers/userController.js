const ROLES = require('../constants/roles')
const userRepository = require('../repositories/userRepository')
const { generateSalt, hashPassword, passwordHashMatches } = require('../util/crypto')
const { generateToken } = require('../util/jwt')

const logIn = async (req, res) => {
  const { username, password } = req.body
  const user = await userRepository.getOneByUsername(username)
  if (!user) {
    return res.status(404).end()
  }
  if (!passwordHashMatches(password, user.salt, user.password)) {
    return res.status(401).end()
  }
  const token = await generateToken({ role: user.role, username: user.username })
  return res.status(200).json({ jwt: token })
}

const getAll = async (_req, res) => {
  const users = await userRepository.getAll()
  return res.json(users)
}

const getOne = async (req, res) => {
  const id = parseInt(req.params.id, 10)
  const user = await userRepository.getOneById(id)
  if (!user) {
    return res.status(404).end()
  }
  if (req.user.role < ROLES.ADMIN && req.user.id !== id) {
    return res.status(403).end()
  }
  return res.json(user)
}

const create = async (req, res) => {
  const salt = await generateSalt()
  const passwordHash = await hashPassword(req.body.password, salt)
  newUserData = {
    ...req.body,
    salt,
    password: passwordHash,
    role: ROLES.USER,
  }
  const createdUser = await userRepository.insert(newUserData)
  res.status(201)
  return res.json(createdUser)
}

const update = async (req, res) => {
  const userId = parseInt(req.params.id, 10)
  const updateUserData = req.body

  if (req.user.role < ROLES.ADMIN && req.user.id !== userId) {
    return res.status(403).end()
  }

  const disallowedProperties = [ 'password', 'id' ]
  disallowedProperties.forEach(key => delete updateUserData[key])

  const updatedUser = await userRepository.update(userId, updateUserData)
  if (!updatedUser) {
    return res.status(404).end()
  }
  return res.json(updatedUser)
}

const deleteOne = async (req, res) => {
  const id = parseInt(req.params.id, 10)

  if (req.user.role < ROLES.ADMIN && req.user.id !== id) {
    return res.status(403).end()
  }

  const user = await userRepository.deleteOne(id)
  if (!user) {
    return res.status(404).end()
  }
  return res.status(200).end()
}

module.exports = {
  logIn,
  getAll,
  getOne,
  create,
  update,
  deleteOne,
}