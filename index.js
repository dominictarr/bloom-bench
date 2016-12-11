var crypto = require('crypto')

var i = 0, M = 100000, prob = 0.001

var d = require('./calc')(M, prob)

function hash(n, enc) {
  return crypto.createHash('sha256').update(n.toString()).digest(enc)
}
function bench(name, state, n, tests) {
  var results = [name]
  for(var key in tests) {
    var test = tests[key]
    var start = Date.now()
    for(var i = 0; i < n; i++) {
      if(0 === i%1000 && Date.now() - start > 1000) {
        break;
      }
      test(state, i)
    }
    results.push(Math.round(i/((Date.now() - start)/1000)))
  }
  return results
}

var tests = {
  add: function (bf, i) {
    return bf.add(hash(i, 'base64'))
  },
  test: function (bf, i) {
    return bf.has(hash(i, 'base64'))
  },
  test_false: function (bf, i) {
    return bf.has(hash(~i, 'base64'))
  }
}

var algs = {
  jsbloom_notrycatch: function () {
    var b = new (require('jsbloom_notrycatch').filter)(M, prob)
    return {
      add: b.addEntry, has: b.checkEntry
    }
  },
  jsbloom: function () {
    var b = new (require('jsbloom').filter)(M, prob)
    return {
      add: b.addEntry, has: b.checkEntry
    }
  },
  'bloom-filter-cpp': function () {
    var BF = require('bloom-filter-cpp').BloomFilter
    var b = new BF()
    return {
      add: function (v) { b.add(v) }, has: function (v) { b.exists(v) }
    }
  },
  bloomfilter: function () {
    var BF = require('bloomfilter').BloomFilter
    var b = new BF(M, Math.round(M*prob))
    return {
      add: function (v) { b.add(v) }, has: function (v) { b.test(v) }
    }
  },
  'bloom-lite': function () {
    var Bloom = require('bloom-lite')
    var b = new Bloom()
    return {
      add: function (v) { b.add(v) }, has: function (v) { b.exist(v) }
    }
  },
  bloem: function () {
    var B = require('bloem').Bloem
    return new B(M, prob*M)

  },
  'bloom-filter-js': function () {
    var BF = require('bloom-filter-js').BloomFilter
    var b = new BF()
    return {
      add: function (v) { b.add(v) }, has: function (v) { b.exists(v) }
    }
  },
  bloomxx: function () {
    var BloomFilter = require('bloomxx').BloomFilter
    var options =
    {
        bits: d.bits,
        hashes: d.hashes,
        seeds: [1, 2, 3, 4,5,6,7,8,9,10]
    };
    return new BloomFilter(options);
  }
}


console.log('module-name, add, +test, -test')
for(var k in algs) {
  console.log(bench(k, algs[k](), 100000, tests).join(', '))
}

