// Define users handlers
let handlers = {
    users: {}
}

console.log('loading users handlers')

//send not found message if user requested anything else
handlers.users.get = (_, callback) => {
    callback(404,{
        'error': 'not found',
        'error-code': 404,
    });
};

handlers.users.post = (_, callback) => {
    callback(406, {
        'error': 'not acceptable',
        'error-code': 406
    })
}

module.exports = handlers;

