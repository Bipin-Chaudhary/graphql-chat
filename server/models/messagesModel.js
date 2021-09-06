const mongoose = require('mongoose')

const Messages = mongoose.Schema({
    message: {type:String, required:true},
    senderMail: {type:String, required:true},
    receiverMail: {type:String, required:true},
    dCreatedAt :{type:Date}
    
})

module.exports = mongoose.model('messages',Messages)