const fs = require('fs')

var Routing = function() {
    routes: null
    handlers: null
    init: null
}

Routing.prototype.init = () => {
    fs.readdir('./handlers', (err, files) => {
        if(err){
            throw `Cannot start server. Handlers could not be found: ${err}` 
        } else {
            files.forEach(file => {
                console.log(`loading file ${file}`)
                let hnd = require(`./handlers/${file}`)
                Object.assign(handlers, hnd)
            });
    
            //define router
            routes = {
                'users': handlers.users,
            };
        }
    })
}

module.exports = new Routing()