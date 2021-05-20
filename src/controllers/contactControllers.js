const path = require('path');
const fs = require('fs');
const Contact = require('../models/contact')

exports.home =  (req,res) => {
    
    // create file path
    //   let filepath = path.join(__dirname, 'public', req.url === '/' ? 'index.html' : req.url )
     let filepath = path.resolve('public', req.url === '/' ? 'index.html' : req.url )
    let contentType = getContentType(filepath) || 'text/html'
    // let emptyPagePath = path.join(__dirname,'public','404.html')
let emptyPagePath = path.resolve('public','404.html');

// read from the file using fs module
    fs.readFile(filepath, 'utf8', (err,content) => {
        if (err) {
            if(err.code === 'ENOENT'){
                fs.readFile(emptyPagePath,'utf8',(err,content) => {
                    res.writeHead(200,{'Content-Type': contentType})
                    res.end(content)
                })
            } else {
                res.writeHead(500)
                res.end('A server error has occured!')
            }
        }

        if(!err){
            res.writeHead(200,{'Content-Type': contentType})
            res.end(content)
        }
    })
}

// create dynamic contentType for the header
const getContentType = (filepath) => {
    let extname = path.extname(filepath)
    if(extname === '.js'){
        return 'text/javascript'
    }
      if(extname === '.css'){
        return 'text/css'
    }
      if(extname === '.png'){
        return 'image/png'
    }
          if(extname === '.jpg'){
        return 'image/jpg'
    }
}

exports.createNewContact = (req,res) => {
    // retrieve new Contact details from req.body
    // create a new Contact and save to db
        Contact.create({
       ...req.body
    }, (err, newContact) => {
        if(err) {
            return res.status(500).json({message: err})
        } else {
            // send response to client
            return res.status(200).json({message: "new contact created", newContact})
        }
    })
}

exports.fetchContacts =  (req,res)=> {
    // fetch all Contacts or retrieve searched Contact
    // check req.query for filters
    let conditions = {};
    if (req.query.name){
        conditions.name = req.query.name;
    }
        if (req.query.email){
        conditions.email = req.query.email;
    }
        if (req.query.country){
        conditions.country = req.query.country;
    }
     
    Contact.find(conditions, (err,contacts)=>{
        if(err){
            return res.status(500).json({message: err })
        } else {
            // send response to client 
            return res.status(200).json({contacts})
        }
    })
    
}

exports.fetchSingleContact = (req,res) => {
    // Find by Id 
    Contact.findById(req.params.id, (err,contact) => {
        if (!contact) {
            // send unsuccessful search message to client 
            return res.status(404).json({message: "Contact not found."})
        } else if (err) {
            return res.status(500).json({message: err})
        } else {
            return res.status(200).json({contact})
        }
    })
}

exports.updateSingleContact = (req,res) => {
    Contact.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
        country: req.body.country
    }, (err,contact) => {
        if(err) {
            return res.status(500).json({message: err})
        } else if (!contact){
            return res.status(404).json({message: "Contact does not exist."})
        } else {
            contact.save((err,savedContact) => {
                if(err) {
                return res.status(400).json({message: err})    
                } else {
                    return res.status(200).json({message: "Contact updated successfully."})
                }
            })
        }

    })
}


exports.deleteSingleContact = (req,res) => {
    Contact.findByIdAndDelete(req.params.id,(err,contact)=> {
        if(err) {
            return res.status(500).json({message: err})
        } else if (!contact) {
            return res.status(404).json({message: "Contact was not found."})
        } else {
            return res.status(200).json({message: "Contact deleted successfully."})
        }
    })
}