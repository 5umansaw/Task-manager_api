const jwt = require('jsonwebtoken')
const { Error } = require('mongoose')
const User = require('../models/user')

const auth = async (req , res , next) => {
    try{
      const token = req.header('Authorization')
      const decoded = jwt.verify(token , process.env.JWT_SECRETE_KEY)
      const user = await User.findOne({_id: decoded._id , 'tokens.token': token})

      if(!user) throw Error
      req.token = token
      req.user = user
      next()
    }catch (e){
        res.status(401).send({error: 'Please aunthenticate.'})
    }
    
}

module.exports = auth