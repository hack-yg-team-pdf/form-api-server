const jsonServer = require('json-server');
const path = require('path');
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();
const fs = require('fs');

const FORM_PATHS = [
    {
        name: "auto",
        path: path.join(__dirname, 'automated-json-forms/')
    },
    {
        name: "manual",
        path: path.join(__dirname, 'manual-json-forms/')
    }
];

server.use(middlewares);

// Returns the request for debugging purposes. TODO: Remove me from production
server.get('/echo', (req, res, next) => {
    res.jsonp(req.query);
    next()
});

server.get('/forms', (req, res) => {
   let out = {};

});

// Returns a JSON file as the response
server.get('/forms/:id', (req, res, next) => {
    let fileName = `${req.params.id}.json`;

    // TODO: Optimize me... use loops and promises
    fs.readFile(`${FORM_PATHS[0].path}${fileName}`, (err, data) => {
        if (err) {
            fs.readFile(`${FORM_PATHS[1].path}}${fileName}`, (err, data) => {
               if (err) {
                   res.status(404).jsonp({error: 'Form not found'});
                   next(err);
               }
               data = JSON.parse(data);
               res.jsonp(data);
               next();
            });
        }
        else {
            data = JSON.parse(data);
            res.jsonp(data);
            next();
        }
    });
});


server.use(router);
server.listen(3500, () => {
    console.log('JSON Server is running');
});