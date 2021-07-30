const KSCache = require("../src/index")

Array.prototype.kyle = "OK";

const removeCallBack = function (key, value) {
  console.info("------Remove Call back!")
  console.info("Removed key:", key);
  console.info("Removed value:", value);
  console.info("------End Call back")
}

var cache0 = new KSCache(2);
cache0.put("http://xxxx","DDDD");
cache0.remove("http://xxxx");

console.info(cache0.export());


console.info("----------------------")


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

console.info("Test Sort-----------------------")

var cache3 = new KSCache(3);
cache3.put("1", "1");
cache3.put("2", "2");
cache3.put("3", "3");
console.info(cache3.getCachedArray(true));
setTimeout(function () {
  console.info("wait 2 seconds");
  cache3.put("3", "3");
  cache3.put("K4", "4");
  console.info(cache3.getCachedArray(true));
  console.info("Get 2", cache3.get("2", true));
  console.info(cache3.getCachedArray(true));

  console.info("traverse keys1")
  var allKeys = cache3.keys();
  for (var i = 0; i < allKeys.length; i++) {
    console.info("Key:", allKeys[i])
  }

  console.info("traverse keys2")
  var allKeys = cache3.keys();
  for (var i in allKeys) {
    console.info("Key:", allKeys[i])
  }

  console.info("AllKeys:=>", cache3.keys());
  console.info("Export", cache3.export());
  console.info("Clear!");
  cache3.clear();
  console.info("After clear", cache3.getCachedArray(true));
  console.info("After clear export", cache3.export());
}, 2000);
//console.info("get 3!",cache3.get("3"));

