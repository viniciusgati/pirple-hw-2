const db = require('../helpers/persistance')
const hasher = require('../helpers/hasher')
const helper = require('../helpers/helper')

// Define users handlers
let handlers = {
    tokens: {}
}

console.info('loading tokens handlers')

handlers.tokens.delete = (payload, callback) => {
    let token = typeof(payload.token) == 'string' ? payload.token : false
    if (token) {
        db.delete('.tokens', token, (err) => {
            if (err) {
                callback(500,{
                    'status': 'file system error',
                    'error-code': 500,
                })
            } else {
                callback(200, {
                    'status': 'ok',
                    'error-code': null,
                })
            }
        })
    } else {
        callback(404, {
            'status': 'not found',
            'error-code': '404',
            'detail': 'token not exist',
        })
    }
}

handlers.tokens.post = (payload, callback) => {
    let email = payload.email.trim()
    email = typeof(payload.email) == 'string' && payload.email.trim().length > 5 ? payload.email : false
    if (email) {
        let id = hasher.hash(payload.email.toString())
        db.list('.customers', (err, fileNames) => {
            if (err) {
                callback(404, {
                    'status': 'not found',
                    'error-code': '404',
                    'detail': err
                })
            } else {
                let exist = fileNames.filter((fileName) => { return fileName == id }).length > 0
                // se existe o cliente
                if (exist) {
                    let token = helper.generateRandomToken(20)
                    let expires = Date.now() + 1000 * 60 * 60 // 1 hour token
                    var data = {
                        hashed_email: id,
                        email: email,
                        expires: expires
                    }

                    // cria o token
                    db.create('.tokens', token, data, (err) => {
                        if (err) {
                            callback(500,{
                                'status': 'file system error',
                                'error-code': 500,
                            })
                        } else {
                            callback(201,{
                                'status': 'created',
                                'error-code': null,
                                'token': token,
                                'expires': data.expires,
                            })
                        }
                    })
                } else {
                    callback(404, {
                        'status': 'not found',
                        'error-code': '404',
                        'detail': 'user does not exist'
                    })
                }
            }
        })
    } else {
        callback(404, {
            'status': 'not found',
            'error-code': '404',
            'detail': 'user does not exist'
        })
    }
}

module.exports = handlers
