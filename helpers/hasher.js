/*
 * Library for hashing some string
 *
 */

const crypto = require('crypto')
const config = require('../config')
let lib = {}

lib.hash = function(str){
  if(typeof(str) == 'string' && str.length > 0){
    var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
    return hash;
  } else {
    return false;
  }
}

// Create a SHA256 hash
module.exports = lib
