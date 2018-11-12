const db = require('../helpers/persistance')
const hasher = require('../helpers/hasher')
const helper = require('../helpers/helper')

// Define users handlers
let handlers = {
    carts: {}
}

console.info('loading shopping cart handlers')

handlers.carts.delete = (payload, callback) => {
    let token = typeof(payload.token) == 'string' ? payload.token : false
    let cart_id = typeof(payload.cart_id) == 'string' ? payload.cart_id : false
    if (token && cart_id) {
        if(helper.tokenIsValid(token)) {
            db.delete('.carts', cart_id,(err) => {
                if(err) {
                    callback(500,{
                        'status': 'file system error',
                        'error-code': 500,
                    })
                } else {
                    callback(202,{
                        'status': 'accepted',
                        'error-code': null,
                    })
                }
            })
        } else {
            callback(401, {
                'status': 'not authenticated',
                'error-code': '401',
                'detail': 'invalid token, maybe it has expired',
            })
        }

    } else {
        callback(400, {
            'status': 'bad request',
            'error-code': '400',
            'detail': 'token not found',
        })
    }
}

handlers.carts.post = (payload, callback) => {

}

module.exports = handlers
