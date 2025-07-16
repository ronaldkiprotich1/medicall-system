import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 20,              // Number of virtual users
  duration: '30s',      // Duration of test
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be < 500ms
    http_req_failed: ['rate<0.01'],   // Error rate should be < 1%
  },
};

export default function () {
  const res = http.get('http://localhost:8081/api/payments'); 
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
