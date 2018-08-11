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
	Person
		.findById( request.params.id )
		.then( person => {
			response.json( Person.format( person ) );
		} )
		.catch( error => {
			console.log( error );
			response.status( 400 ).send({ error: 'malformed id' });
		} );
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
	}

	const person = new Person( {
		name: body.name,
		number: body.number
	} );

	Person
		.find({ name: person.name })
		.then( result => {
			if ( result.length > 0 ) {
				response.status( 400 ).json({ error: 'duplicate name' });
			} else {
				person
					.save()
					.then( savedPerson => {
						response.json( Person.format( savedPerson ) );
					} )
					.catch( error => {
						console.log( error );
					} )
			}
		} );
} );

app.put( '/api/persons/:id', ( request, response ) => {
	const body = request.body;

	const person = {
		name: body.name,
		number: body.number
	};

	Person
		.findByIdAndUpdate( request.params.id, person, { new: true } )
		.then( updatedPerson => {
			response.json( Person.format( updatedPerson ) );
		} )
		.catch( error => {
			console.log( error );
			response.status( 400 ).send({ error: 'malformed id' });
		} );
} );

app.get( '/info', ( request, response ) => {
	Person
		.countDocuments()
		.then( count => {
			let body = `
				<p>Puhelinluettelossa on ${ count } henkilön tiedot</p>
				<p>${ new Date() }</p>`;
			response.send( body );
		} )
		.catch( error => {
			console.log( error );
			response.status( 400 ).send({ error: 'haloo?' });
		} );
} );

const generateId = ( max ) => Math.floor( Math.random() * Math.floor( max ) );

const PORT = process.env.PORT || 3001;
app.listen( PORT, () => {
	console.log( `Server running on port ${ PORT }` );
} );