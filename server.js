const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const decoder = new StringDecoder('utf8');

// handlers will be set on index.js
var server = {

    // handlers for the requests
    handlers: null,

    // routes to map the handlers
    routes: null, 

    //create server
    http_server: http.createServer((request, response) => {
        //Get the url and parse it
        let parsedUrl = url.parse(request.url);

        //Get the path and remove extra characters
        let path = parsedUrl.path.replace(/^\/+|\/+$/g,'');

        let payload = ''
        request.on('data', (chunk) => {
            payload += decoder.write(chunk);
        });

        request.on('end', () => {
            let chosenHandler
            //call appropirate handler
            console.log('handers', this.handlers)
            console.log(this.routes)
            if(request.method == 'POST')
                chosenHandler = (this.routes[path] != undefined) ? this.routes[path] : this.handlers.notFound;
            else
                chosenHandler = this.handlers.notAcceptable

            chosenHandler(payload, (status_code, json_response) => {
                let body = JSON.stringify(json_response);
                response.setHeader('content-type','application/json');
                response.writeHead(status_code);
                response.end(body);
            });
        });
    }),

    // Start the server
    start: (config) => {
        this.http_server.listen(config.port, (err) => {
            if (err)
                console.log(`Cannot start server, details: ${err}`)
            else
                console.log(`Listening on port ${config.port}`)
        });
    }

}

module.exports = server
