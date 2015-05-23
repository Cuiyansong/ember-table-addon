import Ember from 'ember';

<<<<<<< HEAD
export default Ember.ArrayProxy.extend({
  //Total count of rows
  totalCount: undefined,

  // Function to get next chunk of rows.
  // The callback should return a promise which will return an array of rows.
  // The callback function should maintain the sequence of chunks,
  // first call to it should return first chunk, next call to it should return next chunk.
  callback: undefined,

  chunkSize: undefined,

  init: function () {
    var totalCount = this.get('_totalCount');
    var lazyContent = new Array(totalCount);

    this.set('_lazyContent', lazyContent);
  },

  objectAt: function (index) {
    var lazyContent = this.get('_lazyContent');
    var chunkSize = this.get('chunkSize');
    if (!lazyContent[index]) {
      this.loadOneChunk(Math.floor(index / chunkSize));
    }
    this.tryPreload(index, chunkSize);
    return lazyContent[index];
  },

  length: Ember.computed.alias('_totalCount'),

  loadOneChunk: function (chunkIndex) {
    var lazyContent = this.get('_lazyContent');
    var chunkSize = this.get('chunkSize');
    var chunkStart = chunkIndex * chunkSize;
    var totalCount = this.get('_totalCount');
    for (var x = 0; x < chunkSize && chunkStart + x < totalCount; x++) {
      lazyContent[chunkStart + x] = Ember.ObjectProxy.create({"isLoaded": false});
    }

    this.callback(chunkIndex).then(function (chunk) {
      lazyContent.slice(chunkStart, chunkStart + chunkSize)
        .forEach(function (row, x) {
          row.set('isLoaded', true);
          row.set('content', chunk[x]);
        });
    });
  },

  tryPreload: function (index, chunkSize) {
    var chunkEndIndex = Math.floor(index / chunkSize + 1) * chunkSize - 1;
    var lastRowIndex = this.get('_totalCount') - 1;
    if (chunkEndIndex >= lastRowIndex) { return; }

    if (chunkEndIndex - index <= this.get('_preloadGate')) {
      this.objectAt(chunkEndIndex + 1);
    }
  },

  _totalCount: Ember.computed(function() {
    return parseInt(this.get('totalCount'));
  }).property('totalCount'),

  _lazyContent: null,
  _preloadGate: 10

});
=======
export default function (totalCount, initSize, getNextChunk) {
  var ret = Ember.A(new Array(0));

  var LazyArray = Ember.ArrayProxy.extend({
    objectAt: function (index) {
      var loadCount = index + 11;
      if (loadCount >= ret.length) {
        var chunksNeeded = parseInt((loadCount - ret.length) / 100) + 1;
        var promises = [];
        for(var i=0; i<chunksNeeded; i++) {
          promises.push(getNextChunk());
        }
        Ember.RSVP.all(promises).then(function (chunks) {
          ret = chunks.reduce(function(result, chunk) {
            return result.concat(chunk);
          }, []);
        });
      }
      return ret[index];
    },

    length: totalCount
  });

  return LazyArray.create({
    content: Ember.A(new Array(0))
  });
}
>>>>>>> master
