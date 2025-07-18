import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 50 },  
    { duration: '20s', target: 50 },  
    { duration: '10s', target: 0 },   
  ],
  thresholds: {
    http_req_duration: ['p(95)<1200'], 
    http_req_failed: ['rate<0.05'],    
  },
};

const BASE_URL = 'http://localhost:8081';

export default function () {
  const res = http.get(`${BASE_URL}/api/doctor`);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 1000ms': (r) => r.timings.duration < 1000,
  });

  sleep(1); 
}
