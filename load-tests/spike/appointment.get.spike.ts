import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },   // Ramp-up to 10 users
    { duration: '10s', target: 100 },  // Sudden spike to 100 users
    { duration: '30s', target: 10 },   // Ramp-down to 10 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% of requests should be < 1000ms
    http_req_failed: ['rate<0.01'],    // <1% failure rate
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
