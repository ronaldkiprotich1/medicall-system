import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '5s', target: 5 },     
    { duration: '10s', target: 5 },    
    { duration: '10s', target: 0 },     
  ],
  thresholds: {
    http_req_duration: ['p(95)<600'],   
    http_req_failed: ['rate<0.01'],     
  },
};

const BASE_URL = 'http://localhost:8081'; 

export default function () {
  const res = http.get(`${BASE_URL}/api/users`);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 600ms': (r) => r.timings.duration < 600,
  });

  sleep(1); // simulate think time between requests
}
