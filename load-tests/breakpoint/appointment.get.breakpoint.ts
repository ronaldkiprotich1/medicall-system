import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 10 },   // normal traffic
    { duration: '10s', target: 500 },  // massive spike
    { duration: '10s', target: 0 },    // sudden drop
  ],
  thresholds: {
    http_req_duration: ['p(95)<5000'], // 95% under 5s
    http_req_failed: ['rate<0.05'],    // <5% fail allowed
  },
};

const BASE_URL = 'http://localhost:8081';

export default function () {
  const res = http.get(`${BASE_URL}/api/appointments`);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 2000ms': (r) => r.timings.duration < 3000,
  });

  sleep(1);
}
