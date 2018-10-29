const db = require('../helpers/persistance')
const hasher = require('../helpers/hasher')

// Define users handlers
let handlers = {
    users: {}
}

console.info('loading users handlers')

//send not found message if user requested anything else
handlers.users.get = (payload, callback) => {
    let hashed_id = hasher.hash(payload.id.toString())
    db.read(hashed_id, (err, data) => {
        if(err)
            callback(404, {
                'error': 'user not found, maybe create a new one :)',
                'callback-error': err,
                'error-code': 404
            })
        else
            callback(200, {
                'status': 'ok',
                'user': data,
                'error-code': null
            })
    })
}

handlers.users.post = (payload, callback) => {
    // validates the model
    var password = data.payload.password.trim()
    var password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length == 11 ? data.payload.password : false;

    // verify if it exists, if yes message 'please use put'

    // else create the user

    callback(201,{
        'status': 'created',
        'error-code': null,
    })
}

handlers.users.put = (payload, callback) => {

}

handlers.users.delete = (payload, callback) => {

}

module.exports = handlers;
