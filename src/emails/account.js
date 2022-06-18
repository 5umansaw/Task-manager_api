const nodemailer = require('nodemailer');
const emailSend =  function (name , email , flag) {

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sumansaw071999@gmail.com',
    pass: process.env.EMAIL_PASS_KEY
  }
});


var text
if(flag === 'signUp'){
    text = `Hello ${name} Welcome to the task-manager app *_*`
}else if(flag === 'signOut'){
    text = `Sorry ${name} for your bad experienced , please provide your valuable feedback `
}

var mailOptions = {
  from: 'sumansaw071999@gmail.com',
  to: email,
  subject: 'Sending Email using Node.js',
  text
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

}

module.exports =  emailSend
