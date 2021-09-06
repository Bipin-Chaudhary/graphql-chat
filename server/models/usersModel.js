const mongoose = require('mongoose')

const Users = mongoose.Schema({
    name:{type:String, required:true},
    email:{type:String, required:true},

})

module.exports = mongoose.model('users',Users)