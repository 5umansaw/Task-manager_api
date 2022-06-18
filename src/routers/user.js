const express = require('express')
const multer = require('multer')
const sharp = require('sharp')
const User = require('../models/user')
const emailSend = require('../emails/account')
const auth = require('../middleware/auth')
const router = new express.Router()


router.post('/users', async (req , res) => {
    const user = new User(req.body)

      try{
        await user.save()
        emailSend(req.body.name , req.body.email , 'signUp')
        const token = await user.generateAuthToken()
        res.status(201).send({user , token})
        
      }catch(e){
        res.status(400).send(e)
      }
})

 router.post('/users/login' , async (req,res) =>{
    try{
      const user = await User.findByCredentials(req.body.email , req.body.password)
      const token = await user.generateAuthToken()
      res.send({user , token})
    } catch(e){
      res.status(400).send(e)
    }
 })
 
 router.post('/users/logout' , auth , async (req , res) =>{
         
       try{
          req.user.tokens = req.user.tokens.filter((token) => {
              return token.token !== req.token
          })

          await req.user.save()
          res.send(req.user)
       }catch(e){
        res.status(500).send(e)
       }
 })

 router.post('/users/logoutAll' , auth , async (req , res) => {
      try{
        req.user.tokens = []
        await req.user.save()
        res.send()
      }catch (e) {
        res.status(500).send()
      }
 })


 router.get('/users/me' , auth , async (req ,res) => {
      res.send(req.user)
 })

 router.get('/users/:id' , async (req , res) =>{
     const _id = req.params.id
     
     try{
        const user = await User.findById(_id)
        if(!user) return res.status(404).send()
        res.send(user)
     }catch(e){
        res.status(500).send(e)
     }
 })

 router.patch('/users/me' ,auth , async (req , res) =>{
    //const _id = req.params.id
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name' , 'email' , 'password' , 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation) return res.status(400).send({error: 'Invalid Updates'})
     

    try{

      updates.forEach((update) => req.user[update] = req.body[update])
      await req.user.save()
      //const user = await User.findByIdAndUpdate(_id , req.body , {new: true , runValidators: true})
      res.send(req.user)

    }catch(e){
        res.status(400).send(e)
    }
 })

 router.delete('/users/me' , auth , async (req , res) => {
     try{
        //  const user = await User.findByIdAndDelete(req.params.id)
        //  if(!user) return res.status(404).send()
        emailSend(req.user.name , req.user.email , 'signOut')
         await req.user.remove()
         res.send(req.user)
     }catch(e){
         res.status(400).send(e)
     }
 })

 const upload = multer({

  limits: {
    fileSize: 1000000
  },
  fileFilter (req , file , call){
    if(!file.originalname.match(/\.(png|jpg|jpeg)$/)){
      return call(new Error('Please upload an image'))
    }
    call(undefined , true)
  }
})

 router.post('/users/me/avatar' , auth ,  upload.single('avatar') , async (req , res)=>{
  const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer()
  
  req.user.avatar = buffer
  await req.user.save()
  res.send();
 },(error,req,res,next) => {
   res.status(400).send({error: error.message})
 })

 router.delete('/users/me/avatar', auth , async (req , res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send();
 })

 router.get('/users/:id/avatar' , async (req,res) => {
    try{

      const user = await User.findById(req.params.id)

      if(!user || !user.avatar){
        throw new Error
      }
      res.set('Content-Type', 'image/png')
      res.send(user.avatar)

    }catch (e) {
      res.status(400).send()
    }
 })


module.exports = router