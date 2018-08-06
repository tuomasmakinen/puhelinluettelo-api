const mongoose = require( 'mongoose' );

const url = 'mongodb://testuser:*********@ds111422.mlab.com:11422/puhelinluettelo-database';

mongoose.connect( url, { useNewUrlParser: true } );

const Person = mongoose.model( 'Person', {
	name: String,
	number: String
} );

module.exports = Person;