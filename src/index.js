const HashMap = require('./HashMap')

function KSCache(size) {
  this.globalDuration = 24 * 60 * 60; // default duration 24 hours
  this.size = size;
  this.cache = new HashMap();
  this.removeCallBack = undefined;
  isExpired = function (now, value) {
    if (!value) return false;
    return now > value.expireTime;
  }
  checkExpire = function (that, key, value) {
    if (isExpired(new Date().getTime(), value)) {
      removeWithCallBack(that, key);
      return null;
    }
    return value.value;
  }
  removeWithCallBack = function (that, key) {
    var item = that.cache.get(key) || {};
    if (that.removeCallBack) {
      that.removeCallBack(key, item.value)
    }
    return that.cache.remove(key);
  }
  houseKeeping = function (that) {
    let anyEviction = false;
    var keys = that.cache.keySet();
    if (keys.length < 1) return;
    var now = new Date().getTime();
    for (var key in keys) {
      if (isExpired(now, that.cache.get(key))) {
        removeWithCallBack(that, key)
        anyEviction = true;
      }
    }
    return anyEviction;
  }
  ensurePut = function (that, key, value, duration) {
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
}
KSCache.prototype = {
  setRemoveCallBack: function (callBack) {
    this.removeCallBack = callBack;
  },
  setGlobalDuration: function (duration) {
    this.globalDuration = duration;
  },
  put: function (key, value, duration) {
    ensurePut(this, key, value, duration);
  },
  get: function (key) {
    var existing = this.cache.get(key);
    return existing ? checkExpire(this, key, existing) : null;
  },
  remove: function (key) {
    removeWithCallBack(this, key);
  },
  clear: function () {
    var allKeys = this.cache.keySet();
    for (var i in allKeys) {
      removeWithCallBack(this, allKeys[i]);
    }
  },
  keys: function () {
    return this.cache.keySet();
  },
  export: function () {
    return this.cache.map;
  },
  import: function (data) {
    console.info("Start Importing!")
    var now = new Date().getTime();
    for (var key in data) {
      var item = data[key];
      var duration = item.expireTime - now;
      console.info("Key->", key, "Item->", data[key], "duration->", duration)
      ensurePut(this, key, item.value, duration > 0 ? duration : 0);
    }
  }
}
KSCache.prototype.constructor = KSCache;
module.exports = KSCache;