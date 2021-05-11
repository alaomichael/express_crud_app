const express = require('express');
const app = express();

// SET UP MONGOOSE
const mongoose = require('mongoose');
const connectionString = process.env.DB || 'mongodb://localhost:27017/contact';

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
const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true, 
        minLength: 2
    },
    author:{
        type: String,
        required: true, 
        minLength: 2
    },
    description: String,
    category: {
        type:String,
        enum: ["fiction","non-fiction","comics","others"],
        default: "fiction"
    },
    purchaseCount: Number,
    imageUrl: String,
    tags: Array,
    color: String
})

const Book = mongoose.model('Book', bookSchema)

// POST request to /books to create a new book
app.post('/books', (req,res) => {
    // retrieve new book details from req.body
    // create a new book and save to db
        Book.create({
        author: req.body.author,
        description: req.body.description,
        title: req.body.title,
        category: req.body.category,
        purchaseCount: req.body.purchaseCount,
        imageUrl: req.body.imageUrl,
        tags: req.body.tags,
        color: req.body.color
    }, (err, newBook) => {
        if(err) {
            return res.status(500).json({message: err})
        } else {
            // send response to client
            return res.status(200).json({message: "new book created", newBook})
        }
    })
})
// GET request to /books to fetch all books
app.get('/books', (req,res)=> {
    // fetch all books
    Book.find({}, (err,books)=>{
        if(err){
            return res.status(500).json({message: err })
        } else {
            // send response to client 
            return res.status(200).json({books})
        }
    })
    
})

// GET request to /books/:id to fetch single book
app.get('/books/:id', (req,res) => {
    // Find by object value
    // Book.findOne({ _id: req.params.id}, (err,book) => {
    //     if (!book) {
    //         // send unsuccessful search message to client 
    //         return res.status(404).json({message: "Book not found."})
            
    //     } else if (err) {
    //         return res.status(500).json({message: err})
    //     } else {
    //         return res.status(200).json({book})
    //     }
    // })

    // Find by Id 
    Book.findById(req.params.id, (err,book) => {
        if (!book) {
            // send unsuccessful search message to client 
            return res.status(404).json({message: "Book not found."})
        } else if (err) {
            return res.status(500).json({message: err})
        } else {
            return res.status(200).json({book})
        }
    })
})
// PUT request to /books/:id to update a single book
app.put('/books/:id', (req,res) => {
    Book.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        category: req.body.category
    }, (err,book) => {
        if(err) {
            return res.status(500).json({message: err})
        } else if (!book){
            return res.status(404).json({message: "Book does not exist."})
        } else {
            book.save((err,savedBook) => {
                if(err) {
                return res.status(400).json({message: err})    
                } else {
                    return res.status(200).json({message: "Book updated successfully."})
                }
            })
        }

    })
})
// DELETE request to /books/:id to delete a book
app.delete('/books/:id',(req,res) => {
    Book.findByIdAndDelete(req.params.id,(err,book)=> {
        if(err) {
            return res.status(500).json({message: err})
        } else if (!book) {
            return res.status(404).json({message: "Book was not found"})
        } else {
            return res.status(200).json({message: "Book deleted successfully."})
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


const port = process.env.PORT || 5000;

app.listen(port, ()=> console.log(`App listening on port ${port}`));
