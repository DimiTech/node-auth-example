const userRepository = require('../repositories/userRepository')

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
  return res.json(user)
}

const create = async (req, res) => {
  const newUserData = req.body
  const createdUser = await userRepository.insert(newUserData)
  res.status(201)
  return res.json(createdUser)
}

const update = async (req, res) => {
  const userId = parseInt(req.params.id, 10)
  const updateUserData = req.body
  const updatedUser = await userRepository.update(userId, updateUserData)
  if (!updatedUser) {
    return res.status(404).end()
  }
  return res.json(updatedUser)
}

const deleteOne = async (req, res) => {
  const id = parseInt(req.params.id, 10)
  const user = await userRepository.deleteOne(id)
  if (!user) {
    return res.status(404).end()
  }
  return res.status(200).end()
}

module.exports = {
  getAll,
  getOne,
  create,
  update,
  deleteOne,
}