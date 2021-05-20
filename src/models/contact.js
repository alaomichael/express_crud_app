const mongoose = require('mongoose');
   
// CREATE SCHEMA
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, 
        minLength: 2
    },
    email:{
        type: String,
        required: true, 
        minLength: 2,
        unique:true
    },  
    country:{
        type: String,
        required: true, 
        minLength: 2,
        default:"Nigeria"
    }
})

const Contact = mongoose.model('Contact', contactSchema)
 
module.exports = Contact;