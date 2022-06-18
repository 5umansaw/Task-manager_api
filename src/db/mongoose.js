const mongoose = require('mongoose')

 const Url = process.env.MONGODB_URL

 mongoose.connect(Url)

 
 