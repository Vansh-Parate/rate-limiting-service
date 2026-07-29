local capacity = tonumber(ARGV[1])
local refillRate = tonumber(ARGV[2])
local now = tonumber(ARGV[3])

local bucketData = redis.call("GET", KEYS[1])

local bucket

if not bucketData then
    bucket = {
        tokens = capacity,
        lastRefill = now
    }
else
    bucket = cjson.decode(bucketData)
end

local elapsed = (now - bucket.lastRefill) / 1000
local refill = elapsed * refillRate

bucket.tokens = math.min(
    capacity,
    bucket.tokens + refill
)

bucket.lastRefill = now

if bucket.tokens < 1 then
    return cjson.encode({
        allowed = false,
        remaining = bucket.tokens
    })
end

bucket.tokens = bucket.tokens - 1

redis.call(
    "SET",
    KEYS[1],
    cjson.encode(bucket)
)

return cjson.encode({
    allowed = true,
    remaining = bucket.tokens
})