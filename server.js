const jsonServer = require('json-server');
const path = require('path');
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db2.json'));
const middlewares = jsonServer.defaults();
const fs = require('fs');
const util = require('util');
const readdir = util.promisify(fs.readdir);

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

    let promises = FORM_PATHS.map( (p) => {
        new Promise( (resolve, reject) => {
            fs.readdir(p.path, (err, files) => {
                if (err) {
                    reject({
                        message: `An error occured reading path ${p.path}`,
                        err: err
                    });
                    // res.status(500).jsonp({error: `An error occured reading path ${p.path}`});
                }

                resolve( {
                    path_name: p.name,
                    files: files
                } );
            });
        });
    });

    Promise.all(promises).then( (values) => {
        res.jsonp(values);
    }).catch(error => {
        res.status(500).jsonp({error: error});
    });


});

// Returns a JSON file as the response
server.get('/forms/:id', (req, res, next) => {
    console.log(`Fetching ${req.params.id}`)

    const potentialPaths = [
        `${FORM_PATHS[1].path}${req.params.id}_b.json`, // manual bilingual
        `${FORM_PATHS[1].path}${req.params.id}_e.json`, // manual english
        `${FORM_PATHS[0].path}${req.params.id}_b.json`, // manual bilingual
        `${FORM_PATHS[0].path}${req.params.id}_e.json`, // manual english
    ]

    const existingPaths = potentialPaths.filter(p => fs.existsSync(p))

    if (existingPaths.length == 0) {
        res.status(404).jsonp({error: 'Form not found'})
        return
    }

    fs.readFile(existingPaths[0], (err, data) => {
        data = JSON.parse(data)
        res.jsonp(data)
    })
});

// TODO: This is never called. Expected result is to filter French forms. Moving on to next issue.
router.use((req, res, next) => {
    if (req.method === 'GET' && req.url.contains('/form-categories')) {
        let stop;

        files = files.filter( (f) => {
            let stop;
            return ! f.fname.includes('_f');
        })

    }
    // Continue to JSON Server router
    next()
})


server.use(router);



server.listen(3500, () => {
    console.log('JSON Server is running');
});