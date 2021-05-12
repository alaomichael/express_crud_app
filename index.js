const express = require('express');
const app = express();
require('dotenv').config();

// SET UP MONGOOSE
const mongoose = require('mongoose');
const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/contacts';

app.use(express.json());

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

// CREATE SCHEMA
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, 
        minLength: 3
    },
    email:{
        type: String,
        required: true, 
        minLength: 2
    },
    country: {
        type:String,
        required: true, 
        default: "Nigeria"
    }
})

const contact = mongoose.model('contact', contactSchema)

// POST request to /contacts to create a new contact
app.post('/contacts', (req,res) => {
    // retrieve new contact details from req.body
    // create a new contact and save to db
        contact.create({
        name: req.body.name,
        email: req.body.email,
        country: req.body.country
    }, (err, newcontact) => {
        if(err) {
            return res.status(500).json({message: err})
        } else {
            // send response to client
            return res.status(200).json({message: "new contact created", newcontact})
        }
    })
})

// GET request to /contacts to fetch all contacts
app.get('/contacts', (req,res)=> {
    // fetch all contacts
    contact.find({}, (err,contacts)=>{
        if(err){
            return res.status(500).json({message: err })
        } else {
            // send response to client 
            return res.status(200).json({message: "All contacts fetched successfully",contacts})
        }
    })
    
})

// GET request to /contacts/:id to fetch single contact
app.get('/contacts/:id', (req,res) => {
    // Find by object value
    // contact.findOne({ _id: req.params.id}, (err,contact) => {
    //     if (!contact) {
    //         // send unsuccessful search message to client 
    //         return res.status(404).json({message: "contact not found."})
            
    //     } else if (err) {
    //         return res.status(500).json({message: err})
    //     } else {
    //         return res.status(200).json({contact})
    //     }
    // })

    // Find by Id 
    contact.findById(req.params.id, (err,contact) => {
        if (!contact) {
            // send unsuccessful search message to client 
            return res.status(404).json({message: "contact not found."})
        } else if (err) {
            return res.status(500).json({message: err})
        } else {
            return res.status(200).json({message: "contact found in the database.",contact})
        }
    })
})
// PUT request to /contacts/:id to update a single contact
app.put('/contacts/:id', (req,res) => {
    contact.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        country: req.body.country
    }, (err,contact) => {
        if(err) {
            return res.status(500).json({message: err})
        } else if (!contact){
            return res.status(404).json({message: "Contact does not exist."})
        } else {
            contact.save((err,savedcontact) => {
                if(err) {
                return res.status(400).json({message: err})    
                } else {
                    return res.status(200).json({message: "Contact updated successfully."})
                }  })
        }

    })
})
// DELETE request to /contacts/:id to delete a contact
app.delete('/contacts/:id',(req,res) => {
    contact.findByIdAndDelete(req.params.id,(err,contact)=> {
        if(err) {
            return res.status(500).json({message: err})
        } else if (!contact) {
            return res.status(404).json({message: "Contact was not found"})
        } else {
            return res.status(200).json({message: "Contact deleted successfully."})
        }
    })
})



/**
 * Model.find -> fetch multiple documents
 * Model.findOne -> fetch single document
 * Model.findById -> fetch single document by Id
 * 
 * Model.findOneAndUpdate
 * Model.findByIdAndUpdate
 * 
 * Model.findOneAndDelete 
 * Model.findByIdAndDelete
 * Model.findOneAndRemove
 * Model.findByIdAndRemove
*/

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}


const port = process.env.PORT || 5000;

app.listen(port, ()=> console.log(`App listening on port ${port}`));
        