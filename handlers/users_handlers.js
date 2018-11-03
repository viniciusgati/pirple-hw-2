const db = require('../helpers/persistance')
const hasher = require('../helpers/hasher')

// Define users handlers
let handlers = {
    users: {}
}

console.info('loading users handlers')

//send not found message if user requested anything else
handlers.users.get = (payload, callback) => {
    let hashed_email = hasher.hash(payload.email.toString())
    db.read(hashed_email, (err, data) => {
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
    let email = payload.email.trim()
    let email = typeof(payload.email) == 'string' && payload.email.trim().length == 11 ? payload.email : false
    let name = typeof(payload.name) == 'string' && payload.name.length > 5 ? payload.name : false
    let address = typeof(payload.address) == 'string' && payload.address > 5 ? payload.address : false
    let street_address = typeof(payload.street_address) == 'string' && payload.street_address > 5 ? payload.street_address : false

    // verify if it exists, if yes message 'please use put'
    let id = hasher.hash(email)
    db.list('/users', (err, fileNames) => {
        let exist = fileNames.filter((fileName) => { return fileName == id }).length > 0
        if(exist)
            callback(200, {
                'status': 'ok',
                'error-code': null,
            })
        else {
            var data = {
                email: email,
                name: name,
                address: address,
                street_address: street_address
            }
            db.create('.customers', id, data, (err) => {
                if (!err) {
                    callback(201,{
                        'status': 'created',
                        'error-code': null,
                    })
                } else {
                    callback(500,{
                        'status': 'file system error',
                        'error-code': 500,
                    })
                }
            })
        }
    })
}

handlers.users.put = (payload, callback) => {
    // validates the model
    let email = payload.email.trim()
    let email = typeof(payload.email) == 'string' && payload.email.trim().length == 11 ? payload.email : false
    let name = typeof(payload.name) == 'string' && payload.name.length > 5 ? payload.name : false
    let address = typeof(payload.address) == 'string' && payload.address > 5 ? payload.address : false
    let street_address = typeof(payload.street_address) == 'string' && payload.street_address > 5 ? payload.street_address : false

    // verify if it exists, if yes message 'please use put'
    let id = hasher.hash(email)
    db.list('/users', (err, fileNames) => {
        let exist = fileNames.filter((fileName) => { return fileName == id }).length > 0
        if(!exist)
            callback(400, {
                'status': 'Bad request, put needs data to exist, try a post',
                'error-code': '400',
            })
        else {
            var data = {
                email: email,
                name: name,
                address: address,
                street_address: street_address
            }
            db.update('.customers', id, data, (err) => {
                if (!err) {
                    callback(202,{
                        'status': 'accepted',
                        'error-code': null,
                    })
                } else {
                    callback(500,{
                        'status': 'file system error',
                        'error-code': 500,
                    })
                }
            })
        }
    })
}

handlers.users.delete = (payload, callback) => {
    let email = payload.email.trim()
    let email = typeof(payload.email) == 'string' && payload.email.trim().length == 11 ? payload.email : false
    if (email) {
        let id = hasher.hash(email)
        db.delete('.customers', id, (err) => {
            if (err) {
                callback(400, {
                    'status': 'Bad request',
                    'error-code': '400',
                })
            } else {
                callback(202,{
                    'status': 'accepted',
                    'error-code': null,
                })
            }
        })
    } else {
        callback(400, {
            'status': 'Bad request, id is not valid',
            'error-code': '400',
        })
    }
}

module.exports = handlers
