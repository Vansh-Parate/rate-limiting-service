local window = redis.call("GET", KEYS[1])

if not window then
    window = {
        count = 0,
        windowStart = tonumber(ARGV[3])
    }
else
    window = cjson.decode(window)
end

local maxRequests = tonumber(ARGV[1])
local windowSize = tonumber(ARGV[2])
local now = tonumber(ARGV[3])

local elapsed = (now - window.windowStart) / 1000

if elapsed >= windowSize then
    window.count = 0
    window.windowStart = now
end

if window.count >= maxRequests then
    return cjson.encode({
        allowed = false,
        remaining = 0
    })
end

window.count = window.count + 1

redis.call(
    "SET",
    KEYS[1],
    cjson.encode(window)
)

return cjson.encode({
    allowed = true,
    remaining = maxRequests - window.count
})