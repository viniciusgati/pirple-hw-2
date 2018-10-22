// Define handlers
let handlers = {}

console.log('loading handlers')

//send back sentence,word and character count if user requested /hello
handlers.hello = (payload, callback) => {
    let character_count = payload.length
    // replace dots with empty spaces to count words avoiding sentences like 'hello.And then' to count wrong
    let word_count = payload.replace('.', ' ').split(' ').length
    // remove dots and filter empty sentences to get the total
    let sentence_count = payload.split('.').filter((el)=> el.length != 0).length

    callback(200, {
        character_count: character_count,
        total_words: word_count,
        sentence_count: sentence_count
    });
}

//send not found message if user requested anything else
handlers.notFound = (_, callback) => {
    callback(404,{
        'error': 'not found',
        'error-code': 404,
    });
};

handlers.notAcceptable = (_, callback) => {
    callback(406, {
        'error': 'not acceptable',
        'error-code': 406
    })
}

module.exports = handlers;

