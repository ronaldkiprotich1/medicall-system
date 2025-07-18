import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 5 },    // Steady load
    { duration: '10s', target: 100 },  // Spike to 100 users suddenly
    { duration: '20s', target: 100 },  // Stay spiked for a short time
    { duration: '10s', target: 5 },    // Quickly drop back to normal
    { duration: '20s', target: 5 },    // Observe system recovery
  ],
  thresholds: {
    http_req_duration: ['p(95)<800'],   // 95% of requests < 800ms
    http_req_failed: ['rate<0.02'],     // <2% failure rate allowed
  },
};

const BASE_URL = 'http://localhost:8081'; 

export default function () {
  const res = http.get(`${BASE_URL}/users`);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 800ms': (r) => r.timings.duration < 800,
  });

  sleep(1); // simulate user think time
}
