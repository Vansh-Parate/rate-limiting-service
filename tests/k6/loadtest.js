import http from "k6/http";
import {Counter} from "k6/metrics"

export const options = {
    vus: 10,
    iterations: 10,
};

const allowedCounter = new Counter("allowed_requests");
const deniedCounter = new Counter("denied_requests");

export default function () {
    const res = http.post(
        "http://localhost:3000/check",
    null,
    {
        headers: {
            "X-API-Key": "sk_your_api_key_here"
        }
    }
);
    const body = JSON.parse(res.body);

    if (body.allowed) {
        allowedCounter.add(1);
    } else {
        deniedCounter.add(1);
    }

    console.log(res.body);
}