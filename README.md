# Form API server
It creates an API to serve forms in JSON format
## Installation
`git clone https://github.com/hack-yg-team-pdf/form-api-server.git`

## Run
`node server.js
This will create an API server listening on port 3500

## Access all forms
This is used to populate the menu in the React app json-forms

Create a GET request to 
`http://localhost:3500/form-categories/`
## Access one form
Create a GET request to 
`localhost:3500/forms/:id`

Example of :id yg3538_e

## Notes
The API supports POST and DELETE requests as well. Can be connected with the scraper and PDF-2-JSON
