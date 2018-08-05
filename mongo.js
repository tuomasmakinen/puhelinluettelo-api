const mongoose = require( 'mongoose' );

const url = 'mongodb://testuser:*********@ds111422.mlab.com:11422/puhelinluettelo-database';

mongoose.connect( url, { useNewUrlParser: true } );

const Person = mongoose.model( 'Person', {
	name: String,
	number: String
} );

if ( process.argv[2] && process.argv[3] ) {
	const person = new Person( {
		name: process.argv[2],
		number: process.argv[3]
	} );

	console.log( `lisätään henkilö ${ person.name } numero ${ person.number } luetteloon` );

	person
		.save()
		.then( result => {
			mongoose.connection.close();
		} );
} else {
	console.log( 'puhelinluettelo:' );
	Person
		.find({})
		.then( result => {
			result.forEach( person => {
				console.log( person.name, person.number );
			} );
			mongoose.connection.close();
		} );
}
