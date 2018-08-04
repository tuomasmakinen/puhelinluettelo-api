const express = require( 'express' );
const app = express();

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

app.get( '/info', ( request, response ) => {
	let body = `<p>Puhelinluettelossa on ${ persons.length } henkilön tiedot</p><br/><p>${ new Date() }</p>`;
	response.send( body );
} );

const PORT = 3001;
app.listen( PORT, () => {
	console.log( `Server running on port ${ PORT }` );
} );