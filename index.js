const express = require( 'express' );
const bodyParser = require( 'body-parser' );
const morgan = require( 'morgan' );
const Person = require( './modules/person' );

morgan.token( 'body', ( request, response ) => {
	return JSON.stringify( request.body );
} );

const app = express();

app.use( bodyParser.json() );
app.use( morgan( ':method :url :body :status :res[content-length] - :response-time ms' ) );
app.use( express.static( 'build' ) );

let persons = [
	{
		id: 1,
		name: "Arto Hellas",
		number: "040-123456"
	},
	{
		id: 2,
		name: "Martti Tienari",
		number: "040-123456"
	},
	{
		id: 3,
		name: "Arto Järvinen",
		number: "040-123456"
	},
	{
		id: 4,
		name: "Lea Kutvonen",
		number: "040-123456"
	}
];

app.get( '/api/persons', ( request, response ) => {
	Person
		.find({})
		.then( persons => {
			response.json( persons.map( Person.format ) );
		} )
		.catch( error => {
			console.log( error );
		} );
} );

app.get( '/api/persons/:id', ( request, response ) => {
	const id = Number( request.params.id );
	const person = persons.find( person => person.id === id );

	if ( person ) {
		response.json( person );
	} else {
		response.status( 404 ).end();
	}
} );

app.delete( '/api/persons/:id', ( request, response ) => {
	Person
		.findByIdAndRemove( request.params.id )
		.then( result => {
			response.status( 204 ).end();
		} )
		.catch( error => {
			response.status( 400 ).send({ error: 'malformed id' });
		} );
} );

app.post( '/api/persons', ( request, response ) => {
	const body = request.body;

	if ( body.name === undefined || body.number === undefined ) {
		return response.status( 400 ).json( { error: 'name or number missing' } );
	} else if ( persons.find( person => person.name === body.name ) ) {
		return response.status( 400 ).json( { error: 'name must be unique' } );
	}

	const person = new Person( {
		name: body.name,
		number: body.number
	} );

	person
		.save()
		.then( savedPerson => {
			response.json( Person.format( savedPerson ) );
		} )
		.catch( error => {
			console.log( error );
		} );
} );

app.get( '/info', ( request, response ) => {
	let body = `<p>Puhelinluettelossa on ${ persons.length } henkilön tiedot</p><br/><p>${ new Date() }</p>`;
	response.send( body );
} );

const generateId = ( max ) => Math.floor( Math.random() * Math.floor( max ) );

const PORT = process.env.PORT || 3001;
app.listen( PORT, () => {
	console.log( `Server running on port ${ PORT }` );
} );