const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');
const config = require('./config')
const routing = require('./routes')

// handlers will be set on index.js
var server = {}

// create server
server.http_server = http.createServer((request, response) => {
    // Get the url and parse it
    let parsedUrl = url.parse(request.url)

    // Get the path and remove extra characters
    let path = parsedUrl.path.replace(/^\/+|\/+$/g,'')

    let payload = ''
    request.on('data', (chunk) => {
        payload += decoder.write(chunk);
    });

    request.on('end', () => {
        // get the handler
        let chosenHandler = (routing.routes[path] != undefined) ? routing.routes[path] : routing.handlers.notFound

        // get the method
        let method = request.method.toLowerCase()

        // get the method handler if exists, if not returnos notFound handler
        if(chosenHandler != routing.handlers.notFound)
            if(chosenHandler[method] == undefined)
                chosenHandler = routing.handlers.notFound
            else
                chosenHandler = chosenHandler[method]

        // calls the selected handler
        chosenHandler(payload, (status_code, json_response) => {
            let body = JSON.stringify(json_response)
            response.setHeader('content-type','application/json')
            response.writeHead(status_code)
            response.end(body) 
        });
    });
})

// Start the server
server.init = () => {
    server.http_server.listen(config.port, (err) => {
        if (err)
            console.log(`Cannot start server, details: ${err}`)
        else
            console.log(`Http server listening on port ${config.port}`)
    })
}

module.exports = server
