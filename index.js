const express = require( 'express' );
const app = express();
const bodyParser = require( 'body-parser' );

app.use( bodyParser.json() );

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
	response.json( persons );
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
	const id = Number( request.params.id );
	persons = persons.filter( person => person.id !== id );

	response.status( 204 ).end();
} );

app.post( '/api/persons', ( request, response ) => {
	const body = request.body;

	if ( body.name === undefined || body.number === undefined ) {
		return response.status( 400 ).json( { error: 'name or number missing' } );
	}

	const person = {
		name: body.name,
		number: body.number,
		id: generateId( 1000 )
	};

	persons = persons.concat( person );

	response.json( person );
} );

app.get( '/info', ( request, response ) => {
	let body = `<p>Puhelinluettelossa on ${ persons.length } henkilön tiedot</p><br/><p>${ new Date() }</p>`;
	response.send( body );
} );

const generateId = ( max ) => {
	Math.floor( Math.random() * Math.floor( max ) );
};

const PORT = 3001;
app.listen( PORT, () => {
	console.log( `Server running on port ${ PORT }` );
} );