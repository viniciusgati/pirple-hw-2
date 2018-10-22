/*
 * Load the handlers dynamically by filesystem, and return the routes with then
 */
const fs = require('fs')
var handlers = {}

handler_files = fs.readdirSync('./handlers')
if(handler_files)
    handler_files.forEach(file => {
        let hnd = require(`./handlers/${file}`)
        Object.assign(handlers, hnd)
    });
else
    throw `Cannot start server. Handlers could not be found: ${err}`

//define router
routes = {
    'users': handlers.users,
};

module.exports = { handlers: handlers, routes: routes }