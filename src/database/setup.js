// SET UP MONGOOSE
const mongoose = require('mongoose');
const connectionString = process.env.LOCALDB || process.env.MONGODB_URI 
console.log(connectionString);

module.exports = function() {
mongoose.connect(connectionString,{
    useNewUrlParser:true,
    useUnifiedTopology: true,
    useFindAndModify: false
}, (err) => {
if(err) {
    console.log(err);
} else {
    console.log('Database connection successful');
}
})
}

