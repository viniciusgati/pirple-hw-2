const db = require('../helpers/persistance')
const helper = require('../helpers/helper')

// Define users handlers
let handlers = {
    cart: {}
}

console.info('loading shopping cart handlers')

handlers.cart.delete = (payload, callback) => {
    let token = typeof(payload.token) == 'string' ? payload.token : false
    if (token) {
		helper.tokenIsValid(db, token, (is_valid) => {
			if(is_valid) {
				db.delete('.cart', token, (err) => {
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
		})
    } else {
        callback(400, {
            'status': 'bad request',
            'error-code': '400',
            'detail': 'token not found',
        })
    }
}

handlers.cart.post = (payload, callback) => {
	let token = typeof(payload.token) == 'string' ? payload.token : false
	let product = typeof(payload.product) == 'string' ? payload.product : false

	if (token && product) {
		helper.tokenIsValid(db, token, (is_valid) => {
			console.log('valid?', is_valid)
			if(is_valid) {
				// if cart exists then find the cart and add the product
				// if the product exists, then add 1 more
				if(db.exist('.cart', token)) {
					// read the cart
					db.read('.cart', token, (err, cart) => {
						let found = cart.products.filter((product) => {return product.code == product})
						
						if(found.length > 0) {
							// if the product exists increments the quantity
							found[0].quantity += 1
						} else {
							// otherwise push new item
							cart.products.push({code: product, quantity: 1})
						}

						// update the doc
						db.update('.cart', token, cart, (err) => {
							if(err) {
								callback(500,{
									'status': 'file system error 3',
									'error-code': 500,
								})
							} else {
								callback(202,{
									'status': 'accepted',
									'error-code': null,
									'detail': 'Product added to cart',
									'cart': cart
								})
							}
						})
					})
				} else {
					let data = { products: [
						{code: product, quantity: 1}
					]}
					db.create('.cart', token, data, (err) => {
						if(err) {
							callback(500,{
								'status': 'file system error1',
								'error-code': 500,
							})
						} else {
							callback(202,{
								'status': 'accepted',
								'error-code': null,
								'detail': 'Cart created and product added to cart'
							})
						}
					})
				}
			} else {
				callback(401, {
	                'status': 'not authenticated',
	                'error-code': '401',
	                'detail': 'invalid token, maybe it has expired',
	            })
			}
		}) 
	} else {
		callback(400, {
            'status': 'bad request',
            'error-code': '400',
            'detail': 'token not found',
        })
	}
}

module.exports = handlers
