const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const Task = require('./models/task')
const User = require('./models/user')


const app = express()
const port = process.env.PORT

// const multer = require('multer')

// const upload = multer({
//     dest: 'images',
//     limits: {
//         fileSize: 10000000000000000
//     },
//     fileFilter( req , file , call) {
//       if(!file.originalname.match(/\.(doc | docx)$/)){
//           return call(new Error('please upload a word document'))
//       }
//       call(undefined , true)
//     }
// })

// app.post('/upload' , upload.single('upload') , (req,res) => {
//     res.send()
// })



app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


app.listen(port , () => {
    console.log('Server is up on port ' + port)
})

// const msg = async () => {
//    const task = await Task.findById('62a36e772c176bb03f7f9784').populate('owner')
//    //await task.populate('owner').exec()
//    console.log(task.owner)
// }

//msg()