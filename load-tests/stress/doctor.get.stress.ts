import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '5s', target: 5 },   // ramp up to 5 users
    { duration: '10s', target: 5 },  // hold for 10 seconds
    { duration: '5s', target: 0 },   // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<700'],
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = 'http://localhost:8081'; 

export default function () {
  const res = http.get(`${BASE_URL}/doctor`);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < ms': (r) => r.timings.duration < 700,
  });

  sleep(1);
}
