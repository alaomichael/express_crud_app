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


const express = require('express');
const router = express.Router();
const ContactCtrl = require('../controllers/contactControllers');

// GET request to / to display the homepage
router.get('/', ContactCtrl.home);

// POST request to /Contacts to create a new Contact
router.post('/contacts', ContactCtrl.createNewContact );

// GET request to /contacts to fetch all contacts
router.get('/contacts', ContactCtrl.fetchContacts);

// GET request to /contacts/:id to fetch single Contact
router.get('/contacts/:id', ContactCtrl.fetchSingleContact);

// PUT request to /contacts/:id to update a single contact
router.put('/contacts/:id',ContactCtrl.updateSingleContact);

// DELETE request to /contacts/:id to delete a contact
router.delete('/contacts/:id', ContactCtrl.deleteSingleContact);

module.exports = router;