module.exports = function (items, target_prob) {
 var BUFFER_LEN      = (function() {
            var buffer = Math.ceil((items * Math.log(target_prob)) / Math.log(1.0 / (Math.pow(2.0, Math.log(2.0)))));

            if ((buffer % 8) !== 0) {
                buffer += 8 - (buffer % 8);
            };

            return buffer;
        })()

  var HASH_ROUNDS = Math.round(Math.log(2.0) * BUFFER_LEN / items)
  return {
    bits: BUFFER_LEN, hashes: HASH_ROUNDS, bytes: BUFFER_LEN/8
  }
}
