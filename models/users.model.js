const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstname: {
     type: String,
     required: true 
},
lastname: { 
    type: String, 
    required: true 
},
email: {
    type: String,
    unique: true,
    required: true,
    validate: {
        validator: function (v) {
            return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: "Please enter a valid email",
    },
},
  mobileno: { 
    type: String, 
    required: true,
    unique:true
},
  password: { 
    type: String, 
    required: true ,
    minlength: 8
},
role: { 
    type: String, 
    required: true,
    enum : ['User','Admin'],
    default: 'User'
},
},{
    timestamps:true,
});

module.exports = mongoose.model('Users', userSchema);


