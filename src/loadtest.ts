import http from "k6/http";
import {Counter} from "k6/metrics"

export const options = {
    vus: 100,
    iterations: 100,
};

const allowedCounter = new Counter("allowed_requests");
const deniedCounter = new Counter("denied_requests");

export default function () {
    const res = http.post(
        "http://localhost:3000/check",
        JSON.stringify({
            clientId: "load-test-1",
        }),
        {
            headers: {
                "Content-Type": "application/json",
            },
        }
    );
    const body = JSON.parse(res.body);

    if (body.allowed) {
        allowedCounter.add(1);
    } else {
        deniedCounter.add(1);
    }
}