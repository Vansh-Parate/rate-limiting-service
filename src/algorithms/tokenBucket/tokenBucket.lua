local bucket = cjson.decode(
    redis.call("GET", KEYS[1])
)

local capacity = tonumber(ARGV[1])
local refillRate = tonumber(ARGV[2])
local now = tonumber(ARGV[3])

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
        tokensRemaining = bucket.tokens
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
    tokensRemaining = bucket.tokens
})