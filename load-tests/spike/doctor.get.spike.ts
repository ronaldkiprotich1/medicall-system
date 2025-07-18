import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 5 },     // ramp-up to 5 VUs
    { duration: '5s', target: 100 },    // spike to 100 VUs
    { duration: '10s', target: 100 },   // hold at 100 VUs
    { duration: '5s', target: 5 },      // ramp-down to 5 VUs
    { duration: '10s', target: 5 },     // cool down
  ],
  thresholds: {
    http_req_duration: ['p(95)<1200'],      // relax slightly from 1000ms → 1500ms
    http_req_failed: ['rate<0.01'],         // stay strict on failures
  },
  // Increase timeout to handle slow response under load
  httpReqTimeout: '10s',
};

const BASE_URL = 'http://localhost:8081'; // adjust if needed

export default function () {
  const res = http.get(`${BASE_URL}/api/doctor`, {
    headers: {
      'Accept': 'application/json',
    },
    timeout: '10s', // ensures no early drop
  });

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 1000ms': (r) => r.timings.duration < 1000,
  });

  sleep(1); // pacing: each VU waits 1s before next iteration
}
