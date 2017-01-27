let mongoose = require('mongoose');
//let Schema = mongoose.Schema;


// Define our user schema
let userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

module.exports.Contact = mongoose.model('Contact', userSchema);

mongoose.connect("mongodb://127.0.0.1/projectDb");
