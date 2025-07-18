import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 10 },   // Light load
    { duration: '30s', target: 50 },   // Moderate load
    { duration: '30s', target: 100 },  // High load
    { duration: '30s', target: 200 },  // Very high load
    { duration: '30s', target: 300 },  // Push to breaking point
    { duration: '30s', target: 0 },    // Cool down
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'],  // 95% of requests under 1s
    http_req_failed: ['rate<0.05'],     // Allow max 5% failures
  },
};

const BASE_URL = 'http://localhost:8081'; // Change to your actual API URL

export default function () {
  const res = http.get(`${BASE_URL}/users`);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 1000ms': (r) => r.timings.duration < 1000,
  });

  sleep(1); // simulate think time
}
