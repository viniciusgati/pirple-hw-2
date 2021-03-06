/*
 * Library for hashing some string
 *
 */

let lib = {}

lib.generateRandomToken = function(strLength){
  strLength = typeof(strLength) == 'number' && strLength > 0 ? strLength : false
  if(strLength){
    // Define all the possible characters that could go into a string
    var possibleCharacters = 'abcdefghijklmnopqrstuvwxyz0123456789'

    // Start the final string
    var str = ''
    for(i = 1; i <= strLength; i++) {
        // Get a random charactert from the possibleCharacters string
        var randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length))

        // Append this character to the string
        str += randomCharacter
    }
    // Return the final string
    return str
  } else {
    return false
  }
}

// Parse a JSON string to an object in all cases, without throwing
lib.parseJsonToObject = function(str){
  try{
    var obj = JSON.parse(str)
    return obj
  } catch(e) {
    return {}
  }
}

lib.tokenIsValid = function(db, token, callback) {
    db.list('.tokens', (err, fileNames) => {
        if (err)
			callback(false)
		let files = fileNames.filter((fileName) => { return fileName == token })
        if(files.length > 0) {
            db.read('.tokens', token, (err, data) => {
                if (err){
					callback(false)
                } else {
					// returna expired
					callback(Date.now() <= data.expires)
                }
            })
        } else {
            callback(false)
        }
    })
}

// Create a SHA256 hash
module.exports = lib
