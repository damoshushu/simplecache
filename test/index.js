const KSCache = require("../src/index")

const removeCallBack = function (key, value) {
  console.info("------Remove Call back!")
  console.info("Removed key:", key);
  console.info("Removed value:", value);
  console.info("------End Call back")
}

var cache = new KSCache(1);
cache.setRemoveCallBack(removeCallBack);
var key = "Key1"
var key2 = "Key2"
cache.setGlobalDuration(5);
console.info("Put Key 1")
cache.put(key, 1);
console.info("Key1 = ", cache.get(key))
console.info("Put Key 2")
cache.put(key2, 2);
console.info("Key1 = ", cache.get(key))
console.info("Key2 = ", cache.get(key2))

console.info("Test Expire")
setTimeout(function () { console.info("Expired Key2 =", cache.get(key2)); }, 6000);
cache.put(key, 1, 60 * 1000);
console.info("Test export");
var cacheData = cache.export();
console.info(cacheData)
var cache2 = new KSCache(10);
cache2.import(cacheData);
cache2.put("Cache2", 2, 5000);
console.info("After Import!")
console.info("Cache 2 Key1:", cache2.get(key));
console.info("Cache 2 Keys:", cache2.keys());
var keys = cache2.keys();
for (var i in keys) {
  console.info("Cache2 Key =>", keys[i], "Value =>", cache2.get(keys[i]));
}
console.info("Remove one key")
cache2.remove(key)
console.info("Cache 2 Key1:", cache2.get(key));
