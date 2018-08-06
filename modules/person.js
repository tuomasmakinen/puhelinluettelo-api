const mongoose = require( 'mongoose' );
const Schema = mongoose.Schema;

const url = 'mongodb://testuser:*********@ds111422.mlab.com:11422/puhelinluettelo-database';

mongoose.connect( url, { useNewUrlParser: true } );

const personSchema = new Schema( {
	name: String,
	number: String
} );

personSchema.statics.format = function( person ) {
	return {
		name: person.name,
		number: person.number,
		id: person._id
	}
};

const Person = mongoose.model( 'Person', personSchema );

module.exports = Person;