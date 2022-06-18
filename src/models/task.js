const mongoose = require('mongoose')


const taskSchema = new mongoose.Schema({
    desc: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: String,
        default: false
    },

    owner: {
       type: mongoose.Schema.Types.ObjectId,
       required: true,
       ref: 'User'
    }
}, {timestamps: true})

const Task = mongoose.model('Task' , taskSchema)


//const Task = mongoose.model('task' , taskSchema)

module.exports = Task