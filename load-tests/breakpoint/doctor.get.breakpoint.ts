import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '5s', target: 10 },   // warm-up
    { duration: '5s', target: 50 },   // medium load
    { duration: '5s', target: 100 },  // increasing
    { duration: '5s', target: 200 },  // breakpoint
    { duration: '5s', target: 400 },  // heavy spike
    { duration: '5s', target: 0 },    // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<5000'],  // 95% under 5s
    http_req_failed: ['rate<0.05'],     // less than 5% errors
  },
};

const BASE_URL = 'http://localhost:8081'; // Update if needed

export default function () {
  const res = http.get(`${BASE_URL}/api/doctor`);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 1500ms': (r) => r.timings.duration < 1500,
  });

  sleep(1); // simulate think time
}
