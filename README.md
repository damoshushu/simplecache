### Features

- support simple memory cache
- support expire time
- support remove call back
- support export and import cache data


### Example

```javascript
var KSCache = require("kscache")

const removeCallBack = function (key, value) {
  console.info("------Remove Call back!")
  console.info("Removed key:", key);
  console.info("Removed value:", value);
  console.info("------End Call back")
}


var myCache = new KSCache(500); // set cache size to 500
myCache.setRemoveCallBack(removeCallBack);
cache.setGlobalDuration(60*60); // optional, defaul will be 24 hours

var key1 = "Key1"
var key2 = "Key2"
cache.put(key1, 1, 3000);
cache.put(key2, 2, 2000);
console.info("Key1 = ", cache.get(key1))
console.info("Key2 = ", cache.get(key2))

cache.remove(key1)
console.info("Key1 removed value = ", cache.get(key1))

setTimeout(function () { console.info("Key 2 Expired Value =", cache.get(key2)); }, 4000);


```

## API

### cache.setRemoveCallBack(callback)

set the callback when an item is removed. (including expire, eviction or remove)

### cache.setGlobalDuration(duration)

set the default expire duration

### cache.put(key,value,duration)

put a value into the cache

### cache.get(key)

returns a value from the cache

### cache.keys()

return all keys in the cache

### cache.export()

export cache data

### cache.import(data)

import cache data

### cache.remove(key)

remove a key from the cache

### cache.clear()

remove all keys from cache

## TODO

- use heap sort to select the eviction item
