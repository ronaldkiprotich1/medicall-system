import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '1m', target: 50 },  // ramp-up to 50 users
    { duration: '5m', target: 50 },  // stay at 50 users (soak phase)
    { duration: '1m', target: 0 },   // ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'],  // 95% of requests should be < 1000ms
    http_req_failed: ['rate<0.01'],     // <1% should fail
  },
};

const BASE_URL = 'http://localhost:8081/api';

export default function () {
  const res = http.get(`${BASE_URL}/appointments`);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 1000ms': (r) => r.timings.duration < 1000,
  });

  sleep(1);
}
