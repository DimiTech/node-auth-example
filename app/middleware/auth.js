const { generateToken, verifyToken } = require('../util/jwt')
const userRepository = require('../repositories/userRepository')
const ROLES = require('../constants/roles')

function authorize(role = ROLES.USER) {
  return async (req, res, next) => {
    const authorizationHeader = req.headers['authorization']
    if (!authorizationHeader) {
      return res.status(401).end()
    }
    const token = authorizationHeader.replace('Bearer ', '')
    try {
      const decoded = await verifyToken(token)
      if (decoded.role < role) {
        // Unauthorized!
        return res.status(403).end()
      }
      const username = decoded.username
      // TODO: Principal?
      req.user = await userRepository.getOneByUsername(username)
      next()
    } catch (e) {
      console.error(e)
      return res.status(403).end()
    }
  }
}


module.exports = {
  authorize,
}