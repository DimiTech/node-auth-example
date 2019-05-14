const userStorage = require('../persistence/userStorage')

const getAll = async () => {
  return [ ...userStorage ] // Immutably copy the user storage array
}

const getOneById = async id => {
  return [ ...userStorage ].find(u => u.id === id)
}

const getOneByUsername = async username => {
  return [ ...userStorage ].find(u => u.username === username)
}

const insert = async userData => {
  userStorage.push(userData)
  return [ ...userStorage ].pop()
}

const update = async (userId, userData) => {
  const findIndex = userStorage.findIndex(u => u.id === userId)
  if (findIndex < 0) return
  const foundUserData = userStorage[findIndex]
  return userStorage[findIndex] = {
    ...foundUserData,
    ...userData
  }
}

const deleteOne = async userId => {
  const findIndex = userStorage.findIndex(u => u.id === userId)
  if (findIndex < 0) return
  userStorage.filter((_, i) => i !== findIndex)
  return findIndex
}

module.exports = {
  getAll,
  getOneById,
  getOneByUsername,
  insert,
  update,
  deleteOne,
}
