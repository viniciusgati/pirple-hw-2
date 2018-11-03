const db = require('../helpers/persistance')
const hasher = require('../helpers/hasher')

// Define users handlers
let handlers = {
    tokens: {}
}

console.info('loading tokens handlers')

handlers.users.post = (payload, callback) => {
    let email = payload.email.trim()
    let email = typeof(payload.email) == 'string' && payload.email.trim().length == 11 ? payload.email : false
    if (email) {
        let id = hasher.hash(payload.email.toString())
        db.list('/users', (err, fileNames) => {
            if (err) {
                callback(404, {
                    'status': 'not found',
                    'error-code': '404',
                    'detail': err
                })
            } else {
                let exist = fileNames.filter((fileName) => { return fileName == id }).length > 0
                if (exist) {
                    token = helpers.generateRandomToken()
                    var data = {
                        token: token,
                        name: name,
                        email: id
                    }
                    db.create('.tokens', token, data, (err) => {
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
                } else {
                    callback(404, {
                        'status': 'not found',
                        'error-code': '404',
                        'detail': 'not a valid user email'
                    })
                }
            }
        }
        // db.read(hashed_email, (err, data) => {
        //     if (err)
        //         callback(404, {
        //             'error': 'user not found, maybe create a new one :)',
        //             'callback-error': err,
        //             'error-code': 404
        //         })
        //     else
        //         callback(200, {
        //             'status': 'ok',
        //             'user': data,
        //             'error-code': null
        //         })
        // })
    }


}
