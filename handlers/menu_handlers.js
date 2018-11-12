
// Define users handlers
let handlers = {
    menu: {}
}

console.info('loading menu handlers')

handlers.menu.get = (payload, callback) => {
    callback(200, {
        "items" : [
            {
                id: 1,
                name: 'mussarela',
                price: 19.90
            },
            {
                id: 2,
                name: 'calabresa',
                price: 19.90
            },
            {
                id: 3,
                name: 'mama mia',
                price: 38.90
            },
            {
                id: 4,
                name: 'brocolis',
                price: 28.90
            },
            {
                id: 5,
                name: 'peito de peru',
                price: 29.90
            },
            {
                id: 6,
                name: 'champignon',
                price: 34.90
            }
        ]
    })
}

module.exports = handlers
