const HashMap = require('./HashMap')


var isExpired = function (now, value) {
  if (!value) return false;
  return now > value.expireTime;
}
var checkExpire = function (that, key, value, isUpdateDuration) {
  let now = new Date().getTime();
  if (isExpired(now, value)) {
    removeWithCallBack(that, key);
    return null;
  }
  if (isUpdateDuration) {
    value.expireTime = now + that.globalDuration;
  }
  return value.value;
}
var removeWithCallBack = function (that, key) {
  var item = that.cache.get(key) || {};
  var result = that.cache.remove(key)
  if (that.removeCallBack) {
    that.removeCallBack(key, item.value)
  }
  return result;
}
var houseKeeping = function (that) {
  let anyEviction = false;
  var keys = that.cache.keySet();
  if (keys.length < 1) return;
  var now = new Date().getTime();
  for (var i in keys) {
    let key = keys[i];
    if (isExpired(now, that.cache.get(keys[i]))) {
      removeWithCallBack(that, key)
      anyEviction = true;
    }
  }
  return anyEviction;
}
var update = function(that,key,value) {
  let oldValue = that.cache.get(key)
  that.cache.put(key, {
    value,
    expireTime:oldValue.expireTime
  });
}
var ensurePut = function (that, key, value, duration) {
  var keys = that.cache.keySet();
  if (!that.cache.get(key) && keys.length >= that.size && !houseKeeping(that)) {
    removeWithCallBack(that, keys[0]);
  }
  var now = new Date().getTime();
  var expireTime = duration && duration >= 0 ? now + duration : now + that.globalDuration;
  that.cache.put(key, {
    value,
    expireTime
  });
}

function KSCache(size) {
  this.globalDuration = 365 * 24 * 60 * 60; // default duration 365 days
  this.size = size;
  this.cache = new HashMap();
  this.removeCallBack = undefined;
  this.clearCallBack = undefined;
}
KSCache.prototype = {
  setClearCallBack: function (callBack) {
    this.clearCallBack = callBack;
  },
  setRemoveCallBack: function (callBack) {
    this.removeCallBack = callBack;
  },
  setGlobalDuration: function (duration) {
    this.globalDuration = duration;
  },
  update:function (key, value) {
    update(this, key, value);
  },
  put: function (key, value, duration) {
    ensurePut(this, key, value, duration);
  },
  get: function (key, updateDurarion) {
    var existing = this.cache.get(key);
    return existing ? checkExpire(this, key, existing, updateDurarion) : null;
  },
  remove: function (key) {
    removeWithCallBack(this, key);
  },
  clear: function () {
    var allKeys = this.cache.keySet();
    for (let i = 0; i < allKeys.length; i++) {
      removeWithCallBack(this, allKeys[i]);
    }
    if (this.clearCallBack) {
      this.clearCallBack();
    }
  },
  keysWithExpireTime: function () {
    return this.cache.keySet();
  },
  keys: function () {
    return this.cache.keySet();
  },
  getCachedArray: function (isSort) {
    var _cacheArray = [];
    for (var key in this.cache.map) {
      _cacheArray.push(this.cache.map[key]);
    }
    if (isSort) {
      _cacheArray.sort((a, b) => b.expireTime - a.expireTime);
    }
    return _cacheArray.map(v => v.value);
  },
  export: function () {
    return this.cache.map;
  },
  import: function (data) {
    var now = new Date().getTime();
    for (var key in data) {
      var item = data[key];
      var duration = item.expireTime - now;
      ensurePut(this, key, item.value, duration > 0 ? duration : 0);
    }
  }
}
KSCache.prototype.constructor = KSCache;
module.exports = KSCache;