import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 5 },     // Ramp-up to 5 users in 1 minute
    { duration: '10m', target: 5 },    // Stay at 5 users for 10 minutes
    { duration: '1m', target: 0 },     // Ramp-down to 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<600'],   // 95% of responses < 600ms
    http_req_failed: ['rate<0.01'],     // < 1% requests should fail
  },
};

const BASE_URL = 'http://localhost:8081'; // Change to your API host

export default function () {
  const res = http.get(`${BASE_URL}/users`);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 600ms': (r) => r.timings.duration < 600,
  });

  sleep(1); // simulate think time between requests
}
